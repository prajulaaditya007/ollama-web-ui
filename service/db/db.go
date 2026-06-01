package db

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var (
	Pool    *pgxpool.Pool
	VaderID int
)

// InitDB initializes pgxpool and performs remote table schema mapping & Vader seeding
func InitDB() error {
	_ = godotenv.Load()
	if envPath, err := filepath.Abs(".env"); err == nil {
		_ = godotenv.Load(envPath)
	}
	_ = godotenv.Load("service/.env")
	_ = godotenv.Load("../service/.env")

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		log.Println("WARNING: DATABASE_URL is not set in environmental variables or .env file. Database features will be disabled.")
		Pool = nil
		return nil
	}

	log.Printf("Connecting to PostgreSQL at: %s", connStr)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Printf("WARNING: failed to parse connection config: %v. Database features will be disabled.", err)
		Pool = nil
		return nil
	}

	pool, err := pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		log.Printf("WARNING: failed to create pool: %v. Database features will be disabled.", err)
		Pool = nil
		return nil
	}

	if err := pool.Ping(ctx); err != nil {
		log.Printf("WARNING: failed to ping database: %v. Database features will be disabled.", err)
		Pool = nil
		return nil
	}

	Pool = pool
	log.Println("Database connection pool initialized successfully.")

	if err := migrateAndSeed(ctx); err != nil {
		log.Printf("WARNING: database schema setup failed: %v. Database features will be disabled.", err)
		Pool.Close()
		Pool = nil
		return nil
	}

	return nil
}

func migrateAndSeed(ctx context.Context) error {
	if Pool == nil {
		return fmt.Errorf("database pool is not initialized")
	}

	// Create tables if they do not exist (matching exact remote column definitions)
	queries := []string{
		`CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			password_hash TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(100);`,
		`CREATE TABLE IF NOT EXISTS chat_sessions (
			id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
			is_pinned BOOLEAN DEFAULT FALSE,
			title VARCHAR(255) NOT NULL,
			model_id VARCHAR(255) NOT NULL,
			provider VARCHAR(255) NOT NULL DEFAULT 'ollama',
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
		`CREATE TABLE IF NOT EXISTS messages (
			id SERIAL PRIMARY KEY,
			session_id INTEGER REFERENCES chat_sessions(id) ON DELETE CASCADE,
			token_count INTEGER DEFAULT 0,
			role VARCHAR(255) NOT NULL,
			content TEXT NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);`,
	}

	for i, q := range queries {
		if _, err := Pool.Exec(ctx, q); err != nil {
			return fmt.Errorf("migration step %d failed: %w", i+1, err)
		}
	}
	log.Println("Database tables validated/created successfully.")

	// Seed Vader User (no 'name' column in users)
	vaderEmail := "vader@darth.in"
	vaderPassHash := "pbkdf2_sha256$260000$vader_pass_hash"
	seedQuery := `
		INSERT INTO users (email, password_hash)
		VALUES ($1, $2)
		ON CONFLICT (email) DO UPDATE SET email = EXCLUDED.email
		RETURNING id;
	`
	err := Pool.QueryRow(ctx, seedQuery, vaderEmail, vaderPassHash).Scan(&VaderID)
	if err != nil {
		return fmt.Errorf("failed to seed dummy user Vader: %w", err)
	}

	log.Printf("Dummy User 'Vader' successfully verified with ID: %d", VaderID)
	return nil
}

// GetPool helper
func GetPool() *pgxpool.Pool {
	return Pool
}
