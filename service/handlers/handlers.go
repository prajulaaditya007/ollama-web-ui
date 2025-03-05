package handlers

import (
	"bufio"
	"net/http"
	"os/exec"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

// Response structure for models
type ModelsResponse struct {
	Models []string `json:"models"`
}

// Request structure from frontend
type QueryRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
}

// Response structure to frontend
type QueryResponse struct {
	Model      string  `json:"model"`
	Response   string  `json:"response"`
	Status     string  `json:"status"`
	TimeTaken  float64 `json:"time_taken"`            // In seconds
	TokensUsed int     `json:"tokens_used,omitempty"` // Optional field
}

// Handles fetching installed LLM models
func HandleListModels(c *gin.Context) {
	// Execute `ollama list` command
	cmd := exec.Command("ollama", "list")
	output, err := cmd.Output()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch models"})
		return
	}

	// Parse output and extract model names
	var models []string
	scanner := bufio.NewScanner(strings.NewReader(string(output)))
	for scanner.Scan() {
		line := scanner.Text()
		fields := strings.Fields(line)
		if len(fields) > 0 && fields[0] != "NAME" { // Ignore header
			models = append(models, fields[0]) // First column is model name
		}
	}

	if len(models) == 0 {
		c.JSON(http.StatusOK, gin.H{"models": []string{}})
		return
	}

	c.JSON(http.StatusOK, ModelsResponse{Models: models})
}

// Handles user query to selected LLM
func HandleQuery(c *gin.Context) {
	var req QueryRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Start timer
	startTime := time.Now()

	// Call QueryOllama from query.go
	ollamaResponse, tokensUsed, err := QueryOllama(req.Model, req.Prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get response from model"})
		return
	}

	// Calculate API response time
	elapsedTime := time.Since(startTime).Seconds()

	// Send updated response
	c.JSON(http.StatusOK, QueryResponse{
		Model:      req.Model,
		Response:   ollamaResponse,
		Status:     "success",
		TimeTaken:  elapsedTime,
		TokensUsed: tokensUsed,
	})
}
