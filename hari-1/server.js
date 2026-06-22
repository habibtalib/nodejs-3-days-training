// server.js
// Titik masuk utama aplikasi (Hari 1).
// Pada hari ini kita sediakan rangka Express + EJS dan sambung ke MongoDB.

// 1) Muatkan pemboleh ubah persekitaran dari fail .env (mesti paling atas).
require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 2) Sambung ke pangkalan data MongoDB.
connectDB();

// 3) Tetapkan enjin paparan EJS + susun atur (layout).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// 4) Middleware: fail statik (css, imej) dalam folder public.
app.use(express.static(path.join(__dirname, 'public')));

// Jadikan laluan semasa tersedia di semua paparan (untuk penanda menu aktif).
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// 5) Laluan halaman utama.
app.get('/', (req, res) => {
  res.render('index', { title: 'Selamat Datang' });
});

// 6) Halaman 404 untuk laluan yang tidak wujud.
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Dijumpai' });
});

// 7) Mulakan pelayan.
app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
