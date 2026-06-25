// middleware/errorHandler.js
// Pengendali ralat berpusat (Bab 14).

/**
 * Pengendali 404 — laluan tidak dijumpai.
 */
exports.notFound = (req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Dijumpai' });
};

/**
 * Pengendali ralat 500 — middleware dengan EMPAT parameter (err, req, res, next).
 * Mesti didaftarkan PALING AKHIR dalam server.js.
 */
exports.errorHandler = (err, req, res, next) => {
  // Log ralat penuh untuk pembangun (jangan dedahkan kepada pengguna).
  console.error('❌ Ralat:', err.stack);

  res.status(err.status || 500).render('500', {
    title: 'Ralat Pelayan',
    mesej: 'Maaf, berlaku masalah teknikal. Sila cuba lagi.',
  });
};
