package main

import (
	"fmt"
	"log"

	"backend/handlers"

	"github.com/gin-contrib/cors" // Import CORS middleware
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()

	// ✅ Enable CORS
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"}, // Allow frontend origin
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	// Route for querying Ollama
	router.POST("/query", handlers.HandleQuery)

	fmt.Println("Server running on :8080")
	log.Fatal(router.Run(":8080"))
}
