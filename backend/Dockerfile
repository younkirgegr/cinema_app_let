# Используем официальный образ Node.js
FROM node:18-alpine

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код приложения
COPY . .

# Открываем порт, на котором работает твой API
EXPOSE 5000

# Команда для запуска приложения
CMD [ "node", "index.js" ] # или "npm", "start"