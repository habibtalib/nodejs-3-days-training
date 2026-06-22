// config/db.js
// Modul ini menguruskan sambungan ke pangkalan data MongoDB menggunakan Mongoose.

const mongoose = require('mongoose');

/**
 * Sambung ke MongoDB menggunakan connection string dari fail .env (MONGODB_URI).
 * Fungsi ini dipanggil sekali sahaja semasa aplikasi dimulakan di server.js.
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Berjaya sambung ke MongoDB');
  } catch (error) {
    console.error('❌ Gagal sambung ke MongoDB:', error.message);
    // Hentikan aplikasi jika gagal sambung — tiada guna teruskan tanpa pangkalan data.
    process.exit(1);
  }
}

module.exports = connectDB;
