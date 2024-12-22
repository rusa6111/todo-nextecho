package model

import "time"

type User struct {
	ID        uint      `json:"id" param:"id" gorm:"primaryKey"`
	Name      string    `json:"name" gorm:"unique"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Todos []Todo `json:"todos"`
}

type Todo struct {
	ID        uint      `json:"id" param:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	User      User      `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	Done      bool      `json:"done"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`

	Comments []Comment `json:"comments"`
}

type Comment struct {
	ID        uint      `json:"id" param:"id" gorm:"primaryKey"`
	UserID    uint      `json:"user_id"`
	User      User      `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	TodoID    uint      `json:"todo_id"`
	Todo      Todo      `json:"-" gorm:"constraint:OnUpdate:CASCADE,OnDelete:SET NULL"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
