# Фаза сборки
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate  # Генерируем клиент Prisma
COPY . .
RUN npm run seed

EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run dev"]