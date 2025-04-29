# Use Bun base image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package manager files first (important for caching)
COPY package.json pnpm-lock.yaml ./

# # Install dependencies
RUN bun install

# Copy the rest of the project
COPY . .

# Start the application
CMD ["bun", "--watch", "app/server.ts"]
