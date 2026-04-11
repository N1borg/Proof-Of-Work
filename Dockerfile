# Stage 1: Build the React application
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy dependency graphs and install securely
COPY package*.json ./
RUN npm ci

# Copy full application logic and build the compressed static assets
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx (Alpine-based, ultra-lightweight)
FROM nginx:alpine

# Copy the generated Vite static bundle from the build stage into Nginx's HTML root
COPY --from=build /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
