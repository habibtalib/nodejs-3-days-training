// routes/web.js
// Laluan (routes) untuk paparan HTML aplikasi.

const express = require('express');
const router = express.Router();
const aduan = require('../controllers/aduanController');
const tindakan = require('../controllers/tindakanController');
const analitik = require('../controllers/analitikController');
const upload = require('../config/multer');

// Papan pemuka / halaman utama
router.get('/', aduan.dashboard);

// Analitik (aggregation) — daftar sebelum /aduan/:id supaya tidak bertindih
router.get('/analitik', analitik.index);

// CRUD Aduan
router.get('/aduan', aduan.index); //          Senarai semua aduan
router.get('/aduan/create', aduan.create); //   Borang daftar (mesti sebelum /aduan/:id)
router.post('/aduan', aduan.store); //          Simpan aduan baru
router.get('/aduan/:id', aduan.show); //        Papar satu aduan
router.get('/aduan/:id/edit', aduan.edit); //   Borang kemaskini
router.put('/aduan/:id', aduan.update); //      Kemaskini aduan
router.delete('/aduan/:id', aduan.destroy); //  Padam aduan

// Hari 4 — tindakan susulan (hubungan data)
router.post('/aduan/:id/tindakan', tindakan.store);

// Hari 4 — muat naik lampiran (multer; "lampiran" = nama medan input fail)
router.post('/aduan/:id/lampiran', upload.array('lampiran', 5), aduan.muatNaikLampiran);

module.exports = router;
