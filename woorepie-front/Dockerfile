# React 앱 빌드 전용 Dockerfile (EKS Jenkins CI 환경용)
FROM node:18-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# 결과물은 /app/dist → Jenkins에서 꺼내서 S3 업로드
