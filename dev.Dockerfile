# Use the official Node.js 22 image as the base image
FROM node:22

WORKDIR /app
RUN corepack enable
COPY package*.json ./
RUN npm install
COPY . .
