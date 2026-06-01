package repository

import (
	"context"
	"fmt"

	"backend/db"
	"backend/models"
)

// GetSessions returns all chat sessions for a specific user, ordered by updated_at descending
func GetSessions(ctx context.Context, userID int) ([]models.ChatSession, error) {
	pool := db.GetPool()
	if pool == nil {
		return nil, fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		SELECT id, user_id, is_pinned, title, model_id, provider, created_at, updated_at
		FROM chat_sessions
		WHERE user_id = $1
		ORDER BY updated_at DESC, created_at DESC;
	`
	rows, err := pool.Query(ctx, query, userID)
	if err != nil {
		return nil, fmt.Errorf("failed to query sessions: %w", err)
	}
	defer rows.Close()

	sessions := []models.ChatSession{}
	for rows.Next() {
		var s models.ChatSession
		err := rows.Scan(
			&s.ID,
			&s.UserID,
			&s.IsPinned,
			&s.Title,
			&s.ModelID,
			&s.Provider,
			&s.CreatedAt,
			&s.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan session row: %w", err)
		}
		sessions = append(sessions, s)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during sessions row iteration: %w", err)
	}

	return sessions, nil
}

// GetSessionMessages returns all messages for a specific session, ordered by creation time ascending
func GetSessionMessages(ctx context.Context, sessionID int) ([]models.Message, error) {
	pool := db.GetPool()
	if pool == nil {
		return nil, fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		SELECT id, session_id, token_count, role, content, created_at
		FROM messages
		WHERE session_id = $1
		ORDER BY created_at ASC;
	`
	rows, err := pool.Query(ctx, query, sessionID)
	if err != nil {
		return nil, fmt.Errorf("failed to query messages: %w", err)
	}
	defer rows.Close()

	messages := []models.Message{}
	for rows.Next() {
		var m models.Message
		err := rows.Scan(
			&m.ID,
			&m.SessionID,
			&m.TokenCount,
			&m.Role,
			&m.Content,
			&m.CreatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan message row: %w", err)
		}
		messages = append(messages, m)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error during messages row iteration: %w", err)
	}

	return messages, nil
}

// CreateSession creates a new session in the DB for a specific user
func CreateSession(ctx context.Context, userID int, title string, modelID string, provider string) (*models.ChatSession, error) {
	pool := db.GetPool()
	if pool == nil {
		return nil, fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		INSERT INTO chat_sessions (user_id, title, model_id, provider)
		VALUES ($1, $2, $3, $4)
		RETURNING id, user_id, is_pinned, title, model_id, provider, created_at, updated_at;
	`
	var s models.ChatSession
	err := pool.QueryRow(ctx, query, userID, title, modelID, provider).Scan(
		&s.ID,
		&s.UserID,
		&s.IsPinned,
		&s.Title,
		&s.ModelID,
		&s.Provider,
		&s.CreatedAt,
		&s.UpdatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return &s, nil
}

// SaveMessage saves a message turn in the database
func SaveMessage(ctx context.Context, sessionID int, role string, content string, tokenCount int) (*models.Message, error) {
	pool := db.GetPool()
	if pool == nil {
		return nil, fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		INSERT INTO messages (session_id, role, content, token_count)
		VALUES ($1, $2, $3, $4)
		RETURNING id, session_id, role, content, token_count, created_at;
	`
	var m models.Message
	err := pool.QueryRow(ctx, query, sessionID, role, content, tokenCount).Scan(
		&m.ID,
		&m.SessionID,
		&m.Role,
		&m.Content,
		&m.TokenCount,
		&m.CreatedAt,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to save message: %w", err)
	}

	return &m, nil
}

// UpdateSessionTimestamp updates the session's updated_at timestamp to now
func UpdateSessionTimestamp(ctx context.Context, sessionID int) error {
	pool := db.GetPool()
	if pool == nil {
		return fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		UPDATE chat_sessions
		SET updated_at = CURRENT_TIMESTAMP
		WHERE id = $1;
	`
	_, err := pool.Exec(ctx, query, sessionID)
	return err
}

// DeleteSession deletes a session for a specific user safely
func DeleteSession(ctx context.Context, sessionID int, userID int) error {
	pool := db.GetPool()
	if pool == nil {
		return fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		DELETE FROM chat_sessions
		WHERE id = $1 AND user_id = $2;
	`
	res, err := pool.Exec(ctx, query, sessionID, userID)
	if err != nil {
		return fmt.Errorf("failed to delete session: %w", err)
	}

	rowsAffected := res.RowsAffected()
	if rowsAffected == 0 {
		return fmt.Errorf("no session found to delete or unauthorized")
	}

	return nil
}

// UpdateMessageTokenCount updates the token count of a message in the messages table
func UpdateMessageTokenCount(ctx context.Context, messageID int, tokenCount int) error {
	pool := db.GetPool()
	if pool == nil {
		return fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		UPDATE messages
		SET token_count = $1
		WHERE id = $2;
	`
	_, err := pool.Exec(ctx, query, tokenCount, messageID)
	return err
}

// UpdateSessionTitle updates the title of a chat session in the chat_sessions table
func UpdateSessionTitle(ctx context.Context, sessionID int, title string) error {
	pool := db.GetPool()
	if pool == nil {
		return fmt.Errorf("connection failed to db, services are down")
	}

	query := `
		UPDATE chat_sessions
		SET title = $1
		WHERE id = $2;
	`
	_, err := pool.Exec(ctx, query, title, sessionID)
	return err
}
