# Stage 1: Build the React application
FROM node:16.20.2-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Build the React application
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]