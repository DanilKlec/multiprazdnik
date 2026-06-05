const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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

      // 3. Создаем таблицу Новостей (на случай запросов фронтенда)
      await client.query(`
        CREATE TABLE IF NOT EXISTS news (
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          date DATE DEFAULT CURRENT_DATE,
          description TEXT NOT NULL,
          image_url TEXT NOT NULL
        );
      `);

      // 4. Создаем таблицу Отзывов (на случай запросов фронтенда)
      await client.query(`
        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          author VARCHAR(100) NOT NULL,
          text TEXT NOT NULL,
          rating INT DEFAULT 5,
          date VARCHAR(50) NOT NULL,
          avatar_url TEXT
        );
      `);

      // Заполняем таблицу героев базовыми данными, если она пуста
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
      }

      // Заполняем таблицу новостей, если пуста
      const newsCheck = await client.query('SELECT COUNT(*) FROM news');
      if (parseInt(newsCheck.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO news (title, date, description, image_url) VALUES
          ('Открытие нашей новой уютной студии!', '2026-05-20', 'Мы расширились! Теперь у нас есть собственное пространство для праздников с интерактивной зоной, сценой и банкетным залом.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'),
          ('Новинка: Шоу гигантских мыльных пузырей с огнем', '2026-06-01', 'Уникальное интерактивное шоу, где каждый ребенок сможет оказаться внутри гигантского мыльного пузыря и загадать желание.', 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&w=800&q=80');
        `);
      }

      // Заполняем таблицу отзывов, если пуста
      const reviewsCheck = await client.query('SELECT COUNT(*) FROM reviews');
      if (parseInt(reviewsCheck.rows[0].count) === 0) {
        await client.query(`
          INSERT INTO reviews (author, text, rating, date, avatar_url) VALUES
          ('Екатерина (мама Миши, 6 лет)', 'Спасибо огромное за праздник! Человек-Паук был просто на высоте. Дети в восторге, родители отдохнули. Очень чистая и красивая студия!', 5, '15.05.2026', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'),
          ('Дмитрий (папа Алисы, 8 лет)', 'Заказывали выездной квест на дачу. Аниматоры приехали вовремя, со своим реквизитом и музыкой. Увлекли даже взрослых. Рекомендую!', 5, '28.05.2026', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
          ('Мария (мама Сони, 4 года)', 'Праздновали в студии Мультипраздник. Идеальный сервис, очень вежливые администраторы. Программа с Карамелькой супер-милая!', 5, '02.06.2026', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80');
        `);
      }

      console.log('Инициализация структуры и наполнение базы данных выполнены успешно!');
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

// 2. Получение списка всех новостей
app.get('/api/news', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM news ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении новостей:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// 3. Получение списка всех отзывов
app.get('/api/reviews', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reviews ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении отзывов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// 4. Получение списка всех бронирований (для календаря админки)
app.get('/api/bookings', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM bookings ORDER BY event_date ASC, event_time ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка при получении бронирований:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении календаря бронирований' });
  }
});

// 5. Создание нового бронирования (для формы заказа)
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

// 6. Обновление статуса бронирования (например, подтверждение в админке)
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

// Защитный перехватчик: Любые неизвестные запросы, начинающиеся с /api/, должны возвращать JSON 404, а не HTML!
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Запрошенный API эндпоинт не найден на сервере PostgreSQL' });
});

// Перенаправление всех остальных GET-запросов на главную страницу (для SPA роутинга, если он есть)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 Сервер Мультипраздник запущен на порту ${PORT}`);
  
  // Запуск самодиагностики папок при старте, чтобы сразу видеть ошибки в логах хостинга
  console.log(`🔍 --- ДИАГНОСТИКА СТАТИЧЕСКИХ ФАЙЛОВ ---`);
  const publicDir = path.join(__dirname, 'public');
  console.log(`Целевой путь статики: ${publicDir}`);
  if (fs.existsSync(publicDir)) {
    console.log(`✅ Папка 'public' существует!`);
    const files = fs.readdirSync(publicDir);
    console.log(`Список файлов в корне public:`, files);
    const assetsDir = path.join(publicDir, 'assets');
    if (fs.existsSync(assetsDir)) {
      console.log(`✅ Папка 'public/assets' существует!`);
      console.log(`Список скомпилированных файлов в assets:`, fs.readdirSync(assetsDir));
    } else {
      console.log(`❌ Ошибка: Папка 'public/assets' НЕ НАЙДЕНА!`);
    }
  } else {
    console.log(`❌ Ошибка: Корневая папка 'public' НЕ НАЙДЕНА в контейнере!`);
  }
  console.log(`==================================================\n`);
});