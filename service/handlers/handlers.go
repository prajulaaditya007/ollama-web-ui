package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

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
