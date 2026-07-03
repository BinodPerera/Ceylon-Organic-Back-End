# --- Build Stage ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Optional: run build if a frontend asset or typescript build script exists
RUN npm run build --if-present

# --- Production Stage ---
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app ./

EXPOSE 3000
CMD ["npm", "start"]