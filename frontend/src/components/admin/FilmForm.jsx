
const cardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  height: 'fit-content'
};

const inputStyle = {
  display: 'block',
  width: '100%',
  padding: '8px',
  marginBottom: '10px',
  borderRadius: '4px',
  border: '1px solid #ddd'
};

const btnPrimary = {
  padding: '10px 15px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold',
  marginBottom: '15px'
};

const btnSuccess = {
  ...btnPrimary,
  backgroundColor: '#28a745'
};

const btnSmall = {
  padding: '5px 10px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

const listItem = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '8px 0',
  borderBottom: '1px dashed #ddd'
};

const FilmForm = ({ onSubmit, setNewFilm, newFilm, onClose})=>{

    return <form onSubmit={onSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label>Название:</label>
                <input
                  name="title"
                  value={newFilm.title || ''}
                  onChange={(e) => setNewFilm({ ...newFilm, title: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Жанр:</label>
                <select
                  name="genre_id"
                  value={newFilm.genre_id || ""}
                  onChange={(e) => setNewFilm({ ...newFilm, genre_id: e.target.value })}
                  required
                  style={inputStyle}
                >
                  <option value="">Выберите жанр</option>
                  <option value="1">Боевик</option>
                  <option value="2">Комедия</option>
                  <option value="3">Драма</option>
                  <option value="4">Фантастика</option>
                  <option value="5">Ужасы</option>
                  <option value="6">Мультфильм</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Продолжительность (мин):</label>
                <input
                  type="number"
                  name="duration_min"
                  value={newFilm.duration_min || "0"}
                  onChange={(e) => setNewFilm({ ...newFilm, duration_min: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Рейтинг:</label>
                <input
                  name="rating"
                  value={newFilm.rating || "1"}
                  onChange={(e) => setNewFilm({ ...newFilm, rating: e.target.value })}
                  required
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label>Описание:</label>
                <textarea
                  name="description"
                  value={newFilm.description || ""}
                  onChange={(e) => setNewFilm({ ...newFilm, description: e.target.value })}
                  rows="4"
                  style={inputStyle}
                ></textarea>
              </div>
              <button type="submit" style={btnSuccess}>Сохранить фильм</button>
              <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
                Отмена
              </button>
            </form>
}

export default FilmForm;