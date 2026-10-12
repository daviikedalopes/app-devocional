FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev && npx --yes prisma@6 generate

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3333

# Aplica as migrations pendentes e sobe a API.
CMD ["sh", "-c", "npx --yes prisma@6 migrate deploy && node src/server.js"]
