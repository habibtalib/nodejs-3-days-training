# Lab Hari 1 — Persediaan & Asas

Lab ini mengukuhkan apa yang anda belajar pada Hari 1. Cuba selesaikan sebelum Hari 2.

## Fail dalam folder ini

| Fail | Kegunaan |
|------|----------|
| `hello-server.js` | Pelayan Express minimum untuk faham asas routing |
| `test-mongodb.js` | Uji sambungan ke MongoDB Atlas anda |

## Latihan

### Latihan 1 — Jalankan pelayan contoh
```bash
node snippets/hello-server.js
```
Buka `http://localhost:3000` dan `http://localhost:3000/masa`. Pastikan kedua-dua laluan berfungsi.

### Latihan 2 — Sahkan sambungan MongoDB
1. Salin `.env.example` kepada `.env` dan isi `MONGODB_URI` dari MongoDB Atlas.
2. Jalankan:
   ```bash
   node snippets/test-mongodb.js
   ```
3. Pastikan anda nampak `✅ Sambungan berjaya!`. Jika gagal, semak:
   - Kata laluan pengguna pangkalan data betul (tiada `<`/`>`)
   - **Network Access** di Atlas membenarkan IP anda (atau `0.0.0.0/0` untuk kursus)

### Latihan 3 — Tambah laluan baru (cabaran)
Dalam `server.js`, tambah satu laluan `GET /tentang` yang memaparkan paparan EJS baru (`views/tentang.ejs`) mengandungi maklumat ringkas tentang sistem aduan KPDN.

> **Petua:** Guna `res.render('tentang', { title: 'Tentang' })` dan buat fail `views/tentang.ejs`.

## Semakan kendiri

- [ ] `node -v` dan `npm -v` memaparkan versi
- [ ] Pelayan Express berjalan dengan `npm run dev`
- [ ] Halaman utama dipaparkan melalui EJS + layout
- [ ] Terminal menunjukkan "✅ Berjaya sambung ke MongoDB"
- [ ] Halaman 404 berfungsi untuk laluan yang tidak wujud
