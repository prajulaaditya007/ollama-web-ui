package handlers

import (
	"bufio"
	"log"
	"net/http"
	"os/exec"
	"strconv"
	"strings"

	"backend/repository"

	"github.com/gin-gonic/gin"
)

// HandleListModels queries installed LLM models on local Ollama
func HandleListModels(c *gin.Context) {
	cmd := exec.Command("ollama", "list")
	output, err := cmd.Output()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch models"})
		return
	}

	var models []string
	scanner := bufio.NewScanner(strings.NewReader(string(output)))
	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Fields(line)
		if len(fields) > 0 && fields[0] != "NAME" { // Ignore header
			models = append(models, fields[0])
		}
	}

	if len(models) == 0 {
		c.JSON(http.StatusOK, gin.H{"models": []string{}})
		return
	}

	c.JSON(http.StatusOK, gin.H{"models": models})
}

// HandleGetSessions returns all chat sessions for a specific user ID
func HandleGetSessions(c *gin.Context) {
	userIDStr := c.Query("user_id")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
		return
	}

	ctx := c.Request.Context()
	sessions, err := repository.GetSessions(ctx, userID)
	if err != nil {
		log.Printf("Error fetching sessions for user %d: %v", userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, sessions)
}

// HandleGetSessionMessages returns all messages for a specific session ID
func HandleGetSessionMessages(c *gin.Context) {
	sessionIDStr := c.Param("id")
	sessionID, err := strconv.Atoi(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Session ID"})
		return
	}

	ctx := c.Request.Context()
	messages, err := repository.GetSessionMessages(ctx, sessionID)
	if err != nil {
		log.Printf("Error fetching messages for session %d: %v", sessionID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, messages)
}

// HandleCreateSession handles creating a new session bound to a user ID
func HandleCreateSession(c *gin.Context) {
	var req struct {
		UserID   int    `json:"user_id"`
		Title    string `json:"title"`
		ModelID  string `json:"model_id"`
		Provider string `json:"provider"`
	}
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	if req.UserID == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required"})
		return
	}
	if req.Title == "" {
		req.Title = "New Chat"
	}
	if req.ModelID == "" {
		req.ModelID = "tinyllama:1.1b"
	}
	if req.Provider == "" {
		req.Provider = "ollama"
	}

	ctx := c.Request.Context()
	session, err := repository.CreateSession(ctx, req.UserID, req.Title, req.ModelID, req.Provider)
	if err != nil {
		log.Printf("Error creating session for user %d: %v", req.UserID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, session)
}

// HandleDeleteSession deletes a session safely verifying ownership
func HandleDeleteSession(c *gin.Context) {
	sessionIDStr := c.Param("id")
	sessionID, err := strconv.Atoi(sessionIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Session ID"})
		return
	}

	userIDStr := c.Query("user_id")
	if userIDStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User ID is required to verify ownership"})
		return
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
		return
	}

	ctx := c.Request.Context()
	err = repository.DeleteSession(ctx, sessionID, userID)
	if err != nil {
		log.Printf("Error deleting session %d for user %d: %v", sessionID, userID, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "deleted"})
}
