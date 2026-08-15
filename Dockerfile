# =========================================================
# Stage 1 — Build React frontend
# =========================================================
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build


# =========================================================
# Stage 2 — Build Spring Boot backend
# =========================================================
FROM maven:3.9-eclipse-temurin-17 AS backend-build

WORKDIR /app

COPY pom.xml .

RUN mvn dependency:go-offline -DskipTests

COPY src ./src

RUN mvn clean package -DskipTests


# =========================================================
# Stage 3 — Production
# =========================================================
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=backend-build \
    /app/target/smart-api-guard-0.0.1-SNAPSHOT.jar \
    app.jar

COPY --from=frontend-build \
    /frontend/dist \
    /app/frontend-dist

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]