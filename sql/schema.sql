CREATE DATABASE IF NOT EXISTS cinema;
USE cinema;

-- Таблица ролей
CREATE TABLE roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Таблица пользователей
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    last_name VARCHAR(50) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    registration_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Связь пользователей и ролей
CREATE TABLE user_roles (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    assigned_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
);

-- Жанры
CREATE TABLE genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(50) NOT NULL UNIQUE
);

-- Фильмы
CREATE TABLE films (
    film_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre_id INT NOT NULL,
    duration_min INT NOT NULL,
    rating VARCHAR(10) NOT NULL,
    description TEXT,
    release_date DATE,
    poster_url VARCHAR(255),
    FOREIGN KEY (genre_id) REFERENCES genres(genre_id)
);

-- Типы залов
CREATE TABLE hall_types (
    type_id INT AUTO_INCREMENT PRIMARY KEY,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    surcharge DECIMAL(5,2) DEFAULT 0.00
);

-- Залы
CREATE TABLE halls (
    hall_id INT AUTO_INCREMENT PRIMARY KEY,
    hall_name VARCHAR(50) NOT NULL UNIQUE,
    type_id INT NOT NULL,
    capacity INT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES hall_types(type_id)
);

-- Сеансы
CREATE TABLE screenings (
    screening_id INT AUTO_INCREMENT PRIMARY KEY,
    film_id INT NOT NULL,
    hall_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    base_price DECIMAL(8,2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (film_id) REFERENCES films(film_id),
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
);

-- Места
CREATE TABLE seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    hall_id INT NOT NULL,
    row_num INT NOT NULL,
    seat_num INT NOT NULL,
    seat_type ENUM('standard', 'vip', 'disabled') DEFAULT 'standard',
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id) ON DELETE CASCADE,
    UNIQUE KEY (hall_id, row_num, seat_num)
);

-- Билеты
CREATE TABLE tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    screening_id INT NOT NULL,
    seat_id INT NOT NULL,
    user_id INT NOT NULL,
    cashier_id INT,
    sale_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    price DECIMAL(8,2) NOT NULL,
    status ENUM('active', 'used', 'cancelled') DEFAULT 'active',
    FOREIGN KEY (screening_id) REFERENCES screenings(screening_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (cashier_id) REFERENCES users(user_id)
);

-- Триггеры (проверяют правила)
DELIMITER //
CREATE TRIGGER check_film_duration
BEFORE INSERT ON films
FOR EACH ROW
BEGIN
    IF NEW.duration_min <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Продолжительность фильма должна быть положительной';
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_screening_time
BEFORE INSERT ON screenings
FOR EACH ROW
BEGIN
    IF NEW.start_time >= NEW.end_time THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Время начала сеанса должно быть раньше времени окончания';
    END IF;
END//
DELIMITER ;

DELIMITER //
CREATE TRIGGER check_seat_availability
BEFORE INSERT ON tickets
FOR EACH ROW
BEGIN
    DECLARE seat_taken INT;
    SELECT COUNT(*) INTO seat_taken
    FROM tickets
    WHERE screening_id = NEW.screening_id
    AND seat_id = NEW.seat_id
    AND status = 'active';
    IF seat_taken > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Место уже занято на этот сеанс';
    END IF;
END//
DELIMITER ;