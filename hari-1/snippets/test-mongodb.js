// test-mongodb.js
// Skrip pantas untuk menguji sambungan ke MongoDB Atlas.
// Jalankan selepas isi MONGODB_URI dalam .env:
//   node snippets/test-mongodb.js
//
// Jika berjaya, ia akan log "✅ Sambungan berjaya!" dan keluar.

require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Sambungan berjaya! MongoDB Atlas boleh dicapai.');
  } catch (error) {
    console.error('❌ Sambungan gagal:', error.message);
    console.error('Semak semula MONGODB_URI, kata laluan pengguna DB, dan Network Access (IP).');
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
})();
