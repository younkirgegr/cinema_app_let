-- sql/data.sql

-- Роли
INSERT INTO roles (role_id, role_name) VALUES
(1, 'Посетитель'),
(2, 'Кассир'),
(3, 'Администратор');

-- Жанры
INSERT INTO genres (genre_id, genre_name) VALUES
(1, 'Боевик'),
(2, 'Комедия'),
(3, 'Драма'),
(4, 'Фантастика'),
(5, 'Ужасы'),
(6, 'Мультфильм');

-- Типы залов
INSERT INTO hall_types (type_id, type_name, surcharge) VALUES
(1, 'Стандарт', 0.00),
(2, 'VIP', 200.00),
(3, 'IMAX', 300.00),
(4, '4DX', 250.00);

-- Залы
INSERT INTO halls (hall_id, hall_name, type_id, capacity) VALUES
(1, 'Красный', 1, 150),
(2, 'Синий', 1, 120),
(3, 'Золотой', 2, 50),
(4, 'IMAX 1', 3, 200),
(5, '4DX 1', 4, 100);

-- Фильмы
INSERT INTO films (title, genre_id, duration_min, rating, description) VALUES
('Мстители: Финал', 4, 182, '12+', 'Финальная битва за Вселенную'),
('Джентльмены', 1, 113, '18+', 'Криминальная комедия о британских аристократах'),
('Тролли. Мировой тур', 6, 90, '6+', 'Приключение в мире музыки и красок'),
('Оно', 5, 135, '16+', 'Ужасы о клоуне Пеннивайсе'),
('Достать ножи', 3, 130, '16+', 'Детектив с неожиданной развязкой');

-- Пользователи
INSERT INTO users (last_name, first_name, phone, email, password_hash) VALUES
('Иванов', 'Иван', '79101112233', 'ivanov@mail.ru', '$2b$10$IfWq9X5yqY4Zq9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5u'),
('Петрова', 'Мария', '79112223344', 'petrova@mail.ru', '$2b$10$IfWq9X5yqY4Zq9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5u'),
('Сидоров', 'Алексей', '79123334455', 'sidorov@mail.ru', '$2b$10$IfWq9X5yqY4Zq9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5u'),
('Кузнецова', 'Елена', '79134445566', 'kuznetsova@mail.ru', '$2b$10$IfWq9X5yqY4Zq9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5u'),
('Смирнов', 'Дмитрий', '79145556677', 'smirnov@mail.ru', '$2b$10$IfWq9X5yqY4Zq9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5Zq9Z5uO5q9Z5u');

-- Привязка ролей
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 1),
(3, 2),
(4, 3),
(5, 1);

-- Сеансы
INSERT INTO screenings (film_id, hall_id, start_time, end_time, base_price) VALUES
(1, 4, '2025-09-08 10:00:00', '2025-09-08 13:02:00', 500.00),
(2, 1, '2025-09-08 12:00:00', '2025-09-08 13:53:00', 350.00),
(3, 2, '2025-04-05 14:00:00', '2025-09-08 15:30:00', 300.00),
(4, 3, '2025-04-05 18:00:00', '2025-04-05 20:15:00', 600.00),
(5, 5, '2025-04-05 20:30:00', '2025-04-05 22:40:00', 450.00);

-- Места (для зала 1 — 150 мест)
INSERT INTO seats (hall_id, row_num, seat_num) 
SELECT 1, FLOOR((num-1)/10)+1, ((num-1)%10)+1 
FROM (SELECT 1 + units.a + tens.a*10 AS num FROM (SELECT 0 a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units, (SELECT 0 a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) tens) t 
WHERE num <= 150;

-- Места (для зала 2 — 120 мест)
INSERT INTO seats (hall_id, row_num, seat_num) 
SELECT 2, FLOOR((num-1)/10)+1, ((num-1)%10)+1 
FROM (SELECT 1 + units.a + tens.a*10 AS num FROM (SELECT 0 a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units, (SELECT 0 a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) tens) t 
WHERE num <= 120;

-- Места (для зала 3 — 50 мест)
INSERT INTO seats (hall_id, row_num, seat_num) 
SELECT 3, FLOOR((num-1)/5)+1, ((num-1)%5)+1 
FROM (SELECT 1 + units.a + tens.a*10 AS num FROM (SELECT 0 a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) units, (SELECT 0 a UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) tens) t 
WHERE num <= 50;