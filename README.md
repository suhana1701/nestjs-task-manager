# Task Manager API (SDE Intern Backend Assessment)

A robust, production-ready RESTful API built with **NestJS**, **PostgreSQL**, and **TypeORM**. Securely manage tasks with JWT-based authentication and thorough input validation.

## ✨ Features

- **JWT Authentication**: Secure registration and login.
- **Task CRUD**: Create, Read, Update, and Delete tasks with ownership verification.
- **Input Validation**: Strict validation for all DTOs and API payloads.
- **PostgreSQL & TypeORM**: Relational database with automated entity synchronization.
- **Swagger Documentation**: Interactive API documentation.
- **Unit Testing**: Comprehensive test coverage for services and controllers.

---

## 🛠️ Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Database**: PostgreSQL
- **ORM**: [TypeORM](https://typeorm.io/)
- **Auth**: [Passport.js](http://www.passportjs.org/) + [JWT](https://jwt.io/)
- **Documentation**: [Swagger / OpenAPI](https://swagger.io/)
- **Testing**: [Jest](https://jestjs.io/)

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Docker](https://www.docker.com/) & Docker Compose (optional, for local Postgres)

### 2. Setup Database
You can use the included Docker Compose file to start a PostgreSQL instance:
```bash
docker-compose up -d
```

### 3. Environment Variables
The application uses a `.env` file for configuration. A sample configuration is provided:
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=taskdb

# JWT
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# App
PORT=3000
```

### 4. Installation & Execution
```bash
# Install dependencies
npm install

# Start in development mode
npm run start:dev
```

---

## 📖 API Documentation

Once the server is running, visit **`http://localhost:3000/api`** to view the interactive Swagger documentation.

#### Core Endpoints:
- `POST /auth/register`: Create a new user account.
- `POST /auth/login`: Authenticate and receive a JWT.
- `GET /users/me`: Get profile of currently logged-in user.
- `GET /tasks`: List all tasks for the current user.
- `POST /tasks`: Create a new task.
- `PATCH /tasks/:id`: Update an existing task.
- `DELETE /tasks/:id`: Delete a task.

---

## 🧪 Testing

The project includes unit tests for all services and controllers.

```bash
# Run unit tests
npm run test

# Run tests with coverage
npm run test:cov
```

---

## 📁 Project Structure

```text
src/
├── auth/            # JWT, Passport strategy, register/login logic
├── users/           # User entity, service, profile management
├── tasks/           # Task entity, full CRUD operations
├── app.module.ts    # Main app wiring & TypeORM config
└── main.ts          # App bootstrap with Global Pipes & Swagger
```
