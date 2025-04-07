# Фаза сборки
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
RUN npx prisma generate  # Генерируем клиент Prisma
COPY . .
RUN npm run seed
RUN npm run build

# Фаза запуска
FROM node:18
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
# Копируем файл SQLite (если он уже существует)
COPY --from=builder /app/prisma/dev.db ./prisma/dev.db
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm start"]