# Modul Bonus: Bina Sistem Lengkap dengan Claude Code

> **Apa itu modul ini?** Selepas memahami Node.js secara manual (Hari 1–3), modul bonus ini menunjukkan cara menggunakan **AI-assisted development** dengan **Claude Code** untuk membina sistem **lengkap** dengan lebih pantas — sambil tetap memahami setiap baris kod.

**Hasil modul:** sebuah [Sistem Aduan KPDN versi **lengkap**](./sistem-aduan/) yang menambah ciri yang sebelum ini hanya *pengenalan* pada Hari 3:
- 🔐 **Pengesahan & kebenaran** (log masuk kakitangan — Passport.js) — Bab 13
- ⚠️ **Pengendalian ralat** berpusat (404/500, graceful shutdown) — Bab 14
- 🛡️ **Keselamatan** (helmet, had kadar, sanitasi NoSQL) — Bab 15

---

## 1. Apa itu Claude Code?

**Claude Code** ialah alat baris arahan (CLI) daripada Anthropic yang membenarkan AI (**Claude**) membaca, menulis, dan mengubah kod dalam projek anda — terus dari terminal. Anda beri arahan dalam bahasa biasa; Claude membaca fail berkaitan, menulis kod, menjalankan ujian, dan membetulkan ralat.

| Cara lama | Dengan Claude Code |
|-----------|--------------------|
| Cari di Google/StackOverflow | Terangkan apa yang anda mahu |
| Salin-tampal kod, ubah suai | Claude tulis terus ke fail projek |
| Cuba & ralat secara manual | Claude jalankan & betulkan ralat |

> **Penting:** AI ialah **pembantu**, bukan pengganti kefahaman. Anda mesti **menyemak**, **menguji**, dan **memahami** kod yang dihasilkan. Itulah sebab anda belajar asasnya dahulu (Hari 1–3).

---

## 2. Persediaan

1. Pasang Node.js (sudah dibuat pada Hari 1).
2. Pasang Claude Code:
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
3. Dalam folder projek, jalankan:
   ```bash
   claude
   ```
4. Log masuk mengikut arahan (akaun Anthropic / API key).

> Rujuk dokumentasi rasmi: <https://docs.claude.com/en/docs/claude-code> untuk butiran terkini.

---

## 3. Aliran Kerja AI-Assisted (Kitaran)

```
   Rancang  →  Arah (prompt)  →  Semak kod  →  Uji  →  Ulang
      ↑                                               │
      └───────────────────────────────────────────────┘
```

1. **Rancang** — fikir apa yang anda mahu (satu ciri pada satu masa).
2. **Arah** — beri prompt yang jelas & khusus.
3. **Semak** — baca kod yang dihasilkan. Faham ia. Soal jika ragu.
4. **Uji** — jalankan aplikasi / ujian. Pastikan ia berfungsi.
5. **Ulang** — perbaiki dengan prompt susulan.

---

## 4. Prompt yang Berkesan

| Prinsip | Contoh lemah | Contoh baik |
|---------|--------------|-------------|
| **Khusus** | "tambah login" | "Tambah log masuk kakitangan guna Passport.js (strategi local) + bcryptjs untuk hash kata laluan" |
| **Beri konteks** | "betulkan ralat" | "Ralat `MONGODB_URI undefined` semasa `npm run dev`. Lihat server.js & .env" |
| **Rujuk fail** | "ubah model" | "Dalam `models/Aduan.js`, tambah medan `tarikhSiasatan` jenis Date" |
| **Minta ujian** | — | "Tulis ujian ringkas untuk sahkan log masuk berfungsi" |
| **Satu langkah** | "bina seluruh sistem auth + email + laporan" | Pecahkan kepada beberapa prompt kecil |

> **Petua:** Claude Code faham Bahasa Melayu **dan** Bahasa Inggeris. Gunakan bahasa yang anda selesa, tetapi kekalkan istilah teknikal (Passport, middleware, schema) dalam Bahasa Inggeris.

---

## 5. Pagar Keselamatan (Guardrails)

Sebelum menerima kod AI, sentiasa:

- ✅ **Baca & faham** — jangan terima kod yang anda tidak faham.
- ✅ **Uji** — jalankan aplikasi; cuba kes biasa & kes pinggir.
- ✅ **Semak keselamatan** — kata laluan di-hash? Input divalidasi? Rahsia dalam `.env`?
- ✅ **Version control** — `git commit` sebelum perubahan besar, supaya boleh undur.
- ⚠️ **Jangan** *commit* `.env` atau rahsia; jangan terima kebergantungan (package) yang mencurigakan.

---

## 6. Prompt yang Membina Sistem Lengkap Ini

Berikut ialah **urutan prompt** sebenar (boleh disalin) untuk membina ciri tambahan pada aplikasi Hari 3. Mulakan dengan menyalin folder `hari-3` sebagai asas, kemudian `cd` ke dalamnya dan jalankan `claude`.

### Langkah A — Pengesahan (Bab 13)

> **Prompt 1:**
> "Tambah model `User` dalam `models/User.js` dengan medan `username` (unik), `passwordHash`, `nama`, dan `peranan` (enum: admin/pegawai). Guna **bcryptjs** untuk hash kata laluan — sediakan kaedah statik `daftar()` dan kaedah `sahkanKataLaluan()`."

> **Prompt 2:**
> "Sediakan **Passport.js** dengan strategi **local** dalam `config/passport.js` (serialize/deserialize guna id pengguna). Kemudian dalam `server.js`, daftarkan `passport.initialize()` dan `passport.session()` selepas express-session."

> **Prompt 3:**
> "Cipta `controllers/authController.js` (showLogin, login, logout) dan `views/login.ejs`. Tambah middleware `requireLogin` dalam `middleware/auth.js`. Dalam `routes/web.js`, lindungi laluan cipta/edit/padam dengan `requireLogin` — tetapi biarkan senarai & papar aduan kekal awam."

> **Prompt 4:**
> "Kemas kini `views/partials/navbar.ejs` untuk papar nama pengguna + butang Log Keluar bila log masuk, atau pautan Log Masuk bila tidak. Sembunyikan butang Edit/Padam/Daftar bila belum log masuk."

> **Prompt 5:**
> "Dalam `seed.js`, cipta satu akaun admin contoh (username `admin`, kata laluan `kpdn1234`)."

### Langkah B — Pengendalian Ralat (Bab 14)

> **Prompt 6:**
> "Cipta `middleware/errorHandler.js` dengan pengendali `notFound` (404) dan `errorHandler` (500, middleware 4-parameter). Cipta `views/500.ejs`. Daftarkan kedua-duanya PALING AKHIR dalam `server.js`. Tambah juga *graceful shutdown* untuk SIGTERM."

### Langkah C — Keselamatan (Bab 15)

> **Prompt 7:**
> "Tambah **helmet**, **express-mongo-sanitize**, dan **express-rate-limit** (had cubaan log masuk) dalam `server.js`. Kerana kita guna Tailwind CDN, matikan CSP helmet buat masa ini dan tinggalkan komen untuk produksi."

### Langkah D — Sahkan

> **Prompt 8:**
> "Jalankan aplikasi dan sahkan: log masuk dengan admin/kpdn1234 berjaya, laluan cipta/edit/padam dilindungi, dan REST API masih berfungsi. Betulkan sebarang ralat."

---

## 7. Hasil

Lihat folder **[`sistem-aduan/`](./sistem-aduan/)** untuk sistem lengkap yang terhasil. Jalankan:

```bash
cd sistem-aduan
npm install
cp .env.example .env       # isi MONGODB_URI + SESSION_SECRET
npm run seed               # data contoh + akaun admin
npm run dev
```

Log masuk: **admin** / **kpdn1234**.

---

## 8. Lab

Cuba sendiri di **[`lab.md`](./lab.md)** — bina atau tambah satu ciri pada sistem ini menggunakan Claude Code.

> ⚠️ **Peringatan:** AI mempercepat kerja, tetapi **tanggungjawab kod adalah milik anda**. Sentiasa semak, uji, dan faham. Gunakan kemahiran Hari 1–3 untuk menilai kod yang dihasilkan AI.
