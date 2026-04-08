# 🚀 NestJS Task Manager API

A production-ready backend API built with **NestJS**, **PostgreSQL**, and **TypeORM**.
This project demonstrates scalable backend architecture, authentication, and clean code practices.

---

## ✨ Features

* 🔐 JWT Authentication (Access + Refresh Tokens)
* 👤 User Registration & Login
* 📋 Task Management (CRUD Operations)
* ✅ Input Validation using class-validator
* 🗄️ PostgreSQL with TypeORM
* 🐳 Dockerized Database Setup
* 📄 Swagger API Documentation
* 🧪 Unit Testing

---

## 🔐 Authentication System

This project implements a **production-grade authentication system**:

* Access Token (short-lived, 15 minutes)
* Refresh Token (long-lived, 7 days)
* Secure storage of hashed refresh tokens in database
* Token rotation for enhanced security
* Logout functionality to invalidate sessions

### Auth Endpoints:

* `POST /auth/register` → Register new user
* `POST /auth/login` → Login user
* `POST /auth/refresh` → Get new access token
* `POST /auth/logout` → Logout user

---

## 📋 Task Endpoints

* `GET /tasks` → Get all tasks
* `POST /tasks` → Create task
* `PATCH /tasks/:id` → Update task
* `DELETE /tasks/:id` → Delete task

---

## 🛠️ Tech Stack

* **Backend:** NestJS (Node.js)
* **Database:** PostgreSQL
* **ORM:** TypeORM
* **Authentication:** JWT
* **Validation:** class-validator
* **Containerization:** Docker

---

## ⚙️ Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/suhana1701/nestjs-task-manager.git
cd nestjs-task-manager
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Database

```bash
docker-compose up
```

### 4. Run Application

```bash
npm run start:dev
```

---

## 📄 API Documentation

Swagger UI available at:

```
http://localhost:3000/api
```

---

## 🧪 Run Tests

```bash
npm run test
```

---

## 🌟 Key Highlights

* Modular architecture using NestJS
* Secure authentication with refresh tokens
* Clean and maintainable code structure
* Production-ready backend practices

---

## 👩‍💻 Author

Suhana Jain
