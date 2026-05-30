package main

import (
	"fmt"
	"log"

	"backend/db"
	"backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize remote PostgreSQL Connection Pool and Auto-Migrations
	if err := db.InitDB(); err != nil {
		log.Fatalf("Fatal: Database initialization failed: %v", err)
	}

	router := gin.Default()

	// ✅ Enable CORS specifically for the Vite dev server
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "OPTIONS", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "X-Session-ID"},
		AllowCredentials: true,
	}))

	// API Routing Group
	api := router.Group("/api")
	{
		api.POST("/auth", handlers.HandleAuth)
		api.GET("/models", handlers.HandleListModels)
		api.GET("/sessions", handlers.HandleGetSessions)
		api.POST("/sessions", handlers.HandleCreateSession)
		api.GET("/sessions/:id/messages", handlers.HandleGetSessionMessages)
		api.DELETE("/sessions/:id", handlers.HandleDeleteSession)
		api.POST("/chat", handlers.HandleChatStream)
	}

	// Legacy route support, keeping models mapped at root if needed
	router.GET("/models", handlers.HandleListModels)

	fmt.Println("Ollama Studio Backend running on :8080")
	log.Fatal(router.Run(":8080"))
}
