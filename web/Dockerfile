FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# The browser calls the API directly, and Next.js bakes this address in at build time
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
