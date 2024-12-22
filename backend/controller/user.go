package controller

import (
	"fmt"
	"net/http"
	"os"
	"time"
	"todoapi/model"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
	"golang.org/x/crypto/bcrypt"
)

func CreateUser(c echo.Context) error {
	// Bind request body to struct
	var body struct {
		Name     string `validate:"required,max=16"`
		Password string `validate:"required,min=8"`
	}
	if err := c.Bind(&body); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("Bad Request: %v", err.Error()))
	}

	// Validate request body
	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("Bad Request: %v", err.Error()))
	}

	// Check if user already exists
	existedUser := model.User{}
	model.DB.Where("name = ?", body.Name).First(&existedUser)
	if existedUser.ID != 0 {
		return c.String(http.StatusConflict, "User already exists")
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Internal Server Error")
	}

	// Create user
	user := model.User{
		Name:     body.Name,
		Password: string(hash),
	}
	model.DB.Create(&user)

	return c.JSON(http.StatusOK, user)
}

func Login(c echo.Context) error { // Login by jwt
	// Bind request body to struct
	var body struct {
		Name     string `validate:"required,max=16"`
		Password string `validate:"required,min=8"`
	}
	if err := c.Bind(&body); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("Bad Request: %v", err.Error()))
	}

	// Validate request body
	validate := validator.New()
	if err := validate.Struct(body); err != nil {
		return c.String(http.StatusBadRequest, fmt.Sprintf("Bad Request: %v", err.Error()))
	}

	// Check if user exists
	user := model.User{}
	model.DB.Where("name = ?", body.Name).First(&user)
	if user.ID == 0 {
		return c.String(http.StatusNotFound, "User not found")
	}

	// Compare password
	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))
	if err != nil {
		return c.String(http.StatusUnauthorized, "Password is incorrect")
	}

	// Create token
	claims := jwt.MapClaims{
		"user": user.ID,
		"exp":  time.Now().Add(time.Hour * 24 * 14).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign token
	secret := []byte(os.Getenv("JWT_SECRET"))
	tokenString, err := token.SignedString(secret)
	if err != nil {
		return c.String(http.StatusInternalServerError, "Internal Server Error")
	}

	// Set token to cookie
	c.SetCookie(&http.Cookie{
		Name:     "Authorization",
		Value:    tokenString,
		Expires:  time.Now().Add(time.Hour * 24 * 14),
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // os.Getenv("ENV") == "production",
	})

	return c.JSON(http.StatusOK, user)
}

func Logout(c echo.Context) error {
	c.SetCookie(&http.Cookie{
		Name:     "Authorization",
		Value:    "",
		Expires:  time.Now().Add(-time.Hour),
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // os.Getenv("ENV") == "production",
	})

	return c.NoContent(http.StatusOK)
}

func GetMyInfo(c echo.Context) error {
	user := c.Get("user").(model.User)
	return c.JSON(http.StatusOK, user)
}
