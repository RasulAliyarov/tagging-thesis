# Используем Node.js
FROM node:20-alpine

WORKDIR /app

# Копируем package.json и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем остальной код
COPY . .

# Собираем проект (для продакшн-режима)
# RUN npm run dev

EXPOSE 3000

# Запускаем Next.js только в момент СТАРТА контейнера
CMD ["npm", "run", "dev"]