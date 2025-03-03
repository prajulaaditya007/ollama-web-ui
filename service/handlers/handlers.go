package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Request structure from frontend
type QueryRequest struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
}

// Response structure to frontend
type QueryResponse struct {
	Response string `json:"response"`
}

// Handles user query to selected LLM
func HandleQuery(c *gin.Context) {
	var req QueryRequest
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Call QueryOllama from query.go
	ollamaResponse, err := QueryOllama(req.Model, req.Prompt)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get response from model"})
		return
	}

	c.JSON(http.StatusOK, QueryResponse{Response: ollamaResponse})
}
