# ---------- BUILD STAGE ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency files first (for caching)
COPY package.json pnpm-lock.yaml* ./

# Install ALL deps (including devDeps needed for build)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build NestJS app
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only package files
COPY package.json pnpm-lock.yaml* ./

# Install ONLY production deps
RUN pnpm install --prod --frozen-lockfile

# Copy compiled app from builder
COPY --from=builder /app/dist ./dist

# Expose app port
EXPOSE 3000

# Start app
CMD ["node", "dist/main.js"]
