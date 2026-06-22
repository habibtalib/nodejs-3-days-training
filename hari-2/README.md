# Hari 2 — Panduan Bengkel: Model, Pangkalan Data & CRUD (Cipta + Baca)

Panduan langkah demi langkah untuk membina lapisan **pangkalan data** dan operasi **CRUD** pertama bagi Sistem Aduan Pengguna KPDN. Pada akhir bengkel ini (lebih kurang 6 jam), pengguna boleh **mendaftar aduan baharu** melalui borang, dan **menyenarai serta mencari** aduan yang telah disimpan dalam MongoDB.

**Imbas kembali Hari 1:** Anda telah menyediakan persekitaran Node.js, membina pelayan Express + EJS, dan menyambung ke MongoDB Atlas. Hari ini kita teruskan dari projek yang sama.

**Apa yang akan dibina (mengikut urutan buku):**
- **Seni bina dipacu peristiwa** — `EventEmitter` & pelayan HTTP tulen *(Bab 7)*
- **Pengenalan pengujian** — kepentingan ujian + ujian unit pertama *(Bab 8)*
- **HTTP & REST API** — kaedah, kod status, dan prinsip REST *(Bab 9)*
- **Express** — di atas asas di atas: enjin templat (EJS), routing & middleware *(Bab 10)*, yang kita amalkan dengan membina:
  - **Model Mongoose** `Aduan` (skema, validasi, hook auto-jana nombor rujukan)
  - Struktur **MVC** (Model–View–Controller) yang kemas
  - Operasi **Cipta (Create)** & **Baca (Read)**: borang daftar, senarai, carian, butiran
  - **Validasi borang**, paparan mesej ralat, dan **seeder** data contoh

> **Nota untuk pemula:** Teruskan menggunakan folder projek Hari 1. Jika anda ingin mula segar, salin folder `hari-1` dan jalankan `npm install`.

---

## Rujukan Buku

Hari 2 menjajarkan dengan **_Node.js for Beginners_** (Ulises Gascón, Packt 2024), **Bahagian 2–3**:

| Bahagian hari ini | Bab buku | Tajuk |
|-------------------|----------|-------|
| Seni Bina Dipacu Peristiwa & Pelayan HTTP | **Bab 7** | Event-Driven Architecture |
| Pengenalan Pengujian | **Bab 8** | Testing in Node.js |
| HTTP & REST API | **Bab 9** | Handling HTTP and REST APIs |
| Express + Model/MVC/CRUD (binaan utama) | **Bab 10** | Building Web Applications with Express |

> **Nota:** Bahagian binaan utama hari ini (model Mongoose, MVC, routing, EJS, middleware) **ialah** pengamalan praktikal Bab 10 buku. Kita mulakan dengan konsep asas (Bab 7–9) dahulu, kemudian membina aplikasi dengan Express (Bab 10).

---

## Seni Bina Dipacu Peristiwa & Pelayan HTTP Pertama (Bab 7)

Node.js dibina di atas model **dipacu peristiwa (event-driven)**: kod "mendengar" (*listen*) sesuatu peristiwa, dan bertindak balas apabila peristiwa itu "dipancarkan" (*emit*). Banyak modul teras Node.js (termasuk pelayan HTTP) menggunakan corak ini.

### `EventEmitter` — corak asas

```js
// contoh-events.js
const EventEmitter = require('events');

const pemancar = new EventEmitter();

// "Dengar" peristiwa bernama 'aduanBaru'
pemancar.on('aduanBaru', (noAduan) => {
  console.log(`📣 Aduan baharu diterima: ${noAduan}`);
});

// "Pancar" peristiwa — semua pendengar akan dipanggil
pemancar.emit('aduanBaru', 'ADN-2026-0001');
// Output: 📣 Aduan baharu diterima: ADN-2026-0001
```

**Konsep penting:**
- **`.on(nama, fungsi)`** — daftar pendengar untuk sesuatu peristiwa.
- **`.emit(nama, data)`** — pancarkan peristiwa; setiap pendengar dipanggil dengan `data`.
- Corak ini membenarkan kod **terpisah** (*decoupled*) — pemancar tidak perlu tahu siapa yang mendengar.

### Pelayan HTTP tulen (tanpa Express)

Sebelum Express, mari lihat cara Node.js mencipta pelayan web menggunakan modul teras **`http`** sahaja. Pelayan ini sendiri ialah sebuah `EventEmitter` (ia memancarkan peristiwa `request` setiap kali ada permintaan).

```js
// contoh-http.js
const http = require('http');

const pelayan = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Helo dari pelayan HTTP tulen Node.js!');
});

pelayan.listen(3000, () => {
  console.log('Pelayan di http://localhost:3000');
});
```

> **Konsep penting:** **Express ialah lapisan kemudahan di atas modul `http` ini.** Apa yang kita tulis sebagai `app.get(...)` dalam Express, akhirnya menggunakan `http.createServer` di sebalik tabir. Memahami asas ini menjelaskan *mengapa* Express berfungsi begitu.

---

## Pengenalan Pengujian (Bab 8)

**Pengujian (testing)** memastikan kod kita berfungsi seperti dijangka, dan kekal berfungsi apabila kita ubah sesuatu kemudian. Ia menjimatkan masa dalam jangka panjang berbanding menguji secara manual setiap kali.

**Piramid ujian** — panduan kasar berapa banyak setiap jenis ujian:

| Jenis | Apa yang diuji | Kuantiti |
|-------|----------------|----------|
| **Unit** | Satu fungsi/unit kecil secara berasingan | Paling banyak |
| **Integrasi** | Beberapa bahagian bekerja bersama (cth: controller + DB) | Sederhana |
| **End-to-end (E2E)** | Keseluruhan aliran seperti pengguna sebenar | Paling sedikit |

Node.js (versi moden) mempunyai **pelari ujian terbina dalam** — tidak perlu pasang apa-apa untuk bermula:

```js
// contoh.test.js
const { test } = require('node:test');
const assert = require('node:assert');

// Fungsi kecil yang hendak diuji
function jumlah(a, b) {
  return a + b;
}

test('jumlah dua nombor', () => {
  assert.strictEqual(jumlah(2, 3), 5);
});
```

Jalankan dengan:

```bash
node --test
```

> **Nota:** Ini hanyalah **pengenalan**. Buku rujukan (Bab 8) mendalami pengujian dengan **Jest**, liputan kod (*code coverage*), dan **TDD** (*Test-Driven Development*). Pada Hari 3 kita boleh menguji titik akhir API dengan alat seperti `supertest`.

---

## HTTP & REST API (Bab 9)

Setiap interaksi web ialah pertukaran **permintaan (request)** dan **respons (response)** melalui protokol **HTTP**. Memahami ini penting sebelum membina laluan Express.

**Kaedah HTTP** yang biasa digunakan dalam CRUD:

| Kaedah | Tujuan | Contoh dalam projek |
|--------|--------|---------------------|
| `GET` | Baca/dapatkan data | `GET /aduan` (senarai) |
| `POST` | Cipta data baharu | `POST /aduan` (daftar) |
| `PUT` | Kemaskini data | `PUT /aduan/:id` (Hari 3) |
| `DELETE` | Padam data | `DELETE /aduan/:id` (Hari 3) |

**Kod status HTTP** yang biasa:

| Kod | Maksud |
|-----|--------|
| `200 OK` | Permintaan berjaya |
| `201 Created` | Sumber baharu berjaya dicipta |
| `302 Found` | Ubah hala (redirect) |
| `400 Bad Request` | Input tidak sah (cth: validasi gagal) |
| `404 Not Found` | Sumber tidak dijumpai |
| `500 Internal Server Error` | Ralat di pihak pelayan |

**Prinsip REST** — reka bentuk API yang konsisten: setiap *sumber* (cth: `aduan`) ada URL sendiri, dan kaedah HTTP menentukan tindakan ke atasnya. Inilah corak yang kita gunakan untuk laluan `/aduan` hari ini, dan untuk **REST API JSON** penuh pada Hari 3.

> **Nota:** Kod status & kaedah ini muncul terus dalam controller kita (cth: `res.status(400)`, `res.redirect(...)`, `router.post(...)`). Perhatikannya semasa membina di bawah.

---

## Express (Bab 10)

**Express** menyediakan **routing**, **enjin templat** (EJS), dan corak **middleware** di atas modul `http`. Selebihnya hari ini ialah pengamalan praktikal Bab 10 — kita membina aplikasi sebenar menggunakan Express bersama Mongoose, mengikut corak **MVC**.

---

## Konsep MVC (Bab 10)

Sebelum menulis kod, fahami corak **MVC** — cara menyusun kod supaya kemas dan mudah diselenggara. Express (Bab 10) membenarkan kita menyusun routing, controller, dan paparan (EJS) mengikut corak ini:

| Lapisan | Folder | Tanggungjawab |
|---------|--------|---------------|
| **Model** | `models/` | Struktur data & interaksi dengan pangkalan data |
| **View** | `views/` | Paparan (HTML/EJS) yang dilihat pengguna |
| **Controller** | `controllers/` | Logik: terima permintaan, ambil/simpan data, hantar ke view |
| (Routes) | `routes/` | Peta URL → fungsi controller yang sepatutnya dijalankan |

Aliran satu permintaan:

```
Pelayar  →  Route  →  Controller  →  Model  →  MongoDB
                          ↓
                        View (EJS)  →  HTML  →  Pelayar
```

Struktur folder yang akan kita bina hari ini:

```
sistem-aduan-kpdn/
├── models/
│   └── Aduan.js
├── controllers/
│   └── aduanController.js
├── routes/
│   └── web.js
├── views/
│   └── aduan/
│       ├── index.ejs    # senarai
│       ├── create.ejs   # borang daftar
│       └── show.ejs      # butiran
└── seed.js
```

---

## Langkah 1: Cipta Model Aduan

Model ialah "pelan tindakan" untuk satu jenis dokumen dalam MongoDB. Dengan Mongoose, kita tentukan **skema** (medan & jenisnya), kemudian Mongoose menyediakan fungsi untuk `create`, `find`, `update`, dan `delete`.

Cipta folder `models/` dan fail `models/Aduan.js`:

```js
// models/Aduan.js
// Skema dan model Mongoose untuk satu aduan pengguna KPDN.

const mongoose = require('mongoose');

// Senarai kategori aduan yang dibenarkan (gunakan semula dalam borang & validasi).
const KATEGORI = [
  'Harga Tidak Berpatutan',
  'Barang Kawalan',
  'Penyukatan & Penimbangan',
  'Penipuan Pengguna',
  'Kawalan Harga Raya',
  'Lain-lain',
];

// Senarai status aduan mengikut aliran kerja siasatan.
const STATUS = ['Baru', 'Dalam Siasatan', 'Selesai', 'Ditolak'];

const aduanSchema = new mongoose.Schema(
  {
    // Nombor rujukan aduan, contoh: ADN-2026-0001. Dijana automatik (lihat hook di bawah).
    noAduan: {
      type: String,
      unique: true,
    },
    namaPengadu: {
      type: String,
      required: [true, 'Nama pengadu wajib diisi'],
      trim: true,
    },
    noIc: {
      type: String,
      required: [true, 'No. kad pengenalan wajib diisi'],
      trim: true,
    },
    telefon: {
      type: String,
      required: [true, 'No. telefon wajib diisi'],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    kategori: {
      type: String,
      required: [true, 'Sila pilih kategori aduan'],
      enum: {
        values: KATEGORI,
        message: 'Kategori "{VALUE}" tidak sah',
      },
    },
    premis: {
      type: String,
      required: [true, 'Nama premis/perniagaan wajib diisi'],
      trim: true,
    },
    lokasi: {
      type: String,
      required: [true, 'Lokasi premis wajib diisi'],
      trim: true,
    },
    butiran: {
      type: String,
      required: [true, 'Butiran aduan wajib diisi'],
      trim: true,
    },
    status: {
      type: String,
      enum: STATUS,
      default: 'Baru',
    },
  },
  {
    // Tambah medan createdAt & updatedAt secara automatik.
    timestamps: true,
  }
);

/**
 * Hook 'pre save': jana noAduan automatik sebelum dokumen baru disimpan.
 * Format: ADN-<tahun>-<nombor berturut 4 digit>, contoh ADN-2026-0007.
 */
aduanSchema.pre('save', async function (next) {
  // Hanya jana untuk dokumen baru yang belum ada noAduan.
  if (this.noAduan) return next();

  const tahun = new Date().getFullYear();
  // Kira berapa banyak aduan sedia ada untuk tahun ini.
  const bilangan = await mongoose.model('Aduan').countDocuments();
  const turutan = String(bilangan + 1).padStart(4, '0');
  this.noAduan = `ADN-${tahun}-${turutan}`;
  next();
});

// Eksport model dan senarai pilihan supaya boleh digunakan di controller & view.
module.exports = mongoose.model('Aduan', aduanSchema);
module.exports.KATEGORI = KATEGORI;
module.exports.STATUS = STATUS;
```

**Penerangan medan:**

| Medan | Jenis | Keterangan |
|-------|-------|------------|
| `noAduan` | `String` (unik) | Nombor rujukan, dijana automatik (cth: `ADN-2026-0001`) |
| `namaPengadu` | `String` | Nama pengadu (wajib) |
| `noIc` | `String` | No. kad pengenalan (wajib) |
| `telefon` | `String` | No. telefon (wajib) |
| `email` | `String` | E-mel (pilihan) |
| `kategori` | `String` (enum) | Mesti salah satu daripada senarai `KATEGORI` |
| `premis` | `String` | Nama premis/perniagaan (wajib) |
| `lokasi` | `String` | Alamat premis (wajib) |
| `butiran` | `String` | Penerangan aduan (wajib) |
| `status` | `String` (enum) | Lalai `Baru` |
| `createdAt`, `updatedAt` | `Date` | Dijana automatik (`timestamps: true`) |

**Konsep penting:**
- **`required: [true, 'mesej']`** — medan wajib diisi; jika kosong, Mongoose pulangkan mesej ralat tersuai (dalam Bahasa Melayu).
- **`enum`** — hadkan nilai kepada senarai tertentu sahaja. Berguna untuk kategori & status.
- **`trim: true`** — buang ruang kosong di hujung input.
- **`timestamps: true`** — Mongoose tambah `createdAt` & `updatedAt` automatik.
- **`pre('save')` hook** — fungsi yang berjalan **sebelum** dokumen disimpan. Di sini kita guna untuk menjana `noAduan` automatik.
- Kita **eksport** model, dan juga lampirkan `KATEGORI` & `STATUS` padanya supaya boleh diguna di tempat lain (`Aduan.KATEGORI`).

> **Nota:** `padStart(4, '0')` menjadikan nombor `7` kepada `'0007'` — supaya nombor rujukan sentiasa 4 digit.

---

## Langkah 2: Cipta Pengawal (Controller)

Pengawal mengandungi logik untuk setiap operasi. Hari ini kita tulis 4 fungsi: `index` (senarai), `create` (borang), `store` (simpan), dan `show` (butiran).

Cipta folder `controllers/` dan fail `controllers/aduanController.js`:

```js
// controllers/aduanController.js (Hari 2)
// Pada hari ini kita bina operasi Cipta (Create) dan Baca (Read).
// Kemaskini (Update) dan Padam (Delete) akan ditambah pada Hari 3.

const Aduan = require('../models/Aduan');

/**
 * Papar senarai semua aduan, dengan sokongan carian.
 */
exports.index = async (req, res) => {
  const { carian } = req.query;
  const pertanyaan = {};

  if (carian) {
    pertanyaan.$or = [
      { namaPengadu: { $regex: carian, $options: 'i' } },
      { noAduan: { $regex: carian, $options: 'i' } },
      { premis: { $regex: carian, $options: 'i' } },
    ];
  }

  const senaraiAduan = await Aduan.find(pertanyaan).sort({ createdAt: -1 });

  res.render('aduan/index', {
    title: 'Senarai Aduan',
    senaraiAduan,
    carian: carian || '',
  });
};

/**
 * Papar borang daftar aduan baru.
 */
exports.create = (req, res) => {
  res.render('aduan/create', {
    title: 'Daftar Aduan Baru',
    KATEGORI: Aduan.KATEGORI,
    nilai: {},
    ralat: null,
  });
};

/**
 * Simpan aduan baru ke pangkalan data.
 */
exports.store = async (req, res) => {
  try {
    const aduan = await Aduan.create(req.body);
    // Selepas berjaya simpan, terus ke halaman butiran aduan baru.
    res.redirect(`/aduan/${aduan.id}`);
  } catch (error) {
    // Jika validasi gagal, papar semula borang dengan mesej ralat & nilai asal.
    const ralat = error.errors
      ? Object.values(error.errors).map((e) => e.message)
      : [error.message];

    res.status(400).render('aduan/create', {
      title: 'Daftar Aduan Baru',
      KATEGORI: Aduan.KATEGORI,
      nilai: req.body,
      ralat,
    });
  }
};

/**
 * Papar butiran penuh satu aduan.
 */
exports.show = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);

  if (!aduan) {
    return res.status(404).render('404', { title: 'Aduan Tidak Dijumpai' });
  }

  res.render('aduan/show', { title: aduan.noAduan, aduan });
};
```

**Konsep penting:**
- **`async (req, res) => {...}`** — setiap pengawal ialah fungsi `async` kerana ia menunggu (`await`) operasi pangkalan data.
- **`req.query`** — data dari URL selepas `?` (contoh: `/aduan?carian=Ahmad`). Di sini kita ambil `carian`.
- **`Aduan.find(pertanyaan)`** — cari dokumen. Tanpa hujah, ia pulangkan semua.
- **`$or` + `$regex`** — cari jika **mana-mana** medan padan dengan katakunci. `$options: 'i'` = abai huruf besar/kecil.
- **`.sort({ createdAt: -1 })`** — susun dari terbaru ke terlama.
- **`Aduan.create(req.body)`** — cipta & simpan dokumen baru dari data borang.
- **`res.redirect(...)`** — alih pengguna ke URL lain (corak PRG: Post → Redirect → Get).
- **`req.params.id`** — bahagian dinamik URL (contoh: `/aduan/123` → `id = 123`).
- **Pengendalian ralat validasi** — jika `create` gagal, kita ambil mesej dari `error.errors` dan papar semula borang dengan nilai asal supaya pengguna tidak perlu taip semula.

> **Nota:** Kita guna `exports.namaFungsi = ...` supaya semua fungsi boleh diimport bersama di fail laluan nanti.

---

## Langkah 3: Cipta Laluan (Routes)

Daripada meletakkan semua laluan dalam `server.js`, kita asingkan ke fail khas supaya lebih kemas.

Cipta folder `routes/` dan fail `routes/web.js`:

```js
// routes/web.js (Hari 2)
// Laluan untuk paparan HTML.

const express = require('express');
const router = express.Router();
const aduan = require('../controllers/aduanController');

// Halaman utama
router.get('/', (req, res) => {
  res.render('index', { title: 'Utama' });
});

// CRUD Aduan — Hari 2 (Cipta & Baca sahaja)
router.get('/aduan', aduan.index); //         Senarai semua aduan
router.get('/aduan/create', aduan.create); //  Borang daftar (mesti sebelum /aduan/:id)
router.post('/aduan', aduan.store); //         Simpan aduan baru
router.get('/aduan/:id', aduan.show); //       Papar satu aduan

module.exports = router;
```

> **Konsep penting — Susunan laluan amat penting!**
> `/aduan/create` mesti diletak **sebelum** `/aduan/:id`. Jika tidak, Express akan menganggap perkataan `create` sebagai nilai `:id`, dan borang daftar tidak akan muncul. Express memadankan laluan dari atas ke bawah.

### Kemaskini `server.js`

Kita perlu (1) membenarkan Express membaca data borang, dan (2) mendaftarkan laluan dari `routes/web.js`. Kemaskini `server.js` anda supaya menjadi:

```js
// server.js
// Titik masuk utama aplikasi (Hari 2).
// Tambahan berbanding Hari 1: pembaca data borang + laluan CRUD dalam routes/web.js.

require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');
const webRoutes = require('./routes/web');

const app = express();
const PORT = process.env.PORT || 3000;

// Sambung ke pangkalan data MongoDB.
connectDB();

// Enjin paparan EJS + layout.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware.
app.use(express.urlencoded({ extended: true })); // baca data borang (req.body)
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Daftarkan laluan.
app.use('/', webRoutes);

// Halaman 404.
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Dijumpai' });
});

app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
```

**Konsep penting:**
- **`express.urlencoded({ extended: true })`** — middleware yang membaca data borang HTML dan meletakkannya dalam `req.body`. Tanpa ini, `req.body` akan `undefined`.
- **`app.use('/', webRoutes)`** — pasangkan semua laluan dari `routes/web.js`.

---

## Langkah 4: Paparan Senarai & Carian

Sekarang kita bina paparan. Mula dengan satu **partial** kecil untuk lencana status, kerana ia digunakan di beberapa tempat.

Cipta `views/partials/status.ejs`:

```ejs
<%
  // Tentukan warna lencana berdasarkan status aduan.
  const warna = {
    'Baru': 'bg-slate-100 text-slate-700',
    'Dalam Siasatan': 'bg-amber-100 text-amber-800',
    'Selesai': 'bg-green-100 text-green-800',
    'Ditolak': 'bg-red-100 text-red-800',
  }[status] || 'bg-slate-100 text-slate-700';
%>
<span class="inline-block rounded-full px-2.5 py-0.5 text-xs font-medium <%= warna %>"><%= status %></span>
```

> **Nota:** Partial ini menerima pemboleh ubah `status` yang kita hantar semasa `include`. Ia memilih warna berdasarkan nilai status.

Seterusnya cipta folder `views/aduan/` dan fail `views/aduan/index.ejs`:

```ejs
<div class="flex items-center justify-between mb-6">
  <div>
    <h1 class="text-2xl font-bold text-slate-800">Senarai Aduan</h1>
    <p class="text-slate-500"><%= senaraiAduan.length %> aduan dijumpai.</p>
  </div>
  <a href="/aduan/create" class="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600">+ Daftar Aduan</a>
</div>

<!-- Borang carian -->
<form method="GET" action="/aduan" class="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
  <div class="flex-1 min-w-[200px]">
    <label class="block text-sm text-slate-600 mb-1">Carian</label>
    <input type="text" name="carian" value="<%= carian %>" placeholder="Nama, no. aduan, atau premis"
      class="w-full border border-slate-300 rounded px-3 py-2" />
  </div>
  <button type="submit" class="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600">Cari</button>
  <a href="/aduan" class="text-slate-500 px-3 py-2 hover:underline">Set semula</a>
</form>

<!-- Jadual aduan -->
<div class="bg-white rounded-lg shadow overflow-x-auto">
  <% if (senaraiAduan.length === 0) { %>
    <p class="px-4 py-8 text-center text-slate-500">Tiada aduan dijumpai.</p>
  <% } else { %>
    <table class="w-full text-sm">
      <thead class="bg-slate-50 text-slate-500 text-left">
        <tr>
          <th class="px-4 py-3">No. Aduan</th>
          <th class="px-4 py-3">Pengadu</th>
          <th class="px-4 py-3">Kategori</th>
          <th class="px-4 py-3">Premis</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3 text-right">Tindakan</th>
        </tr>
      </thead>
      <tbody>
        <% senaraiAduan.forEach(function (a) { %>
          <tr class="border-t hover:bg-slate-50">
            <td class="px-4 py-3 font-mono"><%= a.noAduan %></td>
            <td class="px-4 py-3"><%= a.namaPengadu %></td>
            <td class="px-4 py-3"><%= a.kategori %></td>
            <td class="px-4 py-3"><%= a.premis %></td>
            <td class="px-4 py-3"><%- include('../partials/status', { status: a.status }) %></td>
            <td class="px-4 py-3 text-right">
              <a href="/aduan/<%= a.id %>" class="text-blue-700 hover:underline">Lihat</a>
            </td>
          </tr>
        <% }) %>
      </tbody>
    </table>
  <% } %>
</div>
```

**Konsep penting:**
- **`<% if (...) { %> ... <% } %>`** — logik bersyarat dalam EJS. Di sini: papar mesej jika tiada aduan, atau jadual jika ada.
- **`<% senaraiAduan.forEach(...) %>`** — gelung untuk papar setiap baris aduan.
- **`<%= a.noAduan %>`** — papar nilai (selamat dari serangan XSS kerana di-escape).
- **`<%- include('../partials/status', { status: a.status }) %>`** — selitkan partial status dan hantar nilai `status`.
- Borang carian guna **`method="GET"`** supaya katakunci muncul di URL (`/aduan?carian=...`) — senang dikongsi & ditanda buku.

### Kemaskini Navbar & Halaman Utama

Kemaskini `views/partials/navbar.ejs` untuk tambah pautan ke senarai & daftar aduan:

```ejs
<nav class="bg-blue-800 text-white shadow">
  <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold text-lg">
      <span class="bg-white text-blue-800 rounded px-2 py-0.5">KPDN</span>
      <span>Sistem Aduan Pengguna</span>
    </a>
    <div class="flex items-center gap-1 text-sm">
      <a href="/" class="px-3 py-2 rounded hover:bg-blue-700 <%= currentPath === '/' ? 'bg-blue-700' : '' %>">Utama</a>
      <a href="/aduan" class="px-3 py-2 rounded hover:bg-blue-700 <%= currentPath.startsWith('/aduan') && currentPath !== '/aduan/create' ? 'bg-blue-700' : '' %>">Senarai Aduan</a>
      <a href="/aduan/create" class="px-3 py-2 rounded bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300">+ Daftar Aduan</a>
    </div>
  </div>
</nav>
```

Kemaskini halaman utama `views/index.ejs` menjadi papan pilihan ringkas:

```ejs
<div class="bg-white rounded-lg shadow p-8 text-center mb-6">
  <h1 class="text-3xl font-bold text-slate-800">Sistem Aduan Pengguna KPDN</h1>
  <p class="text-slate-500 mt-2 max-w-xl mx-auto">
    Daftar dan semak aduan pengguna berkaitan harga, barang kawalan, penyukatan,
    dan penipuan pengguna.
  </p>
</div>

<div class="grid sm:grid-cols-2 gap-4">
  <a href="/aduan" class="block bg-white rounded-lg shadow p-6 hover:shadow-md transition">
    <div class="text-3xl">📋</div>
    <h2 class="font-semibold text-lg mt-2">Senarai Aduan</h2>
    <p class="text-sm text-slate-500">Lihat semua aduan yang telah didaftarkan.</p>
  </a>
  <a href="/aduan/create" class="block bg-white rounded-lg shadow p-6 hover:shadow-md transition">
    <div class="text-3xl">📝</div>
    <h2 class="font-semibold text-lg mt-2">Daftar Aduan</h2>
    <p class="text-sm text-slate-500">Hantar aduan pengguna baru.</p>
  </a>
</div>
```

---

## Langkah 5: Borang Daftar Aduan

Cipta `views/aduan/create.ejs`:

```ejs
<div class="mb-6">
  <h1 class="text-2xl font-bold text-slate-800">Daftar Aduan Baru</h1>
  <p class="text-slate-500">Isi maklumat aduan pengguna di bawah.</p>
</div>

<!-- Papar ralat validasi jika ada -->
<% if (ralat) { %>
  <div class="mb-4 rounded border border-red-300 bg-red-50 text-red-800 px-4 py-3">
    <p class="font-semibold mb-1">Sila betulkan ralat berikut:</p>
    <ul class="list-disc list-inside text-sm">
      <% ralat.forEach(function (r) { %><li><%= r %></li><% }) %>
    </ul>
  </div>
<% } %>

<form method="POST" action="/aduan" class="bg-white rounded-lg shadow p-6 space-y-4">

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium mb-1">Nama Pengadu <span class="text-red-500">*</span></label>
      <input type="text" name="namaPengadu" value="<%= nilai.namaPengadu || '' %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">No. Kad Pengenalan <span class="text-red-500">*</span></label>
      <input type="text" name="noIc" value="<%= nilai.noIc || '' %>" placeholder="cth: 900101145678"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">No. Telefon <span class="text-red-500">*</span></label>
      <input type="text" name="telefon" value="<%= nilai.telefon || '' %>" placeholder="cth: 0123456789"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">E-mel</label>
      <input type="email" name="email" value="<%= nilai.email || '' %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium mb-1">Kategori Aduan <span class="text-red-500">*</span></label>
      <select name="kategori" class="w-full border border-slate-300 rounded px-3 py-2">
        <option value="">— Pilih kategori —</option>
        <% KATEGORI.forEach(function (k) { %>
          <option value="<%= k %>" <%= nilai.kategori === k ? 'selected' : '' %>><%= k %></option>
        <% }) %>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Nama Premis / Perniagaan <span class="text-red-500">*</span></label>
      <input type="text" name="premis" value="<%= nilai.premis || '' %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Lokasi Premis <span class="text-red-500">*</span></label>
    <input type="text" name="lokasi" value="<%= nilai.lokasi || '' %>" placeholder="Alamat penuh premis"
      class="w-full border border-slate-300 rounded px-3 py-2" />
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Butiran Aduan <span class="text-red-500">*</span></label>
    <textarea name="butiran" rows="4" class="w-full border border-slate-300 rounded px-3 py-2"><%= nilai.butiran || '' %></textarea>
  </div>

  <div class="flex gap-2 pt-2">
    <button type="submit" class="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-600">Hantar Aduan</button>
    <a href="/aduan" class="px-5 py-2 rounded border border-slate-300 hover:bg-slate-50">Batal</a>
  </div>
</form>
```

**Konsep penting:**
- **`method="POST" action="/aduan"`** — bila dihantar, borang ini menghantar data ke laluan `POST /aduan` (fungsi `store`).
- **Atribut `name`** pada setiap input (cth: `name="namaPengadu"`) — inilah kunci yang muncul dalam `req.body`. Mesti sama dengan nama medan dalam model.
- **`value="<%= nilai.namaPengadu || '' %>"`** — isi semula nilai jika borang dipapar semula selepas ralat. Jika kosong, guna `''`.
- **Gelung `KATEGORI.forEach`** — bina pilihan dropdown secara automatik dari senarai dalam model. `selected` ditetapkan jika nilai padan.
- **Blok `<% if (ralat) %>`** — papar senarai mesej ralat di atas borang.

---

## Langkah 6: Papar Butiran Aduan

Cipta `views/aduan/show.ejs`:

```ejs
<div class="flex items-center justify-between mb-6">
  <div>
    <h1 class="text-2xl font-bold text-slate-800 font-mono"><%= aduan.noAduan %></h1>
    <p class="text-slate-500">Didaftarkan pada <%= aduan.createdAt.toLocaleString('ms-MY') %></p>
  </div>
  <%- include('../partials/status', { status: aduan.status }) %>
</div>

<div class="bg-white rounded-lg shadow p-6 space-y-4">
  <dl class="grid md:grid-cols-2 gap-x-8 gap-y-4">
    <div>
      <dt class="text-sm text-slate-500">Nama Pengadu</dt>
      <dd class="font-medium"><%= aduan.namaPengadu %></dd>
    </div>
    <div>
      <dt class="text-sm text-slate-500">No. Kad Pengenalan</dt>
      <dd class="font-medium"><%= aduan.noIc %></dd>
    </div>
    <div>
      <dt class="text-sm text-slate-500">No. Telefon</dt>
      <dd class="font-medium"><%= aduan.telefon %></dd>
    </div>
    <div>
      <dt class="text-sm text-slate-500">E-mel</dt>
      <dd class="font-medium"><%= aduan.email || '—' %></dd>
    </div>
    <div>
      <dt class="text-sm text-slate-500">Kategori</dt>
      <dd class="font-medium"><%= aduan.kategori %></dd>
    </div>
    <div>
      <dt class="text-sm text-slate-500">Premis / Perniagaan</dt>
      <dd class="font-medium"><%= aduan.premis %></dd>
    </div>
    <div class="md:col-span-2">
      <dt class="text-sm text-slate-500">Lokasi</dt>
      <dd class="font-medium"><%= aduan.lokasi %></dd>
    </div>
    <div class="md:col-span-2">
      <dt class="text-sm text-slate-500">Butiran Aduan</dt>
      <dd class="font-medium whitespace-pre-line"><%= aduan.butiran %></dd>
    </div>
  </dl>

  <div class="pt-4 border-t">
    <a href="/aduan" class="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50">Kembali ke senarai</a>
  </div>
</div>
```

> **Nota:** `aduan.createdAt.toLocaleString('ms-MY')` memaparkan tarikh dalam format Malaysia. Butang **Edit** dan **Padam** akan ditambah pada Hari 3.

---

## Langkah 7: Data Contoh (Seeder)

Daripada menaip aduan satu demi satu untuk menguji, kita tulis skrip **seeder** untuk mengisi data contoh secara automatik.

Cipta fail `seed.js` di root projek:

```js
// seed.js
// Skrip untuk mengisi pangkalan data dengan data contoh.
// Jalankan dengan: npm run seed

require('dotenv').config();
const mongoose = require('mongoose');
const Aduan = require('./models/Aduan');

const dataContoh = [
  {
    namaPengadu: 'Ahmad bin Ismail',
    noIc: '880102145566',
    telefon: '0123456789',
    email: 'ahmad@contoh.com',
    kategori: 'Harga Tidak Berpatutan',
    premis: 'Kedai Runcit Maju Jaya',
    lokasi: 'No 12, Jalan Besar, 05000 Alor Setar, Kedah',
    butiran: 'Harga minyak masak dijual jauh lebih tinggi daripada harga siling yang ditetapkan.',
    status: 'Baru',
  },
  {
    namaPengadu: 'Siti Nurhaliza binti Aziz',
    noIc: '900505106677',
    telefon: '0198887766',
    email: 'siti@contoh.com',
    kategori: 'Penyukatan & Penimbangan',
    premis: 'Pasar Borong Selatan',
    lokasi: 'Lot 8, Pasar Borong, 43300 Seri Kembangan, Selangor',
    butiran: 'Berat ikan yang dibeli tidak sama dengan paparan penimbang. Disyaki timbang tidak tepat.',
    status: 'Dalam Siasatan',
  },
  {
    namaPengadu: 'Tan Chee Keong',
    noIc: '850808085544',
    telefon: '0167778899',
    kategori: 'Barang Kawalan',
    premis: 'Stesen Minyak Petro Laju',
    lokasi: 'KM 5, Lebuhraya Utama, 81100 Johor Bahru, Johor',
    butiran: 'Premis enggan menjual gas memasak bersubsidi kepada pengguna individu.',
    status: 'Selesai',
  },
  {
    namaPengadu: 'Rajesh a/l Kumar',
    noIc: '920303074433',
    telefon: '0134445566',
    email: 'rajesh@contoh.com',
    kategori: 'Penipuan Pengguna',
    premis: 'Kedai Elektrik Cahaya',
    lokasi: 'No 3, Taman Sentosa, 10400 Pulau Pinang',
    butiran: 'Barangan elektrik yang dibeli adalah tiruan walaupun dilabel sebagai jenama asli.',
    status: 'Baru',
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Bersambung ke MongoDB...');

    // Kosongkan data lama supaya tidak berganda setiap kali seed.
    await Aduan.deleteMany({});
    console.log('Data lama dipadam.');

    // Gunakan gelung supaya hook 'pre save' (penjana noAduan) berjalan untuk setiap dokumen.
    for (const data of dataContoh) {
      await Aduan.create(data);
    }

    console.log(`✅ ${dataContoh.length} aduan contoh berjaya dimasukkan.`);
  } catch (error) {
    console.error('❌ Ralat semasa seed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
}

seed();
```

Tambah skrip `seed` dalam `package.json` (bahagian `scripts`):

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "seed": "node seed.js"
}
```

Jalankan seeder:

```bash
npm run seed
```

**Konsep penting:**
- **`Aduan.deleteMany({})`** — padam semua aduan dahulu, supaya data tidak berganda setiap kali kita jalankan seeder.
- Kita guna **gelung `for...of` dengan `Aduan.create()`** (bukan `insertMany`) supaya hook `pre('save')` berjalan untuk setiap dokumen dan menjana `noAduan`.
- **`mongoose.connection.close()`** dalam `finally` — tutup sambungan supaya skrip tamat dengan kemas.

> **Nota:** Seeder adalah skrip **berasingan** dari pelayan. Ia bersambung sendiri, melakukan tugas, kemudian keluar (`process.exit()`).

---

## Cara Menjalankan Aplikasi

```bash
# 1) Pastikan pakej dipasang
npm install

# 2) Isi data contoh ke pangkalan data
npm run seed

# 3) Jalankan pelayan (mod pembangunan)
npm run dev
```

Layari [http://localhost:3000/aduan](http://localhost:3000/aduan) — anda sepatutnya nampak 4 aduan contoh. Cuba:
- **Carian** — taip "Ahmad" atau "ADN-2026" dan klik **Cari**.
- **Daftar aduan** — klik **+ Daftar Aduan**, isi borang, dan hantar. Anda akan dialihkan ke halaman butiran aduan baharu.
- **Uji validasi** — cuba hantar borang kosong. Mesej ralat sepatutnya muncul dan input anda dikekalkan.

> **Nota penyelesaian masalah:**
> - **Borang dihantar tetapi `req.body` kosong** → pastikan `app.use(express.urlencoded({ extended: true }))` ada dalam `server.js`.
> - **Borang daftar tidak muncul / ralat "Cast to ObjectId"** → semak susunan laluan: `/aduan/create` mesti **sebelum** `/aduan/:id`.
> - **Data tidak muncul** → pastikan `npm run seed` berjaya dan `MONGODB_URI` betul.

---

## Ringkasan Hari 2

- [ ] Memahami corak **MVC** dan struktur folder
- [ ] Mencipta **model Mongoose** `Aduan` dengan validasi & enum
- [ ] Memahami hook `pre('save')` untuk jana `noAduan` automatik
- [ ] Menulis **pengawal** dengan fungsi `index`, `create`, `store`, `show`
- [ ] Mengasingkan **laluan** ke `routes/web.js` dan memahami susunan laluan
- [ ] Membina paparan **senarai + carian** dan **borang daftar**
- [ ] Mengendalikan **validasi** dan memapar mesej ralat
- [ ] Mengisi data contoh dengan **seeder**

---

## Apa Seterusnya?

Pada **[Hari 3](../hari-3/)** — sejajar dengan **Bahagian 4 buku (Bab 11–15)** — kita akan melengkapkan sistem sebagai aplikasi web yang kukuh:
- **Bina projek dari kosong** & **kegigihan data MongoDB** *(Bab 11–12)* — melengkapkan CRUD penuh (Kemaskini & Padam)
- **method-override** supaya borang HTML boleh menghantar `PUT` & `DELETE`
- **Mesej flash** (notifikasi kejayaan/ralat) menggunakan `express-session` & `connect-flash`
- **Papan pemuka** dengan statistik aduan mengikut status
- **REST API** (titik akhir JSON) untuk integrasi sistem lain
- **Pengenalan** pengesahan (Passport.js/JWT), pengendalian ralat & keselamatan *(Bab 13–15)*
- **Deploy** aplikasi ke hosting awan supaya boleh diakses di internet

Jumpa lagi di Hari 3! 🚀
