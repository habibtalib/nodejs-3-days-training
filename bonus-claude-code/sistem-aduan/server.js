// server.js
// Titik masuk utama — Sistem Aduan KPDN (versi LENGKAP).
// Tambahan berbanding Hari 3: keselamatan (Bab 15), pengesahan (Bab 13),
// dan pengendalian ralat berpusat (Bab 14).

require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const passport = require('./config/passport');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Sambung ke pangkalan data MongoDB.
connectDB();

// Enjin paparan EJS + layout.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// --- Keselamatan (Bab 15) ---
// helmet menetapkan pelbagai header keselamatan HTTP.
// CSP dimatikan di sini kerana kita guna Tailwind CDN; untuk produksi,
// bina Tailwind secara tempatan & aktifkan CSP yang ketat.
app.use(helmet({ contentSecurityPolicy: false }));
app.use(mongoSanitize()); // halang suntikan operator NoSQL ($, .)

// Middleware terbina dalam.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

// Sesi & flash.
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'rahsia-kpdn',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// --- Pengesahan (Bab 13) ---
app.use(passport.initialize());
app.use(passport.session());

// Hadkan kadar permintaan log masuk (lindungi daripada brute-force).
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minit
  max: 20, // maksimum 20 cubaan setiap tetingkap
  message: 'Terlalu banyak cubaan log masuk. Cuba lagi sebentar nanti.',
});
app.use('/login', loginLimiter);

// Jadikan flash, laluan semasa, & pengguna semasa tersedia di semua paparan.
app.use((req, res, next) => {
  res.locals.jaya = req.flash('jaya');
  res.locals.gagal = req.flash('gagal');
  res.locals.currentPath = req.path;
  res.locals.user = req.user || null; // pengguna log masuk (atau null)
  next();
});

// Daftarkan laluan.
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// --- Pengendalian ralat (Bab 14) ---
app.use(notFound); //       404 — mesti selepas semua laluan
app.use(errorHandler); //   500 — mesti PALING AKHIR (4 parameter)

// Mulakan pelayan.
const server = app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});

// Mematikan aplikasi dengan elok (graceful shutdown).
process.on('SIGTERM', () => {
  console.log('Menerima SIGTERM, menutup pelayan...');
  server.close(() => process.exit(0));
});

module.exports = app;
