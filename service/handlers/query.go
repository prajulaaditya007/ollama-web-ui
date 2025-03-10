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

	requestBody, _ := json.Marshal(map[string]interface{}{
		"model":  model,
		"prompt": prompt,
		"stream": false,
	})

	resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(requestBody))
	if err != nil {
		return "", 0, fmt.Errorf("failed to reach Ollama API: %v", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", 0, fmt.Errorf("failed to read response body: %v", err)
	}

	var response map[string]interface{}
	if err := json.Unmarshal(body, &response); err != nil {
		return "", 0, fmt.Errorf("failed to parse response JSON: %v", err)
	}

	text, _ := response["response"].(string)
	tokens, _ := response["tokens_used"].(int)

	return text, tokens, nil
}
