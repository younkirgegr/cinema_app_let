// src/services/api.js
const API_BASE = 'http://localhost:5000/api';

// Общие заголовки
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Получить фильмы
export const getFilms = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return fetch(`${API_BASE}/films?${params}`, {
    headers: getHeaders()
  }).then(res => res.json());
};

// Вход
export const login = (email, password) => {
  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json());
};

// Сеансы на сегодня
export const getScreeningsToday = () => {
  return fetch(`${API_BASE}/screenings/today`, {
    headers: getHeaders()
  }).then(res => res.json());
};

// Продажа билета
export const sellTicket = (data) => {
  return fetch(`${API_BASE}/tickets/sell`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const getMyTickets = () => {
  return fetch(`${API_BASE}/tickets/my`, {
    headers: getHeaders()
  }).then(res => res.json());
};


export const getOccupiedSeats = (screeningId) => {
  return fetch(`${API_BASE}/tickets/occupied/${screeningId}`, {
    headers: getHeaders()
  }).then(res => res.json());
};

// src/services/api.js
export const addFilm = (data) => {
  return fetch(`${API_BASE}/films`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const updateFilm = (filmId, data) => {
  return fetch(`${API_BASE}/films/${filmId}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const deleteFilm = (filmId) => {
  return fetch(`${API_BASE}/films/${filmId}`, {
    method: 'DELETE',
    headers: getHeaders()
  }).then(res => res.json());
};

// src/services/api.js
export const getFilmById = (filmId) => {
  return fetch(`${API_BASE}/films/${filmId}`, {
    headers: getHeaders()
  }).then(res => res.json());
};

// src/services/api.js
export const getScreeningsByFilmId = (filmId) => {
  return fetch(`${API_BASE}/screenings/film/${filmId}`, {
    headers: getHeaders()
  }).then(res => res.json());
};