package models

import "time"

// User represents a user inside the remote PostgreSQL users table
type User struct {
	ID           int       `json:"id" db:"id"`
	Email        string    `json:"email" db:"email"`
	Username     string    `json:"username" db:"username"`
	PasswordHash string    `json:"-" db:"password_hash"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
}

// ChatSession represents a chat session mapping precisely to the remote schema
type ChatSession struct {
	ID        int       `json:"id" db:"id"`
	UserID    int       `json:"user_id" db:"user_id"`
	IsPinned  bool      `json:"is_pinned" db:"is_pinned"`
	Title     string    `json:"title" db:"title"`
	ModelID   string    `json:"model_id" db:"model_id"`
	Provider  string    `json:"provider" db:"provider"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
	Messages  []Message `json:"messages,omitempty"`
}

// Message represents a chat message turn mapping precisely to the remote schema
type Message struct {
	ID         int       `json:"id" db:"id"`
	SessionID  int       `json:"session_id" db:"session_id"`
	TokenCount int       `json:"token_count" db:"token_count"`
	Role       string    `json:"role" db:"role"`
	Content    string    `json:"content" db:"content"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}
