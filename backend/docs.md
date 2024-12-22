# API Documentation

## User

### Signup

**Description:**
Create a new user.

**Path:**
`POST /api/signup`

**Request Body:**
- `name`: User's name
- `password`: Password for the user

**Response:**
- `id`: New user's ID
- `name`: New user's name
- `created_at`: Creation time
- `updated_at`: Same as creation time


### Login

**Description:**
Login a user and get a JWT token.

**Path:**
`POST /api/login`

**Request Body:**
- `name`: User's name
- `password`: Password for the user

**Response:**
- `id`: User's ID
- `name`: User's name
- `created_at`: Creation time
- `updated_at`: Last update time


### Logout

**Description:**
Logout a user by clearing the JWT token.

**Path:**
`POST /api/logout`

**Response:**
- No content


### Get My Info

**Description:**
Get information about the logged-in user.

**Path:**
`GET /api/mydata`

**Response:**
- `id`: User's ID
- `name`: User's name
- `created_at`: Creation time
- `updated_at`: Last update time





## Todo

### Create Todo

**Description:**
Create a new todo.

**Path:**
`POST /api/todo`

**Request Body:**
- `title`: Title of the todo
- `content`: Content of the todo

**Response:**
- `id`: New todo's ID
- `title`: Title of the todo
- `content`: Content of the todo
- `done`: Completion status
- `created_at`: Creation time
- `updated_at`: Last update time


### Get Todos

**Description:**
Get all todos created by the logged-in user.

**Path:**
`GET /api/todo`

**Response:**
- List of todos

### Get Todo

**Description:**
Get a specific todo by ID.

**Path:**
`GET /api/todo/:id`

**Response:**
- `id`: Todo's ID
- `title`: Title of the todo
- `content`: Content of the todo
- `done`: Completion status
- `created_at`: Creation time
- `updated_at`: Last update time
- `comments`: List of comments


### Update Todo

**Description:**
Update a specific todo by ID.

**Path:**
`PUT /api/todo/:id`

**Request Body:**
- `title`: Title of the todo (optional)
- `content`: Content of the todo (optional)
- `done`: Completion status (optional)

**Response:**
- `id`: Updated todo's ID
- `title`: Title of the todo
- `content`: Content of the todo
- `done`: Completion status
- `created_at`: Creation time
- `updated_at`: Last update time


### Delete Todo

**Description:**
Delete a specific todo by ID.

**Path:**
`DELETE /api/todo/:id`

**Response:**
- No content






## Comment

### Create Comment

**Description:**
Create a new comment on a todo.

**Path:**
`POST /api/todo/:id/comment`

**Request Body:**
- `content`: Content of the comment

**Response:**
- `id`: New comment's ID
- `content`: Content of the comment
- `created_at`: Creation time
- `updated_at`: Last update time


### Get Comments

**Description:**
Get all comments for a specific todo.

**Path:**
`GET /api/todo/:id/comment`

**Response:**
- List of comments


### Update Comment

**Description:**
Update a specific comment by ID.

**Path:**
`PUT /api/todo/:id/comment/:comment_id`

**Request Body:**
- `content`: Content of the comment

**Response:**
- `id`: Updated comment's ID
- `content`: Content of the comment
- `created_at`: Creation time
- `updated_at`: Last update time


### Delete Comment

**Description:**
Delete a specific comment by ID.

**Path:**
`DELETE /api/todo/:id/comment/:comment_id`

**Response:**
- No content

