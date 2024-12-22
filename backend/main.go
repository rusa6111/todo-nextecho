package main

import (
	"net/http"
	"os"

	"todoapi/controller"
	authMiddleware "todoapi/middleware"
	"todoapi/model"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func helloWorld(c echo.Context) error {
	return c.String(http.StatusOK, os.Getenv("DB_HOST"))
}

func main() {
	e := echo.New()
	db, _ := model.DB.DB()
	defer db.Close()

	e.Use(middleware.Logger())
	e.Use(middleware.Recover())

	e.GET("/api/", helloWorld)
	e.POST("/api/signup", controller.CreateUser)
	e.POST("/api/login", controller.Login)
	e.POST("/api/logout", controller.Logout)
	e.GET("/api/mydata", controller.GetMyInfo, authMiddleware.RequireAuth)

	e.POST("/api/todo", controller.CreateTodo, authMiddleware.RequireAuth)
	e.GET("/api/todo", controller.GetTodos, authMiddleware.RequireAuth)
	e.GET("/api/todo/:id", controller.GetTodo, authMiddleware.RequireAuth)
	e.PUT("/api/todo/:id", controller.UpdateTodo, authMiddleware.RequireAuth)
	e.DELETE("/api/todo/:id", controller.DeleteTodo, authMiddleware.RequireAuth)

	e.POST("/api/todo/:id/comment", controller.CreateComment, authMiddleware.RequireAuth)
	e.GET("/api/todo/:id/comment", controller.GetComments, authMiddleware.RequireAuth)
	e.PUT("/api/todo/:id/comment/:comment_id", controller.UpdateComment, authMiddleware.RequireAuth)
	e.DELETE("/api/todo/:id/comment/:comment_id", controller.DeleteComment, authMiddleware.RequireAuth)

	e.Logger.Fatal(e.Start(":8080"))
}
