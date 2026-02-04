# Use Node 20 LTS Alpine for smaller image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package files first for caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Copy all source code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose port
EXPOSE 3000

# Ensure Node 20 features like crypto.randomUUID() work
# and file-type ESM imports are supported
CMD ["node", "dist/main.js"]
