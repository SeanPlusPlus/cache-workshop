# Use official Node.js runtime as base image
# Alpine variant for smaller image size (~5MB vs ~900MB for full node)
FROM node:18-alpine

# Set working directory inside container
# All subsequent commands run from this directory
WORKDIR /app

# Copy package files first for better Docker layer caching
# If package.json hasn't changed, npm install layer can be reused
COPY package*.json ./

# Install dependencies
# --only=production skips devDependencies in production builds
RUN npm ci --only=production

# Copy application source code
# Done after npm install to leverage Docker layer caching
COPY . .

# Expose port that Express server listens on
# This is documentation - doesn't actually publish the port
EXPOSE 3000

# Create non-root user for security
# Running as root inside containers is a security risk
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Change ownership of app directory to non-root user
USER nodejs

# Start the application
# Use array syntax for better signal handling
CMD ["node", "server.js"]
