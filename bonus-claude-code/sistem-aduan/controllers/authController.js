// controllers/authController.js
// Logik log masuk & log keluar (Bab 13).

const passport = require('passport');

/**
 * Papar borang log masuk.
 */
exports.showLogin = (req, res) => {
  // Jika sudah log masuk, terus ke papan pemuka.
  if (req.isAuthenticated()) return res.redirect('/');
  res.render('login', { title: 'Log Masuk' });
};

/**
 * Proses log masuk menggunakan Passport (strategi local).
 */
exports.login = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('gagal', (info && info.message) || 'Log masuk gagal.');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      req.flash('jaya', `Selamat datang, ${user.nama}!`);
      return res.redirect('/');
    });
  })(req, res, next);
};

/**
 * Log keluar.
 */
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash('jaya', 'Anda telah log keluar.');
    res.redirect('/');
  });
};
