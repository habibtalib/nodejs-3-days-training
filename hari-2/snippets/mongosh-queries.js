// mongosh-queries.js
// Contoh pertanyaan untuk dijalankan dalam MongoDB Compass (tab "MONGOSH")
// atau dalam terminal `mongosh "<connection-string>"`.
// Berguna untuk melihat & mengesahkan data semasa pembangunan.

// Pilih pangkalan data
use('aduan_kpdn');

// 1) Lihat semua aduan
db.aduans.find();

// 2) Kira bilangan aduan
db.aduans.countDocuments();

// 3) Cari aduan mengikut status
db.aduans.find({ status: 'Baru' });

// 4) Cari mengikut nama (tidak case-sensitive)
db.aduans.find({ namaPengadu: { $regex: 'ahmad', $options: 'i' } });

// 5) Susun ikut terbaru dahulu
db.aduans.find().sort({ createdAt: -1 });

// 6) Padam semua aduan (HATI-HATI — untuk reset semasa belajar sahaja)
// db.aduans.deleteMany({});
