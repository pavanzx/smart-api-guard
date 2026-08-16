# 🛡️ Smart API Guard

> A full-stack API security and traffic management platform for monitoring, protecting, and analyzing API requests.

[![Live Demo](https://img.shields.io/badge/Live-Demo-success)](https://smart-api-guard-1.onrender.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/pavanzx/smart-api-guard)

---

## 🚀 Live Demo

👉 **[Open Smart API Guard](https://smart-api-guard-1.onrender.com/)**

👉 **[View Source Code on GitHub](https://github.com/pavanzx/smart-api-guard)**

---

## 📌 Overview

Smart API Guard is a full-stack web application designed to provide visibility and control over API traffic.

The platform allows API requests to be monitored and protected through API key validation, rate limiting, request tracking, and analytics.

It includes a web-based dashboard that provides an overview of API activity and security-related events.

---

## ✨ Features

- 🔐 API Key Validation
- 🚦 API Rate Limiting
- 🛡️ API Request Protection
- 📊 Analytics Dashboard
- 📈 API Traffic Monitoring
- 🚫 Blocked Request Tracking
- 📝 Request Logging
- ⚡ Rate-Limit Monitoring
- 🌐 REST API Integration
- 📱 Responsive Web Dashboard

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │       Client        │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  React Dashboard    │
                    └──────────┬──────────┘
                               │
                         REST API Calls
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Spring Boot API   │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        API Key Check    Rate Limiting    Request Logging
              │                │                │
              └────────────────┼────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Database       │
                    └─────────────────────┘
````

---

## 🛠️ Tech Stack

### Frontend

* React
* JavaScript
* CSS
* Vite

### Backend

* Java
* Spring Boot
* REST APIs

### Database

* PostgreSQL

### Deployment & Version Control

* Render
* Git
* GitHub

---

## 📊 Analytics Dashboard

The analytics dashboard provides visibility into API usage and traffic.

It can be used to monitor metrics such as:

* Total API requests
* Successful requests
* Blocked requests
* Rate-limited requests
* API usage activity
* Request trends

---

## 🔐 API Security

Smart API Guard provides an additional control layer between clients and protected API endpoints.

Requests can be evaluated based on:

* API key validity
* Rate-limit rules
* Request status
* Endpoint activity
* Request history

This makes it easier to monitor API usage and identify requests that should be rejected or controlled.

---

## 📂 Project Structure

```text
smart-api-guard/
│
├── frontend/
│   ├── src/
│   └── package.json
│
├── src/
│   └── main/
│       ├── java/
│       └── resources/
│
├── pom.xml
├── package.json
├── body.json
├── status.json
└── README.md
```

---

## 🧪 API Testing

The API can be tested using tools such as:

* Postman
* cURL
* PowerShell

Example:

```bash
curl -X GET YOUR_API_ENDPOINT
```

---

## ☁️ Deployment

The application is deployed using **Render**.

### Production Application

[https://smart-api-guard-1.onrender.com/](https://smart-api-guard-1.onrender.com/)

---

## 🔮 Future Improvements

Potential improvements include:

* JWT-based authentication
* IP-based rate limiting
* Custom rate-limit policies
* Advanced threat detection
* Email notifications
* Real-time dashboard updates
* Docker containerization
* Advanced API usage reports

---

## 👨‍💻 Author

### A Pavan

**GitHub:**
[https://github.com/pavanzx](https://github.com/pavanzx)

**Project Repository:**
[https://github.com/pavanzx/smart-api-guard](https://github.com/pavanzx/smart-api-guard)

**Live Demo:**
[https://smart-api-guard-1.onrender.com/](https://smart-api-guard-1.onrender.com/)

---

## 📄 License
