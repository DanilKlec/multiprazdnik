const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Разрешаем CORS-запросы и парсинг JSON-тела запросов
app.use(cors());
app.use(express.json());

// Настройка статической раздачи файлов из папки public с принудительной установкой MIME-типов
app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js') || filePath.endsWith('.mjs')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// Принудительно очищаем и проверяем строку подключения
let dbUrl = process.env.DATABASE_URL;

// Если переменная окружения DATABASE_URL не задана на хостинге, используем локальную
if (!dbUrl) {
  console.log('DATABASE_URL не найдена в переменных окружения. Используем локальное подключение по умолчанию.');
  dbUrl = 'postgresql://postgres:postgres@127.0.0.1:5432/multiprazdnik';
} else {
  // На некоторых хостингах (например, Render) переменная может быть обернута в кавычки. Очищаем их.
  dbUrl = dbUrl.trim().replace(/^["']|["']$/g, '');
}

// Проверяем, является ли база данных локальной
const isLocalDb = dbUrl.includes('localhost') || dbUrl.includes('127.0.0.1') || dbUrl.includes('postgres-db');

// Настройка подключения к PostgreSQL. SSL включается только для внешних (облачных) СУБД.
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isLocalDb ? false : { rejectUnauthorized: false }
});

// Функция инициализации таблиц и автозаполнения базы данных
async function initDatabase() {
  let retries = 5;
  while (retries) {
    try {
      const client = await pool.connect();
      console.log('Успешно подключено к PostgreSQL. Проверка и создание таблиц...');
      
      // 1. Создаем таблицу Героев
      await client.query(`
        CREATE TABLE IF NOT EXISTS heroes (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          age_range VARCHAR(50) NOT NULL,
          category VARCHAR(50) NOT NULL,
          image_url TEXT NOT NULL
        );
      `);

      // 2. Создаем таблицу Бронирований для календаря
      await client.query(`
        CREATE TABLE IF NOT EXISTS bookings (
          id SERIAL PRIMARY KEY,
          ticket_id VARCHAR(100) NOT NULL UNIQUE,
          child_name VARCHAR(100) NOT NULL,
          child_age INTEGER NOT NULL,
          event_date DATE NOT NULL,
          event_time VARCHAR(20) NOT NULL,
          selected_program VARCHAR(150) NOT NULL,
          selected_character VARCHAR(150) NOT NULL,
          parent_name VARCHAR(100) NOT NULL,
          parent_phone VARCHAR(50) NOT NULL,
          specific_wishes TEXT,
          add_cake BOOLEAN DEFAULT FALSE,
          add_confetti BOOLEAN DEFAULT FALSE,
          total_price INTEGER NOT NULL,
          status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // 3. Заполняем таблицу героев базовыми данными, если она пуста
      const heroCheck = await client.query('SELECT COUNT(*) FROM heroes');
      if (parseInt(heroCheck.rows[0].count) === 0) {
        console.log('База данных пуста. Заполнение таблицы героев демонстрационными данными...');
        await client.query(`
          INSERT INTO heroes (name, description, age_range, category, image_url) VALUES
          ('Коржик и Карамелька', 'Веселые котята устроят незабываемый праздник с играми, танцами и мыльными пузырями.', '2-6 лет', 'Мультфильмы', 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=500&q=80'),
          ('Человек-Паук', 'Супергеройская тренировка, спасение мира, прохождение лазерного лабиринта и секретная миссия.', '5-10 лет', 'Супергерои', 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?auto=format&fit=crop&w=500&q=80'),
          ('Эльза и Олаф', 'Волшебная снежная сказка, ледяное шоу, искренние объятия и магия дружбы.', '3-8 лет', 'Принцессы', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=500&q=80'),
          ('Трансформер Бамблби', 'Гигантский робот со световыми эффектами, дымовой пушкой и космическими танцами.', '6-12 лет', 'Роботы', 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=500&q=80');
        `);
        console.log('Герои успешно импортированы!');
      }

      client.release();
      break;
    } catch (err) {
      console.error(`Ошибка подключения к БД. Осталось попыток: ${retries - 1}. Ошибка:`, err.message);
      retries -= 1;
      // Ждем 5 секунд перед повторной попыткой
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

// Запускаем инициализацию таблиц
initDatabase();

// --- API ЭНДПОИНТЫ ---

// 1. Получение списка всех героев
app.get('/api/heroes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM heroes ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении героев:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении списка героев' });
  }
});

// 2. Получение списка всех бронирований (для календаря админки)
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY event_date ASC, event_time ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении бронирований:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении календаря бронирований' });
  }
});

// 3. Создание нового бронирования (для формы заказа)
app.post('/api/bookings', async (req, res) => {
  const {
    ticketId,
    childName,
    childAge,
    eventDate,
    eventTime,
    selectedProgram,
    selectedCharacter,
    parentName,
    parentPhone,
    specificWishes,
    addCake,
    addConfetti,
    totalPrice,
    status = 'pending'
  } = req.body;

  // Базовая валидация обязательных полей
  if (!ticketId || !childName || !eventDate || !eventTime || !parentPhone) {
    return res.status(400).json({ error: 'Пожалуйста, заполните все обязательные поля формы' });
  }

  try {
    const queryText = `
      INSERT INTO bookings (
        ticket_id, child_name, child_age, event_date, event_time, 
        selected_program, selected_character, parent_name, parent_phone, 
        specific_wishes, add_cake, add_confetti, total_price, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
    `;

    const values = [
      ticketId,
      childName,
      parseInt(childAge, 10) || 5,
      eventDate, // Ожидается формат 'YYYY-MM-DD'
      eventTime,
      selectedProgram,
      selectedCharacter,
      parentName,
      parentPhone,
      specificWishes || '',
      addCake || false,
      addConfetti || false,
      totalPrice,
      status
    ];

    const result = await pool.query(queryText, values);
    res.status(201).json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error('Ошибка при создании записи бронирования:', err);
    if (err.code === '23505') { // Код ошибки уникальности ключа PostgreSQL (Duplicate key)
      return res.status(400).json({ error: 'Бронирование с таким ID билета уже существует!' });
    }
    res.status(500).json({ error: 'Внутренняя ошибка сервера при сохранении бронирования' });
  }
});

// 4. Обновление статуса бронирования (например, подтверждение в админке)
app.put('/api/bookings/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Запись бронирования не найдена' });
    }
    res.json({ success: true, booking: result.rows[0] });
  } catch (err) {
    console.error('Ошибка при обновлении статуса:', err);
    res.status(500).json({ error: 'Ошибка сервера при обновлении статуса бронирования' });
  }
});

// Перенаправление всех остальных GET-запросов на главную страницу (для SPA роутинга, если он есть)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Сервер Мультипраздник запущен на порту ${PORT}`);
});