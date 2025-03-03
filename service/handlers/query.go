package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// Queries Ollama with the chosen model and prompt
func QueryOllama(model string, prompt string) (string, error) {
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
		return "", fmt.Errorf("failed to reach Ollama API: %v", err)
	}
	defer resp.Body.Close()

	// ✅ Fix: Replace ioutil with io.ReadAll
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response body: %v", err)
	}

	var response map[string]interface{}
	json.Unmarshal(body, &response)

	if val, ok := response["response"].(string); ok {
		return val, nil
	}
	return "Error processing response", nil
}
