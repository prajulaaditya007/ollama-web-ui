package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"log"
	"net/http"

	"backend/db"

	"github.com/gin-gonic/gin"
)

// AuthRequest maps the payload for login/registration
type AuthRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=4"`
}

// SHA256 hashing helper
func hashPassword(password string) string {
	hasher := sha256.New()
	hasher.Write([]byte(password))
	return hex.EncodeToString(hasher.Sum(nil))
}

// HandleAuth coordinates login and auto-registration
func HandleAuth(c *gin.Context) {
	var req AuthRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email or password format (minimum 4 characters)"})
		return
	}

	pool := db.GetPool()
	if pool == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database pool is not initialized"})
		return
	}

	ctx := c.Request.Context()
	hashedPass := hashPassword(req.Password)

	var id int
	var email, dbHashedPass string

	// Query to see if the user already exists
	queryExist := `
		SELECT id, email, password_hash
		FROM users
		WHERE email = $1;
	`
	err := pool.QueryRow(ctx, queryExist, req.Email).Scan(&id, &email, &dbHashedPass)
	if err == nil {
		// User exists, verify password
		if dbHashedPass != hashedPass {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials. Password mismatch."})
			return
		}

		log.Printf("User '%s' authenticated successfully (ID: %d)", email, id)
		c.JSON(http.StatusOK, gin.H{
			"id":    id,
			"email": email,
		})
		return
	}

	// User does not exist, auto-register them
	queryCreate := `
		INSERT INTO users (email, password_hash)
		VALUES ($1, $2)
		RETURNING id, email;
	`
	err = pool.QueryRow(ctx, queryCreate, req.Email, hashedPass).Scan(&id, &email)
	if err != nil {
		log.Printf("Failed to register user %s: %v", req.Email, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to automatically register user"})
		return
	}

	log.Printf("New user '%s' automatically registered and authenticated (ID: %d)", email, id)
	c.JSON(http.StatusCreated, gin.H{
		"id":    id,
		"email": email,
	})
}
