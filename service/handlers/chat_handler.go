package handlers

import (
	"bufio"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"

	"backend/repository"

	"github.com/gin-gonic/gin"
)

const maxDocumentContextRunes = 120000

// ChatRequest defines the request body mapping (including user_id)
type ChatRequest struct {
	UserID    int      `json:"user_id"`
	SessionID int      `json:"session_id"`
	Prompt    string   `json:"prompt"`
	ModelID   string   `json:"model_id"`
	Images    []string `json:"images,omitempty"`
	DocText   string   `json:"doc_text,omitempty"`
}

// OllamaChatMessage defines Ollama's inner history parameters
type OllamaChatMessage struct {
	Role    string   `json:"role"`
	Content string   `json:"content"`
	Images  []string `json:"images,omitempty"`
}

// OllamaChatRequest defines payload mapping to http://localhost:11434/api/chat
type OllamaChatRequest struct {
	Model    string              `json:"model"`
	Messages []OllamaChatMessage `json:"messages"`
	Stream   bool                `json:"stream"`
}

// OllamaChatResponseChunk defines streaming output from Ollama
type OllamaChatResponseChunk struct {
	Model           string            `json:"model"`
	Message         OllamaChatMessage `json:"message"`
	Done            bool              `json:"done"`
	EvalCount       int               `json:"eval_count"`
	PromptEvalCount int               `json:"prompt_eval_count"`
}

// HandleChatStream handles POST /api/chat streaming orchestration with auto-sessions
func HandleChatStream(c *gin.Context) {
	var req ChatRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if req.Prompt == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Prompt is required"})
		return
	}

	if req.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	if req.ModelID == "" {
		req.ModelID = "tinyllama:1.1b"
	}

	ctx := c.Request.Context()
	var isNewSession = false
	var sessionTitle = ""

	// 1. If session_id is 0 or empty, automatically create a new session in database
	if req.SessionID == 0 {
		isNewSession = true
		sessionTitle = getSessionTitle(req.Prompt)
		session, err := repository.CreateSession(ctx, req.UserID, sessionTitle, req.ModelID, "ollama")
		if err != nil {
			log.Printf("Failed to auto-create session for user %d: %v", req.UserID, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to automatically create a new session"})
			return
		}
		req.SessionID = session.ID
		log.Printf("Auto-created chat session %d for user %d", req.SessionID, req.UserID)
	} else {
		// If session already exists, check if it is brand new and empty (e.g. pre-created "New Chat" session)
		// and dynamically rename it on the first prompt.
		existingMsgs, err := repository.GetSessionMessages(ctx, req.SessionID)
		if err == nil && len(existingMsgs) == 0 {
			isNewSession = true
			sessionTitle = getSessionTitle(req.Prompt)
			_ = repository.UpdateSessionTitle(ctx, req.SessionID, sessionTitle)
			log.Printf("Dynamically renamed empty session %d to: %s", req.SessionID, sessionTitle)
		}
	}

	// 2. Save User prompt to messages table
	userMsg, err := repository.SaveMessage(ctx, req.SessionID, "user", req.Prompt, 0)
	if err != nil {
		log.Printf("Failed to save user message: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user message"})
		return
	}

	// Update session's updated_at timestamp
	_ = repository.UpdateSessionTimestamp(ctx, req.SessionID)

	// 3. Load conversation history to compile full multi-turn array
	dbMessages, err := repository.GetSessionMessages(ctx, req.SessionID)
	if err != nil {
		log.Printf("Failed to load message history: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load session history"})
		return
	}

	// 4. Map DB message structures to Ollama compatible structures
	var chatHistory []OllamaChatMessage
	currentUserTurnIndex := -1
	for _, dbMsg := range dbMessages {
		role := dbMsg.Role
		if role == "model" {
			role = "assistant"
		}
		chatHistory = append(chatHistory, OllamaChatMessage{
			Role:    role,
			Content: dbMsg.Content,
		})
		if userMsg != nil && dbMsg.ID == userMsg.ID {
			currentUserTurnIndex = len(chatHistory) - 1
		}
	}

	if currentUserTurnIndex >= 0 {
		chatHistory[currentUserTurnIndex].Content = buildUserPromptWithDocumentContext(
			chatHistory[currentUserTurnIndex].Content,
			req.DocText,
		)
		if len(req.Images) > 0 {
			chatHistory[currentUserTurnIndex].Images = req.Images
		}
	}

	// 5. Serialize Ollama payload
	payload := OllamaChatRequest{
		Model:    req.ModelID,
		Messages: chatHistory,
		Stream:   true,
	}
	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Failed to serialize Ollama payload: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal serialization error"})
		return
	}

	// 6. Query local Ollama service
	ollamaURL := "http://localhost:11434/api/chat"
	resp, err := http.Post(ollamaURL, "application/json", bytes.NewBuffer(payloadBytes))
	if err != nil {
		log.Printf("Failed to connect to local Ollama: %v", err)
		c.JSON(http.StatusBadGateway, gin.H{"error": "Ollama service is unreachable. Ensure it is running locally."})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Ollama returned non-200 code: %d, body: %s", resp.StatusCode, string(body))
		c.JSON(http.StatusBadGateway, gin.H{"error": fmt.Sprintf("Ollama error: status %d", resp.StatusCode)})
		return
	}

	// Set streaming response headers
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")

	writer := c.Writer
	bufReader := bufio.NewReader(resp.Body)

	// If a new session was created, stream metadata as the first SSE line so the frontend captures it
	if isNewSession {
		metaChunk := map[string]interface{}{
			"session_id": req.SessionID,
			"title":      sessionTitle,
			"model_id":   req.ModelID,
		}
		metaBytes, _ := json.Marshal(metaChunk)
		_, _ = writer.Write(append(metaBytes, '\n'))
		writer.Flush()
	}

	var assistantResponse strings.Builder
	var evalTokenCount = 0
	var promptTokenCount = 0

	// 7. Real-time stream read and flush loop
	for {
		line, err := bufReader.ReadBytes('\n')
		if len(line) > 0 {
			_, _ = writer.Write(line)
			writer.Flush()

			var chunk OllamaChatResponseChunk
			if jsonErr := json.Unmarshal(line, &chunk); jsonErr == nil {
				if chunk.Message.Content != "" {
					assistantResponse.WriteString(chunk.Message.Content)
				}
				if chunk.Done {
					evalTokenCount = chunk.EvalCount
					promptTokenCount = chunk.PromptEvalCount
				}
			}
		}

		if err != nil {
			if err == io.EOF {
				break
			}
			log.Printf("Error reading stream from Ollama: %v", err)
			break
		}
	}

	// 8. Save the Assistant turn in the DB on stream end
	responseText := assistantResponse.String()
	if responseText != "" {
		_, dbSaveErr := repository.SaveMessage(ctx, req.SessionID, "model", responseText, evalTokenCount)
		if dbSaveErr != nil {
			log.Printf("Failed to save assistant response message: %v", dbSaveErr)
		} else {
			// Update session timestamp on complete
			_ = repository.UpdateSessionTimestamp(ctx, req.SessionID)
		}
	}

	// 9. Update the User message in the DB with its input token count
	if promptTokenCount > 0 && userMsg != nil {
		_ = repository.UpdateMessageTokenCount(ctx, userMsg.ID, promptTokenCount)
	}
}

// Utility to create a session title from the first prompt
func getSessionTitle(prompt string) string {
	prompt = strings.TrimSpace(prompt)
	runes := []rune(prompt)
	if len(runes) > 30 {
		return string(runes[:30]) + "..."
	}
	return prompt
}

func buildUserPromptWithDocumentContext(prompt string, docText string) string {
	docText = strings.TrimSpace(docText)
	if docText == "" {
		return prompt
	}

	docRunes := []rune(docText)
	truncated := false
	if len(docRunes) > maxDocumentContextRunes {
		docText = string(docRunes[:maxDocumentContextRunes])
		truncated = true
	}

	var builder strings.Builder
	builder.WriteString("Use the following extracted document text as context for the user's request.")
	if truncated {
		builder.WriteString(" The document text was truncated to fit the local model context window.")
	}
	builder.WriteString("\n\n<document_context>\n")
	builder.WriteString(docText)
	builder.WriteString("\n</document_context>\n\n")
	builder.WriteString(prompt)
	return builder.String()
}
