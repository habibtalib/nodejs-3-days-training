# Lab Hari 3 — CRUD Lengkap, REST API & Deploy

Lab terakhir: lengkapkan CRUD, uji REST API, dan deploy aplikasi.

## Fail dalam folder ini

| Fail | Kegunaan |
|------|----------|
| `curl-test.sh` | Skrip uji semua titik akhir API (GET/POST/PUT/DELETE) |
| `api-requests.http` | Koleksi permintaan untuk REST Client / Thunder Client |

## Persediaan

```bash
npm install
cp .env.example .env     # isi MONGODB_URI + SESSION_SECRET
npm run seed
npm run dev
```

## Latihan

### Latihan 1 — Kemaskini & padam
Buka satu aduan, klik **Edit**, tukar **Status** kepada "Dalam Siasatan", dan simpan. Pastikan mesej flash hijau muncul. Kemudian uji butang **Padam** (dengan pengesahan).

### Latihan 2 — Papan pemuka
Buka `http://localhost:3000`. Sahkan kad statistik (Jumlah, Baru, Dalam Siasatan, Selesai) berubah selepas anda kemaskini status aduan.

### Latihan 3 — Uji REST API dengan curl
```bash
bash snippets/curl-test.sh
```
Perhatikan respons JSON untuk setiap operasi (senarai, cipta, papar, kemaskini, padam).

### Latihan 4 — Uji REST API dengan Thunder Client
Buka `api-requests.http` dalam VS Code, hantar setiap permintaan, dan periksa kod status (200, 201, 404) serta badan JSON.

### Latihan 5 — Tapisan API (cabaran)
Tambah sokongan tapisan status pada `GET /api/aduan` supaya `GET /api/aduan?status=Baru` memulangkan hanya aduan berstatus "Baru".

> **Petua:** Dalam `controllers/apiController.js`, baca `req.query.status` dan bina objek pertanyaan untuk `Aduan.find()`.

### Latihan 6 — Deploy (cabaran)
1. Push projek ke GitHub (pastikan `.gitignore` menolak `node_modules` & `.env`).
2. Di MongoDB Atlas, tetapkan **Network Access** kepada `0.0.0.0/0`.
3. Cipta **Web Service** baru di [Render](https://render.com):
   - Build command: `npm install`
   - Start command: `npm start`
   - Environment variables: `MONGODB_URI`, `SESSION_SECRET`
4. Buka URL awam dan sahkan aplikasi berjalan.

## Semakan kendiri

- [ ] Kemaskini & padam berfungsi (method-override)
- [ ] Mesej flash dipaparkan selepas tindakan
- [ ] Papan pemuka menunjukkan statistik betul
- [ ] Kelima-lima titik akhir API memulangkan JSON yang betul
- [ ] Aplikasi berjaya deploy ke hosting awan
