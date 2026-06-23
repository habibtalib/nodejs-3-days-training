# Kursus Node.js 3 Hari — Sistem Aduan Pengguna KPDN

Kursus latihan amali Node.js untuk pemula, dengan nota dalam **Bahasa Melayu** dan kod dalam **Bahasa Inggeris**. Sepanjang 3 hari, peserta akan membina **Sistem Pengurusan Aduan Pengguna** untuk **Kementerian Perdagangan Dalam Negeri dan Kos Sara Hidup (KPDN)** — sebuah aplikasi web CRUD lengkap menggunakan Node.js, Express, EJS, dan MongoDB.

> Inspirasi domain: [kpdn.gov.my](https://www.kpdn.gov.my/ms/) — aduan pengguna berkaitan harga barang, barang kawalan, penyukatan & penimbangan, dan penipuan pengguna.

> 📘 **Buku rujukan:** Susunan modul dan urutan kursus ini dijajarkan dengan buku **_Node.js for Beginners_** oleh **Ulises Gascón** (Packt, 2024, ISBN 978-1-80324-517-1). Setiap hari dipetakan ke Bahagian/Bab buku — lihat [Penjajaran dengan Buku Rujukan](#penjajaran-dengan-buku-rujukan). Buku mengajar konsep secara mendalam; kursus ini mengamalkannya secara *hands-on* dengan membina satu projek sebenar.

## Projek: Sistem Aduan Pengguna KPDN

Aplikasi ini menguruskan:

- **Aduan** — Daftar, papar, cari, kemaskini, dan padam rekod aduan pengguna
- **Kategori Aduan** — Harga Tidak Berpatutan, Barang Kawalan, Penyukatan & Penimbangan, Penipuan Pengguna, dll.
- **Status Siasatan** — Aliran kerja: Baru → Dalam Siasatan → Selesai / Ditolak
- **REST API** — Titik akhir JSON untuk integrasi aplikasi mobile atau sistem lain
- **Papan Pemuka** — Statistik ringkas jumlah aduan mengikut status

## Ringkasan Kursus

Urutan kursus mengikut aliran buku rujukan: **asas bahasa & ekosistem** (Hari 1) → **web, Express & seni bina** (Hari 2) → **aplikasi kukuh: data, auth, ralat & keselamatan** (Hari 3).

| Hari | Bahagian Buku | Fokus | Hasil |
|------|---------------|-------|-------|
| [**Hari 1**](./hari-1/) | Bhg 1–2 · Bab 1–6 | Pengenalan Node.js & seni bina; persediaan (nvm, REPL, DevTools); asas JavaScript; pengaturcaraan tak segerak; modul CJS/ESM; npm & `package.json`; mula rangka projek Express + EJS | Persekitaran siap + projek Node.js/Express berjalan & bersambung ke MongoDB |
| [**Hari 2**](./hari-2/) | Bhg 2–3 · Bab 7–10 | Seni bina dipacu peristiwa & pelayan HTTP; pengenalan pengujian; HTTP & REST API; Express (enjin templat/EJS, routing, middleware); model Mongoose & CRUD (Cipta + Baca) | Aplikasi Express + EJS dengan model, borang & senarai aduan |
| [**Hari 3**](./hari-3/) | Bhg 4 · Bab 11–15 | Bina projek dari kosong; kegigihan data MongoDB (Mongoose); REST API; pengenalan pengesahan (Passport.js/JWT), pengendalian ralat & keselamatan; deploy | Sistem CRUD lengkap + REST API + naik ke hosting awan |

> **Nota penjajaran:** Untuk memberi peserta pengalaman *hands-on* awal, Hari 1 turut memulakan rangka projek Express + EJS (pratonton Bab 9–10 yang didalami pada Hari 2). Topik auth, pengendalian ralat & keselamatan (Bab 13–15) diperkenalkan secara ringkas pada Hari 3 dengan rujukan ke bab buku untuk pendalaman.

## Penjajaran dengan Buku Rujukan

**_Node.js for Beginners_** — Ulises Gascón (Packt, Mei 2024). Susunan kursus mengikut 4 Bahagian buku. Jadual di bawah memetakan setiap bab ke hari kursus dan tahap liputan.

| Bahagian Buku | Bab | Tajuk Bab | Hari | Liputan |
|---------------|-----|-----------|------|---------|
| **Bhg 1** — Node.js & JavaScript | 1 | Introduction to Node.js | Hari 1 | Penuh |
| | 2 | Setting Up the Development Environment | Hari 1 | Penuh |
| | 3 | JavaScript Fundamentals | Hari 1 | Penuh |
| | 4 | Asynchronous Programming | Hari 1 | Penuh |
| **Bhg 2** — Ekosistem & Seni Bina | 5 | Node.js Core Libraries (CJS/ESM) | Hari 1 | Penuh |
| | 6 | External Modules and npm | Hari 1 | Penuh |
| | 7 | Event-Driven Architecture | Hari 2 | Penuh |
| | 8 | Testing in Node.js | Hari 2 | Pengenalan |
| **Bhg 3** — Asas Aplikasi Web | 9 | Handling HTTP and REST APIs | Hari 2 | Penuh |
| | 10 | Building Web Applications with Express | Hari 2 | Penuh |
| **Bhg 4** — Aplikasi Web Kukuh | 11 | Building a Web Application Project from Scratch | Hari 3 | Penuh |
| | 12 | Data Persistence with MongoDB | Hari 3 | Penuh |
| | 13 | User Authentication & Authorization (Passport.js) | Hari 3 | Pengenalan |
| | 14 | Error Handling in Node.js | Hari 3 | Pengenalan |
| | 15 | Securing Web Applications | Hari 3 | Pengenalan |

**Liputan:** *Penuh* = diajar & diamalkan sepenuhnya dalam kursus · *Pengenalan* = diperkenalkan secara ringkas dengan rujukan ke bab buku untuk pendalaman.

> **Petua untuk pengajar:** Setiap `hari-N/README.md` bermula dengan jadual **Rujukan Buku** yang memetakan bahagian hari tersebut ke bab buku, supaya peserta boleh membaca bab berkaitan sebelum/selepas setiap sesi.

## Nota Konsep (Latar Belakang)

Sebelum mula coding, fahami **kenapa** teknologi ini dipilih. Folder [`nota/`](./nota/) mengandungi nota konsep ringkas:

- [**Kenapa Node.js?**](./nota/01-kenapa-nodejs.md) — perbandingan dengan PHP/Python/Java/Go, dan bila sesuai (atau tidak sesuai) guna Node.js. *(Bab 1)*
- [**Kenapa MongoDB?**](./nota/02-kenapa-mongodb.md) — SQL vs NoSQL, dan bila sesuai guna MongoDB. *(Bab 12)*
- [**Node.js + MongoDB bersama**](./nota/03-nodejs-dan-mongodb.md) — stack MEAN/MERN dan **contoh sistem komersial sebenar** (Netflix, PayPal, LinkedIn, eBay, Forbes, Adobe). *(Bab 1 & 12)*
- [**Pengurus pakej & alat CLI**](./nota/04-pengurus-pakej.md) — npm vs pnpm vs Yarn vs Bun, dan npx. *(Bab 6)*
- [**Deployment**](./nota/05-deployment.md) — konsep + pilihan platform (Render, Railway, Vercel, VPS, Docker, AWS). *(Hari 3)*
- [**Konvensyen penamaan**](./nota/06-konvensyen-penamaan.md) — camelCase / PascalCase / snake_case untuk Node.js & MongoDB. *(Bab 3)*
- [**Tutorial persediaan tempatan Windows**](./nota/07-setup-windows.md) 🪟 — pasang Node.js, VS Code, MongoDB Community + Compass (langkah + pautan tutorial visual rasmi). *(Bab 2)*

## Keperluan Sistem

Sebelum memulakan kursus, pastikan anda mempunyai:

- **Windows 10/11 (64-bit)** — sasaran utama panduan ini (juga berfungsi pada macOS/Linux)
- Minimum 4GB RAM (8GB disyorkan)
- 2GB ruang cakera kosong
- Akaun pengguna dengan kebenaran *Administrator* (untuk memasang perisian)
- Sambungan internet untuk npm (dan untuk MongoDB Atlas jika guna pilihan awan)

## Perisian yang Diperlukan

| Perisian | Tujuan | Pautan |
|----------|--------|--------|
| Node.js (LTS) | Persekitaran runtime JavaScript + npm | [nodejs.org](https://nodejs.org/) |
| VS Code | Editor kod | [code.visualstudio.com](https://code.visualstudio.com/) |
| MongoDB — **pilih satu:** | Pangkalan data NoSQL | |
| &nbsp;&nbsp;• MongoDB Atlas (awan) | Percuma, tiada pemasangan (perlu internet) | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| &nbsp;&nbsp;• MongoDB Community (tempatan Windows) | Pasang di komputer, berfungsi *offline* | [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) |
| Chrome | Pelayar & DevTools | [google.com/chrome](https://www.google.com/chrome/) |

> **Nota:** npm disertakan secara automatik bersama Node.js. Tidak perlu pasang berasingan.

> **Persediaan tempatan vs awan:** Panduan **Hari 1** menyediakan langkah penuh untuk **kedua-dua** pilihan — MongoDB Atlas (awan) **dan** MongoDB Community Server tempatan pada Windows. Lihat bahagian *Persediaan* dalam [`hari-1/README.md`](./hari-1/), termasuk **Senarai Tangkapan Skrin Diperlukan** untuk penyedia bahan kursus.

> 🪟 **Kebanyakan pelajar guna Windows?** Ada **tutorial persediaan tempatan Windows** khusus (langkah penuh + pautan tutorial visual rasmi dengan tangkapan skrin) di [`nota/07-setup-windows.md`](./nota/07-setup-windows.md) — Node.js, VS Code, MongoDB Community Server + Compass.

## Susunan Teknologi (Tech Stack)

| Lapisan | Teknologi |
|---------|-----------|
| Runtime | Node.js |
| Rangka kerja web | Express |
| Enjin templat | EJS (+ express-ejs-layouts) |
| Pangkalan data | MongoDB (Atlas) |
| ODM | Mongoose |
| Penggayaan | Tailwind CSS (CDN) |
| Lain-lain | dotenv, method-override, express-session, connect-flash, nodemon |

## Struktur Repositori

```
nodejs-2-days-training/
├── README.md                  # Fail ini
├── nota/                      # Nota konsep (kenapa Node.js, kenapa MongoDB, contoh komersial)
│   ├── 01-kenapa-nodejs.md
│   ├── 02-kenapa-mongodb.md
│   └── 03-nodejs-dan-mongodb.md
├── hari-1/                    # Snapshot projek pada akhir Hari 1
│   ├── README.md              # Nota lengkap Hari 1
│   ├── server.js              # Aplikasi Express + EJS + sambungan MongoDB
│   ├── config/db.js
│   ├── views/                 # layout, navbar, halaman utama
│   └── snippets/              # Lab: hello-server, test-mongodb, lab.md
├── hari-2/                    # Snapshot projek pada akhir Hari 2
│   ├── README.md              # Nota lengkap Hari 2
│   ├── models/Aduan.js        # Model Mongoose
│   ├── controllers/           # Logik Cipta & Baca
│   ├── routes/web.js
│   ├── views/aduan/           # senarai, daftar, papar
│   ├── seed.js                # Data contoh
│   └── snippets/              # Lab: sample-aduan, mongosh-queries, lab.md
├── hari-3/                    # Snapshot projek lengkap (akhir Hari 3)
│   ├── README.md              # Nota lengkap Hari 3
│   ├── controllers/           # CRUD penuh + API
│   ├── routes/web.js & api.js
│   ├── views/                 # + edit, papan pemuka
│   └── snippets/              # Lab: curl-test.sh, api-requests.http, lab.md
└── slides/
    ├── README.md              # Panduan slaid
    ├── nodejs-training.html   # Deck reveal.js (buka dalam pelayar)
    └── vendor/reveal/         # reveal.js (vendored, berfungsi dari file://)
```

## Cara Menggunakan Repositori Ini

1. **Clone** repositori ini:
   ```bash
   git clone https://github.com/habibtalib/nodejs-2-days-training.git
   ```

2. Buka folder hari yang berkenaan (contoh: `hari-1/`)

3. Baca `README.md` dalam setiap folder untuk nota lengkap langkah demi langkah

4. Setiap folder hari adalah **projek lengkap dan boleh dijalankan** — anda boleh:
   - Bina dari kosong sambil ikut nota README, **atau**
   - Salin folder, jalankan `npm install`, sediakan fail `.env`, dan terus jalankan

5. Untuk menjalankan mana-mana snapshot:
   ```bash
   cd hari-1        # atau hari-2 / hari-3
   npm install
   cp .env.example .env      # kemudian isi MONGODB_URI anda
   npm run dev
   ```

## Slaid Pembentangan

Deck slaid (reveal.js) disediakan untuk pengajar. Buka terus dalam pelayar — tiada pelayan diperlukan:

```text
slides/nodejs-training.html
```

reveal.js disimpan secara tempatan di `slides/vendor/reveal/`, jadi deck berfungsi dari `file://` tanpa internet. Untuk eksport PDF, buka `slides/nodejs-training.html?print-pdf` dan cetak sebagai PDF. Lihat [`slides/README.md`](./slides/README.md) untuk kawalan & butiran.

## Lab Setiap Hari

Setiap folder hari mempunyai folder `snippets/` yang mengandungi **latihan lab** (`lab.md`) dan **fail bantuan** untuk amali:

| Hari | Fail lab |
|------|----------|
| Hari 1 | `hello-server.js`, `test-mongodb.js`, `lab.md` |
| Hari 2 | `sample-aduan.json`, `mongosh-queries.js`, `lab.md` |
| Hari 3 | `curl-test.sh`, `api-requests.http`, `lab.md` |

## Aliran Pengajaran Disyorkan

1. Mulakan dengan slaid bahagian hari berkenaan (`slides/nodejs-training.html`).
2. Ikut nota langkah demi langkah dalam `hari-N/README.md` sambil *live coding*.
3. Bandingkan kod peserta dengan snapshot dalam folder `hari-N/`.
4. Uji hasil dalam pelayar (web) dan API client (Thunder Client / curl).
5. Tamatkan setiap hari dengan latihan dalam `hari-N/snippets/lab.md` dan senarai semakan kendiri.

## Entiti Utama Projek

### Aduan (`aduans`)
| Medan | Jenis | Penerangan |
|-------|-------|------------|
| `noAduan` | String (unik) | Nombor rujukan automatik, cth: `ADN-2026-0001` |
| `namaPengadu` | String | Nama penuh pengadu (wajib) |
| `noIc` | String | No. kad pengenalan (wajib) |
| `telefon` | String | No. telefon (wajib) |
| `email` | String | E-mel (pilihan) |
| `kategori` | String (enum) | Kategori aduan (wajib) |
| `premis` | String | Nama premis/perniagaan diadu (wajib) |
| `lokasi` | String | Alamat premis (wajib) |
| `butiran` | String | Penerangan penuh aduan (wajib) |
| `status` | String (enum) | Baru / Dalam Siasatan / Selesai / Ditolak |
| `createdAt`, `updatedAt` | Date | Dijana automatik oleh Mongoose |

## Sambungan VS Code Disyorkan

| Sambungan | Tujuan |
|-----------|--------|
| ESLint | Semakan kualiti kod JavaScript |
| Prettier | Pemformatan kod automatik |
| EJS language support | Penyerlahan sintaks EJS |
| DotENV | Penyerlahan fail `.env` |
| MongoDB for VS Code | Lihat & urus data MongoDB |
| Thunder Client | Uji REST API dalam VS Code |

## Komuniti & Sumber Tambahan

- [Dokumentasi Rasmi Node.js](https://nodejs.org/docs)
- [Dokumentasi Express](https://expressjs.com/)
- [Dokumentasi Mongoose](https://mongoosejs.com/docs/)
- [Dokumentasi MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Portal Rasmi KPDN](https://www.kpdn.gov.my/ms/) — rujukan domain

## Penyumbang

Disediakan oleh **Habib** — [bespokesb.com](https://bespokesb.com)

## Lesen

Repositori ini dilesenkan di bawah [MIT License](LICENSE).
