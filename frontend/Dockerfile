# --- ЭТАП 1: Сборка ---

FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_API_URL

ENV REACT_APP_API_URL=$REACT_APP_API_URL

RUN npm run build

# --- ЭТАП 2: Запуск (Serve) ---
# Используем легковесный веб-сервер Nginx
FROM nginx:stable-alpine

# Копируем собранную статику из этапа 'build' в папку, откуда Nginx раздает файлы
COPY --from=build /app/build /usr/share/nginx/html

# Открываем порт 80 (стандартный для Nginx)
EXPOSE 80

# Nginx запустится автоматически