// middleware/auth.js
// Middleware untuk melindungi laluan yang memerlukan log masuk.

/**
 * Benarkan teruskan hanya jika pengguna sudah log masuk.
 * Jika tidak, alihkan ke halaman log masuk.
 */
exports.requireLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('gagal', 'Sila log masuk untuk meneruskan.');
  res.redirect('/login');
};
