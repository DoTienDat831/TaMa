FROM eclipse-temurin:21-jdk AS backend-build
WORKDIR /workspace

COPY backend/tama/.mvn/ .mvn/
COPY backend/tama/mvnw backend/tama/pom.xml ./
COPY backend/tama/src/ src/

RUN sh ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre AS backend
WORKDIR /app

RUN useradd --system --uid 10001 --create-home appuser
COPY --from=backend-build /workspace/target/tama-*.jar /app/app.jar

USER 10001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

FROM node:22-alpine AS frontend-build
WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./
ARG VITE_API_BASE_URL=http://localhost:8080/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
RUN npm run build

FROM nginx:stable-alpine3.24-slim AS frontend
COPY --from=frontend-build /app/dist/ /usr/share/nginx/html/
EXPOSE 80
