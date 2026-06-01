package handlers

import (
	"crypto/sha256"
	"encoding/hex"
	"log"
	"net/http"
	"strings"
	"unicode"

	"backend/db"

	"github.com/gin-gonic/gin"
)

// AuthRequest maps the payload for login/registration
type AuthRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=4"`
	Username string `json:"username"`
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
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "connection failed to db, services are down"})
		return
	}

	ctx := c.Request.Context()
	hashedPass := hashPassword(req.Password)

	var id int
	var email, dbHashedPass string
	var username *string

	// Query to see if the user already exists
	queryExist := `
		SELECT id, email, password_hash, username
		FROM users
		WHERE email = $1;
	`
	err := pool.QueryRow(ctx, queryExist, req.Email).Scan(&id, &email, &dbHashedPass, &username)
	if err == nil {
		// User exists, verify password
		if dbHashedPass != hashedPass {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials. Password mismatch."})
			return
		}

		var usernameStr string
		if username != nil {
			usernameStr = *username
		}

		log.Printf("User '%s' authenticated successfully (ID: %d)", email, id)
		c.JSON(http.StatusOK, gin.H{
			"id":       id,
			"email":    email,
			"username": usernameStr,
		})
		return
	}

	// User does not exist, auto-register them
	if !validatePassword(req.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be greater than 8 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"})
		return
	}

	var registeredUsername *string
	queryCreate := `
		INSERT INTO users (email, password_hash, username)
		VALUES ($1, $2, NULLIF($3, ''))
		RETURNING id, email, username;
	`
	err = pool.QueryRow(ctx, queryCreate, req.Email, hashedPass, req.Username).Scan(&id, &email, &registeredUsername)
	if err != nil {
		log.Printf("Failed to register user %s: %v", req.Email, err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to automatically register user"})
		return
	}

	var registeredUsernameStr string
	if registeredUsername != nil {
		registeredUsernameStr = *registeredUsername
	}

	log.Printf("New user '%s' automatically registered and authenticated (ID: %d)", email, id)
	c.JSON(http.StatusCreated, gin.H{
		"id":       id,
		"email":    email,
		"username": registeredUsernameStr,
	})
}

// ResetPasswordRequest payload mapping
type ResetPasswordRequest struct {
	Email           string `json:"email" binding:"required,email"`
	NewPassword     string `json:"new_password" binding:"required"`
	ConfirmPassword string `json:"confirm_password" binding:"required"`
}

// HandleResetPassword handles direct password overrides
func HandleResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request fields"})
		return
	}

	if req.NewPassword != req.ConfirmPassword {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Passwords do not match"})
		return
	}

	if !validatePassword(req.NewPassword) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Password must be greater than 8 characters and contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"})
		return
	}

	pool := db.GetPool()
	if pool == nil {
		c.JSON(http.StatusServiceUnavailable, gin.H{"error": "connection failed to db, services are down"})
		return
	}

	ctx := c.Request.Context()

	// 1. Verify if email exists in DB
	var id int
	queryCheck := `SELECT id FROM users WHERE email = $1;`
	err := pool.QueryRow(ctx, queryCheck, req.Email).Scan(&id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Email is not registered."})
		return
	}

	// 2. Hash and update new password
	hashedPass := hashPassword(req.NewPassword)
	queryUpdate := `UPDATE users SET password_hash = $1 WHERE email = $2;`
	_, err = pool.Exec(ctx, queryUpdate, hashedPass, req.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	log.Printf("Password successfully updated for user '%s'", req.Email)
	c.JSON(http.StatusOK, gin.H{"status": "success", "message": "Password updated successfully"})
}

// Password validation helper
func validatePassword(password string) bool {
	if len(password) <= 8 {
		return false
	}
	var (
		hasUpper   bool
		hasLower   bool
		hasNumber  bool
		hasSpecial bool
	)
	for _, char := range password {
		switch {
		case unicode.IsUpper(char):
			hasUpper = true
		case unicode.IsLower(char):
			hasLower = true
		case unicode.IsDigit(char):
			hasNumber = true
		}
	}
	specialChars := "!@#$%^&*(),.?\":{}|<>_+-=[]\\/;`'~"
	if strings.ContainsAny(password, specialChars) {
		hasSpecial = true
	}
	return hasUpper && hasLower && hasNumber && hasSpecial
}
