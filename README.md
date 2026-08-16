# Smart API Guard

A full-stack API security and monitoring platform built with Spring Boot and React.

Smart API Guard provides API request protection through rate limiting, request tracking, and analytics. It also provides a dashboard to monitor API usage and security activity.

## 🚀 Live Demo

https://smart-api-guard-1.onrender.com/

## ✨ Features

- API rate limiting
- Request monitoring and tracking
- API usage analytics
- Blocked request tracking
- Success/failure metrics
- PostgreSQL database persistence
- RESTful backend APIs
- React-based dashboard
- Automated backend tests
- Production deployment with Render

## 🛠️ Tech Stack

### Backend
- Java 17+
- Spring Boot
- Spring Data JPA
- Hibernate
- Maven
- PostgreSQL

### Frontend
- React
- JavaScript
- npm

### Testing
- JUnit
- Mockito
- Spring Boot Test

### Deployment
- Render
- PostgreSQL / Neon

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │      React UI       │
                    │     Dashboard       │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot      │
                    │      Backend        │
                    ├─────────────────────┤
                    │  Rate Limit Filter  │
                    │  Controllers        │
                    │  Services           │
                    │  Analytics          │
                    └──────────┬──────────┘
                               │
                               │ JPA
                               ▼
                    ┌─────────────────────┐
                    │     PostgreSQL      │
                    │      Database       │
                    └─────────────────────┘
