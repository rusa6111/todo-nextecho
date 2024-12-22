package controller

import (
	"net/http"
	"todoapi/model"

	"github.com/go-playground/validator"
	"github.com/labstack/echo/v4"
)

func CreateComment(c echo.Context) error {
	// Bind request body to struct
	var body struct {
		TodoID  uint   `param:"id" validate:"required"`
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

	// Check if todo exists
	todo := model.Todo{}
	model.DB.First(&todo, body.TodoID)
	if todo.ID == 0 {
		return c.String(http.StatusNotFound, "Todo not found")
	}

	// Create comment
	user := c.Get("user").(model.User)
	comment := model.Comment{
		UserID:  user.ID,
		TodoID:  body.TodoID,
		Content: body.Content,
	}
	model.DB.Create(&comment)

	return c.JSON(http.StatusOK, comment)
}

func GetComments(c echo.Context) error {
	// get todo_id from path parameter
	todoID := c.Param("id")
	if todoID == "" {
		return c.String(http.StatusBadRequest, "Bad Request: id is required")
	}

	// Get comments
	comments := []model.Comment{}
	model.DB.Where("todo_id = ?", todoID).Find(&comments)

	return c.JSON(http.StatusOK, comments)
}

func UpdateComment(c echo.Context) error {
	// Bind request body to struct
	var body struct {
		CommentID uint   `param:"comment_id" validate:"required"`
		Content   string `validate:"required"`
	}
	if err := c.Bind(&body); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request: "+err.Error())
	}

	// Validate request body
	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.String(http.StatusBadRequest, "Bad Request: "+err.Error())
	}

	// Get comment
	comment := model.Comment{}
	model.DB.First(&comment, body.CommentID)

	// Check if comment exists
	if comment.ID == 0 {
		return c.String(http.StatusNotFound, "Not Found")
	}

	// Check if comment is created by myself
	user := c.Get("user").(model.User)
	if comment.UserID != user.ID {
		return c.String(http.StatusUnauthorized, "Unauthorized")
	}

	// Update comment
	comment.Content = body.Content
	model.DB.Save(&comment)

	return c.JSON(http.StatusOK, comment)
}

func DeleteComment(c echo.Context) error {
	// get comment_id from path parameter
	commentID := c.Param("id")
	if commentID == "" {
		return c.String(http.StatusBadRequest, "Bad Request: id is required")
	}

	// Get comment
	comment := model.Comment{}
	model.DB.First(&comment, commentID)

	// Check if comment exists
	if comment.ID == 0 {
		return c.String(http.StatusNotFound, "Not Found")
	}

	// Check if comment is created by myself
	user := c.Get("user").(model.User)
	if comment.UserID != user.ID {
		return c.String(http.StatusUnauthorized, "Unauthorized")
	}

	// Delete comment
	model.DB.Delete(&comment)

	return c.NoContent(http.StatusOK)
}
