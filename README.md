# Task Management API (Node.js + Express + MongoDB)

This is a **Task Management REST API** built using **Node.js, Express, MongoDB, and JWT authentication**. The project supports:

- User authentication (signup, login, logout)
- User self-service actions
- Task CRUD operations
- Admin-only user management
- Secure JWT-based route protection

---

## Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT Authentication**
- **Cookie-based auth**
- **dotenv** for environment variables

---

## Project Structure

```
├── controllers/
├── middlewares/
├── models/
├── routers/
│   ├── auth.router.js
│   ├── user.router.js
│   ├── admin.router.js
│   └── task.router.js
├── utils/
├── app.js
├── server.js
├── .env
└── package.json
```

---

## Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Ankitaa1609/Todo-Management-API
cd Todo-Management-API
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Environment Variables Setup

Create a `.env` file in the root directory:

```env
PORT=
DB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES_IN=
```

⚠️ **Important:** Do not commit `.env` to version control.

---

### 4. Start the Server

```bash
npm start
```

OR (for development with nodemon):

```bash
npm run dev
```

Server will start on:

```
http://localhost:{PORT}
```

---

### 5. Health Check

```http
GET /
```

Response:

```json
{
  "status": "ok"
}
```

---

## API Routes Documentation

Base URL:

```
/api/v1
```

---

## 🔐 Authentication Routes (Public)

### Signup

```http
POST /api/v1/auth/signup
```

**Description:** Register a new user

---

### Login

```http
POST /api/v1/auth/login
```

**Description:** Authenticate user and set JWT cookie

---

### Logout

```http
POST /api/v1/auth/logout
```

**Description:** Clears authentication cookie

---

## 👤 User Self-Service Routes (Authenticated)

> Requires valid JWT

### Get Current User

```http
GET /api/v1/users/me
```

---

### Update Current User

```http
PATCH /api/v1/users/updateMe
```

---

### Delete Current User

```http
DELETE /api/v1/users/deleteMe
```

---

## ✅ Task Routes (Authenticated Users)

> Requires valid JWT

### Create Task

```http
POST /api/v1/tasks
```

---

### Get My Tasks

```http
GET /api/v1/tasks
```

---

### Get Single Task

```http
GET /api/v1/tasks/:id
```

---

### Update Task

```http
PATCH /api/v1/tasks/:id
```

---

### Delete Task

```http
DELETE /api/v1/tasks/:id
```

---

## 🛡️ Admin Routes (Admin Only)

> Requires JWT + role = `admin`

### Get All Users

```http
GET /api/v1/admin/users
```

---

### Update User (Admin)

```http
PATCH /api/v1/admin/users/:id
```

---

### Delete User (Admin)

```http
DELETE /api/v1/admin/users/:id
```

---

## Error Handling

- Centralized global error handler
- Custom `AppError` class
- Handles:
  - Invalid routes
  - Auth errors
  - Validation errors
  - Database errors

---

## Security Features

- JWT-based authentication
- Role-based access control
- Protected routes
- HTTP-only cookies

---

## Notes

- MongoDB Atlas is recommended
- Use Postman or Thunder Client for API testing
- Admin role must be manually assigned in DB


