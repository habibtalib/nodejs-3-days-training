// routes/web.js
// Laluan (routes) untuk paparan HTML aplikasi.

const express = require('express');
const router = express.Router();
const aduan = require('../controllers/aduanController');

// Papan pemuka / halaman utama
router.get('/', aduan.dashboard);

// CRUD Aduan
router.get('/aduan', aduan.index); //          Senarai semua aduan
router.get('/aduan/create', aduan.create); //   Borang daftar (mesti sebelum /aduan/:id)
router.post('/aduan', aduan.store); //          Simpan aduan baru
router.get('/aduan/:id', aduan.show); //        Papar satu aduan
router.get('/aduan/:id/edit', aduan.edit); //   Borang kemaskini
router.put('/aduan/:id', aduan.update); //      Kemaskini aduan
router.delete('/aduan/:id', aduan.destroy); //  Padam aduan

module.exports = router;
