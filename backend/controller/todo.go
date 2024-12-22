package controller

import (
	"net/http"
	"todoapi/model"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

func CreateTodo(c echo.Context) error {
	// Bind request body to struct
	var body struct {
		Title   string `validate:"required,max=256"`
		Content string `validate:"required"`
	}
	if err := c.Bind(&body); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request: "+err.Error())
	}

	// Validate request body
	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request: "+err.Error())
	}

	// Create todo
	user := c.Get("user").(model.User)
	todo := model.Todo{
		Title:   body.Title,
		Content: body.Content,
		UserID:  user.ID,
		Done:    false,
	}
	model.DB.Create(&todo)

	return c.JSON(http.StatusOK, todo)
}

func GetTodo(c echo.Context) error {
	// get todo_id from path parameter
	todoID := c.Param("id")
	if todoID == "" {
		return c.String(http.StatusBadRequest, "Bad Request: id is required")
	}

	// Get todo
	todo := model.Todo{}
	model.DB.Preload("Comments").First(&todo, todoID)

	// Check if todo exists
	if todo.ID == 0 {
		return c.String(http.StatusNotFound, "Not Found")
	}

	// Check if todo is created by myself
	user := c.Get("user").(model.User)
	if todo.UserID != user.ID {
		return c.String(http.StatusUnauthorized, "Unauthorized")
	}

	return c.JSON(http.StatusOK, todo)
}

func GetTodos(c echo.Context) error { // Get all todos created by myself
	user := c.Get("user").(model.User)
	todos := []model.Todo{}
	model.DB.Where("user_id = ?", user.ID).Find(&todos)
	return c.JSON(http.StatusOK, todos)
}

func UpdateTodo(c echo.Context) error {
	// Bind request body to struct
	var Body struct {
		ID      uint   `param:"id" validate:"required"`
		Title   string `validate:"max=256"`
		Content string
		Done    *bool
	}
	if err := c.Bind(&Body); err != nil {
		return err
	}

	// Validate request body
	validate := validator.New()
	if err := validate.Struct(Body); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request: "+err.Error())
	}

	// Get todo
	todo := model.Todo{}
	model.DB.First(&todo, Body.ID)

	// Check if todo exists
	if todo.ID == 0 {
		return c.String(http.StatusNotFound, "Not Found")
	}

	// Check if todo is created by myself
	user := c.Get("user").(model.User)
	if todo.UserID != user.ID {
		return c.String(http.StatusUnauthorized, "Unauthorized")
	}

	// Update todo
	if Body.Title != "" {
		todo.Title = Body.Title
	}
	if Body.Content != "" {
		todo.Content = Body.Content
	}
	if Body.Done != nil {
		todo.Done = *Body.Done
	}

	model.DB.Omit("CreatedAt").Save(&todo)

	return c.JSON(http.StatusOK, todo)
}

func DeleteTodo(c echo.Context) error {
	// get todo_id from path parameter
	todoID := c.Param("id")
	if todoID == "" {
		return c.String(http.StatusBadRequest, "Bad Request: id is required")
	}

	// Get todo
	todo := model.Todo{}
	model.DB.First(&todo, todoID)

	// Check if todo exists
	if todo.ID == 0 {
		return c.String(http.StatusNotFound, "Not Found")
	}

	// Check if todo is created by myself
	user := c.Get("user").(model.User)
	if todo.UserID != user.ID {
		return c.String(http.StatusUnauthorized, "Unauthorized")
	}

	// Delete todo
	model.DB.Delete(&todo)

	return c.NoContent(http.StatusOK)
}
