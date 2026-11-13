FROM node:22-slim

# Prisma needs OpenSSL
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate && npm run build

EXPOSE 3001

# Create or update the database tables, then start the API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
