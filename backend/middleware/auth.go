package middleware

import (
	"log"
	"net/http"
	"os"
	"time"
	"todoapi/model"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

func RequireAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		tokenString, err := c.Cookie("Authorization")
		if err != nil {
			return c.String(http.StatusUnauthorized, "Error: No Authorization Cookie")
		}

		// validate jwt
		token, err := jwt.Parse(tokenString.Value, func(token *jwt.Token) (interface{}, error) {
			secret := []byte(os.Getenv("JWT_SECRET"))
			return secret, nil
		})

		if err != nil {
			log.Println(err)
			return c.String(http.StatusUnauthorized, "Error: Invalid JWT: "+err.Error())
		}
		if !token.Valid {
			return c.String(http.StatusUnauthorized, "Error: JWT Not Valid")
		}

		// check expired
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if claims["exp"] == nil {
				return c.String(http.StatusUnauthorized, "Error: No Expiration Claim")
			}
			if int64(claims["exp"].(float64)) < time.Now().Unix() {
				return c.String(http.StatusUnauthorized, "Error: JWT Expired")
			}
			var user model.User
			model.DB.First(&user, claims["user"])
			c.Set("user", user)
		} else {
			return c.String(http.StatusUnauthorized, "Error: Invalid Claims")
		}

		return next(c)
	}
}
