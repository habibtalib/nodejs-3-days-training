// routes/web.js
// Laluan untuk paparan HTML.
// Paparan (senarai, butiran) adalah AWAM. Pengurusan (cipta/edit/padam)
// memerlukan log masuk — lihat middleware requireLogin.

const express = require('express');
const router = express.Router();
const aduan = require('../controllers/aduanController');
const auth = require('../controllers/authController');
const { requireLogin } = require('../middleware/auth');

// --- Pengesahan (auth) ---
router.get('/login', auth.showLogin);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

// --- Papan pemuka & paparan awam ---
router.get('/', aduan.dashboard);
router.get('/aduan', aduan.index); //           Senarai semua aduan (awam)
router.get('/aduan/create', requireLogin, aduan.create); // Borang daftar (perlu log masuk)
router.post('/aduan', requireLogin, aduan.store); //        Simpan aduan baru
router.get('/aduan/:id', aduan.show); //        Papar satu aduan (awam)
router.get('/aduan/:id/edit', requireLogin, aduan.edit); // Borang kemaskini
router.put('/aduan/:id', requireLogin, aduan.update); //    Kemaskini aduan
router.delete('/aduan/:id', requireLogin, aduan.destroy); // Padam aduan

module.exports = router;
