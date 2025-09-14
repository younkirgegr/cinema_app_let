const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';



const handleFetch = (url, options = {}) => {
  return fetch(url, options).then(async (res) => {
    // Пытаемся получить тело ответа, даже если статус не 2xx
    const contentType = res.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      // Если ответ не JSON, попробуем текст или создадим объект с текстом статуса
      try {
        const text = await res.text();
        data = { message: text || `HTTP ${res.status}` };
      } catch (e) {
        data = { message: `HTTP ${res.status}` };
      }
    }

    if (!res.ok) {
      // Если статус не OK, отклоняем промис с данными об ошибке
      console.error(`❌ API Error (${res.status}):`, data);
      throw new Error(data.error || data.message || `Ошибка ${res.status}`);
    }

    // Если OK, возвращаем данные
    console.log(`📥 API Success (${res.status}):`, data);
    return data;
  }).catch((err) => {
    // Это поймает сетевые ошибки (например, ECONNREFUSED) и ошибки от `!res.ok`
    console.error(`🌐 Network/Fetch Error:`, err);
    // Пробрасываем ошибку дальше
    throw new Error(`Сетевая ошибка: ${err.message}`);
  });
};

export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Получить фильмы
export const getFilms = (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  return fetch(`${API_BASE}/films?${params}`, { headers: getHeaders() })
    .then(res => res.json());
};

export const getMyTickets = () => {
  return fetch(`${API_BASE}/my-tickets`, { headers: getHeaders() })
    .then(res => res.json());
};

export const login = (email, password) => {
  return fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => {
    console.log(`📥 API Login Status: ${res.status}`); // Для отладки
    if (!res.ok) {
      // Если статус не 2xx, попытаемся получить сообщение об ошибке
      return res.json().then(data => {
        console.error("❌ API Login Error Data:", data); // Для отладки
        throw new Error(data.error || `Ошибка ${res.status}`);
      });
    }
    return res.json();
  })
  .then(data => {
    console.log("📥 API Login Success Data:", data); // Для отладки
    return data;
  })
  .catch(err => {
    console.error("🌐 API Login Network/Fetch Error:", err); // Для отладки
    // Пробрасываем ошибку дальше с понятным сообщением
    throw new Error(`Сетевая ошибка: ${err.message}`);
  });
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


export const getScreeningDetails = (screeningId) => {
  return fetch(`${API_BASE}/screenings/details/${screeningId}`, { headers: getHeaders() }).then(res => res.json());
};

export const getOccupiedSeats = (screeningId) => {
  return fetch(`${API_BASE}/tickets/occupied/${screeningId}`, { headers: getHeaders() })
    .then(res => res.json());
};

export const addFilm = (data) => {
  return fetch(`${API_BASE}/films`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const updateFilm = (data) => {
  return fetch(`${API_BASE}/films/${data.film_id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const deleteFilm = async (filmId) => {
  const response = await fetch(`${API_BASE}/films/${filmId}`, {
    method: 'DELETE',
    headers: getHeaders()
  });

  if (!response.ok) {
    let errorMessage = `Ошибка: ${response.status} ${response.statusText}`;
    
    try {
      const errorBody = await response.json();
      if (errorBody && errorBody.message) {
        errorMessage = errorBody.message;
      }
    } catch (e) {
      console.error(e)
    }
    
    throw new Error(errorMessage);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json();
  } else {
    return {}; 
  }
};

export const getFilmById = (filmId) => {
  return fetch(`${API_BASE}/films/${filmId}`, {
    headers: getHeaders()
  }).then(res => res.json());
};

export const getScreeningsByFilmId = (filmId) => {
  return fetch(`${API_BASE}/screenings/film/${filmId}`, { headers: getHeaders() })
    .then(res => res.json());
};

export const getFilmsWithScreenings = (day) => {
  return fetch(`${API_BASE}/films/with-screenings?day=${day}`, {
    headers: getHeaders()
  }).then(res => res.json());
};

export const getHalls = () => {
  return fetch(`${API_BASE}/halls`, { headers: getHeaders() })
    .then(res => res.json());
};

export const createScreening = (data) => {
  return fetch(`${API_BASE}/screenings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  }).then(res => res.json());
};

export const getSchedule = (day) => {
  const params = new URLSearchParams({ day }).toString();
  return fetch(`${API_BASE}/schedule?${params}`, {
    headers: getHeaders()
  }).then(res => {
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return res.json();
  });
};

export const getUserInformation = () => {
  return fetch(`${API_BASE}/users/me`, {
    headers: getHeaders()
  }).then(res => res.json());
};