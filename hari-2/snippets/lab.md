# Lab Hari 2 — Model, MVC & CRUD (Cipta + Baca)

Lab ini menguji kefahaman anda tentang model Mongoose, struktur MVC, dan operasi Cipta + Baca.

## Fail dalam folder ini

| Fail | Kegunaan |
|------|----------|
| `sample-aduan.json` | Contoh struktur satu rekod aduan |
| `mongosh-queries.js` | Pertanyaan untuk lihat/sahkan data dalam Compass/mongosh |

## Persediaan

```bash
npm install
cp .env.example .env     # isi MONGODB_URI
npm run seed             # masukkan 4 aduan contoh
npm run dev
```

## Latihan

### Latihan 1 — Daftar aduan
Buka `http://localhost:3000/aduan/create`, isi borang menggunakan data dalam `sample-aduan.json`, dan hantar. Sahkan ia muncul dalam senarai dengan nombor `ADN-2026-xxxx` automatik.

### Latihan 2 — Uji validasi
Cuba hantar borang kosong. Pastikan mesej ralat dipaparkan dan nilai yang anda taip masih kekal dalam borang.

### Latihan 3 — Carian
Guna kotak carian di `/aduan` untuk cari mengikut nama, no. aduan, atau premis. Sahkan tapisan berfungsi.

### Latihan 4 — Lihat data dalam pangkalan data
Buka MongoDB Compass, sambung ke cluster anda, dan jalankan pertanyaan dalam `mongosh-queries.js`. Bandingkan dengan apa yang dipaparkan di web.

### Latihan 5 — Tambah kategori baru (cabaran)
Dalam `models/Aduan.js`, tambah satu kategori baharu ke dalam array `KATEGORI` (contoh: `'Iklan Mengelirukan'`). Mulakan semula pelayan dan sahkan pilihan baharu muncul dalam borang daftar.

## Semakan kendiri

- [ ] Model `Aduan` mempunyai medan, enum, dan timestamps
- [ ] `noAduan` dijana automatik melalui hook `pre('save')`
- [ ] Controller ada kaedah `index`, `create`, `store`, `show`
- [ ] Laluan `/aduan/create` didaftar **sebelum** `/aduan/:id`
- [ ] Senarai, borang daftar, carian, dan halaman butiran berfungsi
- [ ] `npm run seed` memasukkan data contoh
