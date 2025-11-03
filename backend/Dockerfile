# Use official Node.js LTS slim image
FROM node:20-slim

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first for caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the source code
COPY . .

# Expose the port your app listens on
EXPOSE 5001

# Use environment variables
ENV NODE_ENV=production
ENV PORT=5001

# Start the server
CMD ["node", "src/server.js"]
