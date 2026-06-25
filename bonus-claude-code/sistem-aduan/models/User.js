// models/User.js
// Model pengguna (kakitangan KPDN) untuk log masuk ke sistem.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    nama: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
    },
    peranan: {
      type: String,
      enum: ['admin', 'pegawai'],
      default: 'pegawai',
    },
  },
  { timestamps: true }
);

/**
 * Helper statik: cipta pengguna baharu dengan kata laluan di-hash.
 */
userSchema.statics.daftar = async function (username, password, nama, peranan = 'pegawai') {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.create({ username, passwordHash, nama, peranan });
};

/**
 * Kaedah contoh: sahkan kata laluan terhadap hash tersimpan.
 */
userSchema.methods.sahkanKataLaluan = function (password) {
  return bcrypt.compare(password, this.passwordHash);
};

module.exports = mongoose.model('User', userSchema);
