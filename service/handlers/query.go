package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Queries Ollama with the chosen model and prompt
func QueryOllama(model string, prompt string) (string, int, error) {
	apiURL := "http://localhost:11434/api/generate"

	// Create request payload
	requestBody, _ := json.Marshal(map[string]interface{}{
		"model":  model,
		"prompt": prompt,
		"stream": false,
	})

	// Send HTTP request
	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return "", 0, fmt.Errorf("failed to reach Ollama API: %v", err)
	}
	defer resp.Body.Close()

	// Read response body
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", 0, fmt.Errorf("failed to read response body: %v", err)
	}

	// Parse JSON response
	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		return "", 0, fmt.Errorf("failed to parse JSON response: %v", err)
	}

	// Extract response text
	textResponse, _ := response["response"].(string)

	// Extract token count if available
	tokensUsed := 0
	if val, ok := response["tokens_used"].(float64); ok {
		tokensUsed = int(val)
	}

	return textResponse, tokensUsed, nil
}
