# Dockerfile for the server
FROM node:20

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server files
COPY ./ .

# Rebuild native modules to match the container's architecture
RUN npm rebuild bcrypt --build-from-source

# Expose the port the server runs on
EXPOSE 5004

# Command to run the server
CMD ["node", "server.js"]
