package handlers

import (
	"net/http"
	"strconv"

	"backend/db"

	"github.com/gin-gonic/gin"
)

// HandleUpdateUsername handles PATCH /api/user/:id to update user's display username
func HandleUpdateUsername(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
		return
	}

	var req struct {
		Username string `json:"username" binding:"required,min=2,max=50"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Username must be between 2 and 50 characters"})
		return
	}

	pool := db.GetPool()
	if pool == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "connection failed to db, services are down"})
		return
	}

	query := `
		UPDATE users
		SET username = $1
		WHERE id = $2;
	`
	_, err = pool.Exec(c.Request.Context(), query, req.Username, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update username in database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"status":   "success",
		"username": req.Username,
	})
}
