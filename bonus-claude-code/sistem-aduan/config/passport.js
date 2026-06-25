// config/passport.js
// Konfigurasi Passport.js dengan strategi "local" (username + password).

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username.toLowerCase().trim() });
      if (!user) {
        return done(null, false, { message: 'Username atau kata laluan salah.' });
      }
      const sah = await user.sahkanKataLaluan(password);
      if (!sah) {
        return done(null, false, { message: 'Username atau kata laluan salah.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Simpan hanya id pengguna dalam sesi.
passport.serializeUser((user, done) => done(null, user.id));

// Ambil semula pengguna penuh dari id pada setiap permintaan.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
