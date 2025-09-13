// backend/hash-password.js
const bcrypt = require('bcrypt');

// Пароль, который нужно захэшировать
const password = 'user123';
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Ошибка хеширования:', err);
    return;
  }
  
  console.log('✅ Хеш пароля:');
  console.log(hash);

  // Теперь ты можешь использовать этот хеш в SQL-запросе
  console.log('\nПример SQL для обновления:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'user@kino.ru';`);
});