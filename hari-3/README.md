# Hari 3 — Panduan Bengkel: CRUD Lengkap, REST API & Deploy

Panduan langkah demi langkah untuk **melengkapkan** Sistem Aduan Pengguna KPDN. Pada akhir bengkel ini (~6 jam), aplikasi anda akan mempunyai operasi CRUD penuh, mesej maklum balas (flash), papan pemuka statistik, REST API JSON, dan akhirnya **disiarkan ke internet** (deploy) supaya boleh diakses sesiapa sahaja.

**Imbas kembali Hari 2:**
Pada Hari 2, kita telah:
- Mencipta model Mongoose `Aduan` dengan validasi
- Membina struktur **MVC** (Model–View–Controller)
- Menyiapkan operasi **Cipta (Create)** dan **Baca (Read)** — borang daftar, senarai, carian, dan paparan butiran
- Mengisi data contoh dengan seeder

Namun aplikasi kita masih **belum lengkap**: kita belum boleh **kemaskini** atau **padam** aduan, tiada maklum balas selepas tindakan, dan tiada API. Hari ini kita selesaikan semuanya.

**Apa yang akan dibina:**
- Mesej **flash** (maklum balas "berjaya/gagal" selepas tindakan)
- Operasi **Kemaskini (Update)** dengan `method-override`
- Operasi **Padam (Delete)** dengan pengesahan
- **Tapisan status** pada senarai aduan
- **Papan pemuka** dengan statistik aduan
- **REST API** (titik akhir JSON penuh: senarai, papar, cipta, kemaskini, padam)
- **Deploy** ke hosting awan (Render) + MongoDB Atlas

Selepas itu, kita **memperkenalkan** tiga topik penting dalam **Bahagian 4** buku yang melengkapkan sebuah aplikasi web yang kukuh: **pengesahan & kebenaran** (Bab 13), **pengendalian ralat** (Bab 14), dan **keselamatan aplikasi** (Bab 15).

---

## Rujukan Buku

Hari 3 sejajar dengan **Bahagian 4** buku **_Node.js for Beginners_** (Ulises Gascón, Packt 2024) — *Building Solid Web Applications with Node.js*.

| Bab | Tajuk Bab | Bahagian Hari Ini | Liputan |
|-----|-----------|-------------------|---------|
| **11** | Building a Web Application Project from Scratch | Keseluruhan projek KPDN (Hari 1–3) | Penuh |
| **12** | Data Persistence with MongoDB | Model Mongoose + CRUD + REST API | Penuh |
| **13** | User Authentication & Authorization (Passport.js) | [Pengesahan & Kebenaran](#pengesahan--kebenaran-bab-13) | Pengenalan |
| **14** | Error Handling in Node.js | [Pengendalian Ralat](#pengendalian-ralat-bab-14) | Pengenalan |
| **15** | Securing Web Applications | [Keselamatan Aplikasi](#keselamatan-aplikasi-bab-15) | Pengenalan |

> **Pemetaan (Bab 11–12):** Projek **Sistem Aduan Pengguna KPDN** yang anda bina sepanjang kursus ini ialah contoh praktikal *"Building a Web Application Project from Scratch"* (Bab 11), dan penggunaan **MongoDB + Mongoose** untuk menyimpan aduan ialah *"Data Persistence with MongoDB"* (Bab 12). Bab 13–15 diperkenalkan secara ringkas di akhir hari ini — rujuk buku untuk pelaksanaan penuh.

---

## Persediaan

Pastikan projek Hari 2 anda berjalan dengan baik. Jika anda bermula dari folder `hari-3/`, jalankan dahulu:

```bash
cd hari-3
npm install
cp .env.example .env
```

Kemudian buka fail `.env` dan isi `MONGODB_URI` anda (sama seperti Hari 1 & 2). Fail `.env.example` Hari 3 mempunyai satu baris tambahan — `SESSION_SECRET`:

```
# Port pelayan aplikasi
PORT=3000

# Sambungan MongoDB Atlas
# Ganti <username>, <password>, dan nama cluster dengan maklumat anda sendiri.
# Dapatkan connection string dari MongoDB Atlas > Database > Connect > Drivers.
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aduan_kpdn?retryWrites=true&w=majority

# Rahsia untuk express-session (boleh tukar kepada string rawak anda sendiri)
SESSION_SECRET=rahsia-kpdn-tukar-saya
```

Jalankan pelayan dan pastikan ia berfungsi:

```bash
npm run dev
```

> **Nota:** Jika anda meneruskan dari projek Hari 2 sendiri (bukan folder `hari-3/`), tidak mengapa — setiap langkah di bawah akan memberitahu fail yang perlu ditambah atau dikemaskini.

---

## Langkah 1: Mesej Flash (Maklum Balas Pengguna)

Apabila pengguna mendaftar, mengemaskini, atau memadam aduan, mereka patut nampak mesej maklum balas seperti *"Aduan berjaya didaftarkan"*. Mesej jenis ini dipanggil **flash message** — mesej yang dipaparkan **sekali sahaja** selepas pengalihan halaman (redirect), kemudian hilang.

Untuk ini kita perlukan dua pakej:
- **`express-session`** — menyimpan data sementara untuk setiap pelawat (dalam sesi)
- **`connect-flash`** — menggunakan sesi tersebut untuk menyimpan mesej flash

### Pasang pakej

```bash
npm install express-session connect-flash
```

### Kemaskini `server.js`

Buka `server.js` dan tambah pakej baru di bahagian atas, serta sediakan middleware sesi & flash. Berikut ialah `server.js` lengkap untuk Hari 3 (kita akan tambah `method-override`, `express.json()`, dan laluan API dalam langkah-langkah seterusnya — kod penuh ditunjukkan di sini supaya anda nampak gambaran keseluruhan):

```js
// server.js
// Titik masuk utama aplikasi Sistem Aduan Pengguna KPDN.

// 1) Muatkan pemboleh ubah persekitaran dari fail .env (mesti paling atas).
require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');

const connectDB = require('./config/db');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// 2) Sambung ke pangkalan data MongoDB.
connectDB();

// 3) Tetapkan enjin paparan EJS + susun atur (layout).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // views/layout.ejs sebagai rangka utama

// 4) Middleware terbina dalam.
app.use(express.urlencoded({ extended: true })); // baca data borang (req.body)
app.use(express.json()); // baca JSON (untuk REST API)
app.use(express.static(path.join(__dirname, 'public'))); // fail statik (css, imej)
app.use(methodOverride('_method')); // benarkan borang hantar PUT/DELETE

// 5) Sesi & flash message (mesej sekali papar selepas redirect).
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'rahsia-kpdn',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Jadikan mesej flash & laluan semasa tersedia di semua paparan EJS.
app.use((req, res, next) => {
  res.locals.jaya = req.flash('jaya');
  res.locals.gagal = req.flash('gagal');
  res.locals.currentPath = req.path;
  next();
});

// 6) Daftarkan laluan.
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// 7) Halaman 404 (tiada laluan padan).
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Dijumpai', layout: 'layout' });
});

// 8) Mulakan pelayan.
app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
```

**Konsep penting:**

- **`session({ secret, resave, saveUninitialized })`** — mewujudkan satu sesi untuk setiap pelawat. `secret` digunakan untuk "menandatangani" kuki sesi supaya tidak boleh dipalsukan.
- **`flash()`** — membenarkan kita panggil `req.flash('kunci', 'mesej')` untuk simpan mesej, dan `req.flash('kunci')` untuk ambil semula (selepas itu mesej dipadam automatik).
- **`res.locals`** — apa-apa yang diletakkan di sini akan tersedia secara automatik dalam **semua** paparan EJS, tanpa perlu hantar satu per satu. Kita gunakan ini untuk `jaya` (mesej berjaya) dan `gagal` (mesej ralat).
- **Middleware adalah berturutan** — Express menjalankan middleware mengikut susunan ia ditulis. Sebab itu sesi mesti didaftar **sebelum** middleware `res.locals` yang menggunakan `req.flash`.

> **Nota:** `req.flash('jaya')` memulangkan satu **array** mesej (bukan satu string). Sebab itu dalam paparan flash kita semak `jaya.length > 0`.

### Cipta partial `views/partials/flash.ejs`

Cipta fail baru `views/partials/flash.ejs` untuk memaparkan mesej:

```html
<% if (jaya && jaya.length > 0) { %>
  <div class="mb-4 rounded border border-green-300 bg-green-50 text-green-800 px-4 py-3">
    <%= jaya %>
  </div>
<% } %>
<% if (gagal && gagal.length > 0) { %>
  <div class="mb-4 rounded border border-red-300 bg-red-50 text-red-800 px-4 py-3">
    <%= gagal %>
  </div>
<% } %>
```

### Sertakan flash dalam layout

Buka `views/layout.ejs` dan sertakan partial flash di dalam `<main>`, **sebelum** `<%- body %>`:

```html
  <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
    <%- include('partials/flash') %>
    <%- body %>
  </main>
```

Dengan ini, sebarang mesej flash akan muncul di bahagian atas setiap halaman secara automatik.

---

## Langkah 2: Kemaskini Aduan (Update)

Sekarang kita tambah keupayaan untuk **mengemaskini** aduan sedia ada — contohnya menukar status dari *Baru* kepada *Dalam Siasatan*.

### Masalah: borang HTML hanya menyokong GET dan POST

Dalam REST, operasi kemaskini sepatutnya menggunakan kaedah HTTP **PUT**. Tetapi borang HTML (`<form>`) **hanya** menyokong `GET` dan `POST` — tiada `PUT` atau `DELETE`. Penyelesaiannya ialah pakej **`method-override`**: kita hantar borang sebagai `POST`, tetapi tambah `?_method=PUT`, dan pakej ini akan "menukar" permintaan itu kepada `PUT` di pelayan.

### Pasang `method-override`

```bash
npm install method-override
```

Dalam `server.js`, pastikan baris ini ada (sudah disertakan dalam kod penuh di Langkah 1):

```js
const methodOverride = require('method-override');
// ...
app.use(methodOverride('_method')); // benarkan borang hantar PUT/DELETE
```

### Tambah kaedah `edit` dan `update` dalam controller

Buka `controllers/aduanController.js`. Tambah dua kaedah berikut. `edit` memaparkan borang kemaskini, dan `update` menyimpan perubahan:

```js
/**
 * Papar borang kemaskini aduan.
 */
exports.edit = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);

  if (!aduan) {
    req.flash('gagal', 'Aduan tidak dijumpai.');
    return res.redirect('/aduan');
  }

  res.render('aduan/edit', {
    title: `Kemaskini ${aduan.noAduan}`,
    aduan,
    KATEGORI: Aduan.KATEGORI,
    STATUS: Aduan.STATUS,
    ralat: null,
  });
};

/**
 * Kemaskini aduan sedia ada.
 */
exports.update = async (req, res) => {
  try {
    const aduan = await Aduan.findById(req.params.id);
    if (!aduan) {
      req.flash('gagal', 'Aduan tidak dijumpai.');
      return res.redirect('/aduan');
    }

    // Tetapkan nilai baru dan simpan (supaya validasi skema berjalan).
    aduan.set(req.body);
    await aduan.save();

    req.flash('jaya', 'Aduan berjaya dikemaskini.');
    res.redirect(`/aduan/${aduan.id}`);
  } catch (error) {
    const aduan = await Aduan.findById(req.params.id);
    res.status(400).render('aduan/edit', {
      title: `Kemaskini ${aduan.noAduan}`,
      aduan: { ...aduan.toObject(), ...req.body, id: aduan.id },
      KATEGORI: Aduan.KATEGORI,
      STATUS: Aduan.STATUS,
      ralat: ambilRalat(error),
    });
  }
};
```

**Konsep penting:**

- **`aduan.set(req.body)` + `aduan.save()`** — kita muatkan dokumen sedia ada, ganti medannya dengan data borang, kemudian simpan. Pendekatan ini menjalankan semula **validasi skema** (berbeza dengan `findByIdAndUpdate` yang melangkau validasi secara lalai).
- **Pengendalian ralat** — jika validasi gagal, kita papar semula borang `edit` dengan nilai yang dimasukkan pengguna (`...req.body`) dan senarai mesej ralat, supaya pengguna tidak kehilangan input mereka.
- **`{ ...aduan.toObject(), ...req.body, id: aduan.id }`** — gabungan ini memastikan borang menunjukkan nilai baru yang pengguna cuba simpan, sambil mengekalkan `id` untuk URL borang.

> **Nota:** Fungsi pembantu `ambilRalat(error)` sudah wujud di bahagian bawah controller dari Hari 2 (ia menukar objek ralat Mongoose kepada array mesej ringkas). Jika belum ada, tambah di hujung fail:
>
> ```js
> function ambilRalat(error) {
>   if (error.errors) {
>     return Object.values(error.errors).map((e) => e.message);
>   }
>   return [error.message];
> }
> ```

### Cipta paparan `views/aduan/edit.ejs`

Cipta fail baru `views/aduan/edit.ejs`. Perhatikan dua perkara penting: borang `action` mengandungi `?_method=PUT`, dan ada medan **Status** (yang tiada dalam borang daftar):

```html
<div class="mb-6">
  <h1 class="text-2xl font-bold text-slate-800">Kemaskini Aduan</h1>
  <p class="text-slate-500 font-mono"><%= aduan.noAduan %></p>
</div>

<% if (ralat) { %>
  <div class="mb-4 rounded border border-red-300 bg-red-50 text-red-800 px-4 py-3">
    <p class="font-semibold mb-1">Sila betulkan ralat berikut:</p>
    <ul class="list-disc list-inside text-sm">
      <% ralat.forEach(function (r) { %><li><%= r %></li><% }) %>
    </ul>
  </div>
<% } %>

<!-- method-override: borang HTML hanya sokong GET/POST, jadi kita "tukar" POST kepada PUT -->
<form method="POST" action="/aduan/<%= aduan.id %>?_method=PUT" class="bg-white rounded-lg shadow p-6 space-y-4">

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium mb-1">Nama Pengadu <span class="text-red-500">*</span></label>
      <input type="text" name="namaPengadu" value="<%= aduan.namaPengadu %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">No. Kad Pengenalan <span class="text-red-500">*</span></label>
      <input type="text" name="noIc" value="<%= aduan.noIc %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">No. Telefon <span class="text-red-500">*</span></label>
      <input type="text" name="telefon" value="<%= aduan.telefon %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">E-mel</label>
      <input type="email" name="email" value="<%= aduan.email || '' %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium mb-1">Kategori Aduan <span class="text-red-500">*</span></label>
      <select name="kategori" class="w-full border border-slate-300 rounded px-3 py-2">
        <% KATEGORI.forEach(function (k) { %>
          <option value="<%= k %>" <%= aduan.kategori === k ? 'selected' : '' %>><%= k %></option>
        <% }) %>
      </select>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Status <span class="text-red-500">*</span></label>
      <select name="status" class="w-full border border-slate-300 rounded px-3 py-2">
        <% STATUS.forEach(function (s) { %>
          <option value="<%= s %>" <%= aduan.status === s ? 'selected' : '' %>><%= s %></option>
        <% }) %>
      </select>
    </div>
  </div>

  <div class="grid md:grid-cols-2 gap-4">
    <div>
      <label class="block text-sm font-medium mb-1">Nama Premis / Perniagaan <span class="text-red-500">*</span></label>
      <input type="text" name="premis" value="<%= aduan.premis %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Lokasi Premis <span class="text-red-500">*</span></label>
      <input type="text" name="lokasi" value="<%= aduan.lokasi %>"
        class="w-full border border-slate-300 rounded px-3 py-2" />
    </div>
  </div>

  <div>
    <label class="block text-sm font-medium mb-1">Butiran Aduan <span class="text-red-500">*</span></label>
    <textarea name="butiran" rows="4" class="w-full border border-slate-300 rounded px-3 py-2"><%= aduan.butiran %></textarea>
  </div>

  <div class="flex gap-2 pt-2">
    <button type="submit" class="bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-600">Simpan Perubahan</button>
    <a href="/aduan/<%= aduan.id %>" class="px-5 py-2 rounded border border-slate-300 hover:bg-slate-50">Batal</a>
  </div>
</form>
```

### Daftar laluan edit & update

Buka `routes/web.js` dan tambah dua laluan ini (kod penuh `web.js` ditunjukkan di Langkah 3):

```js
router.get('/aduan/:id/edit', aduan.edit); //   Borang kemaskini
router.put('/aduan/:id', aduan.update); //      Kemaskini aduan
```

| Kaedah | Laluan | Controller | Tujuan |
|--------|--------|------------|--------|
| GET | `/aduan/:id/edit` | `aduan.edit` | Papar borang kemaskini |
| PUT | `/aduan/:id` | `aduan.update` | Simpan perubahan |

---

## Langkah 3: Padam Aduan (Delete)

Sama seperti `PUT`, kaedah **`DELETE`** juga tidak disokong borang HTML secara langsung — sekali lagi `method-override` menyelamatkan kita.

### Tambah kaedah `destroy` dalam controller

Dalam `controllers/aduanController.js`, tambah:

```js
/**
 * Padam aduan.
 */
exports.destroy = async (req, res) => {
  await Aduan.findByIdAndDelete(req.params.id);
  req.flash('jaya', 'Aduan berjaya dipadam.');
  res.redirect('/aduan');
};
```

### Tambah laluan delete

Buka `routes/web.js`. Inilah fail penuh untuk Hari 3 (semua tujuh laluan CRUD):

```js
// routes/web.js
// Laluan (routes) untuk paparan HTML aplikasi.

const express = require('express');
const router = express.Router();
const aduan = require('../controllers/aduanController');

// Papan pemuka / halaman utama
router.get('/', aduan.dashboard);

// CRUD Aduan
router.get('/aduan', aduan.index); //          Senarai semua aduan
router.get('/aduan/create', aduan.create); //   Borang daftar (mesti sebelum /aduan/:id)
router.post('/aduan', aduan.store); //          Simpan aduan baru
router.get('/aduan/:id', aduan.show); //        Papar satu aduan
router.get('/aduan/:id/edit', aduan.edit); //   Borang kemaskini
router.put('/aduan/:id', aduan.update); //      Kemaskini aduan
router.delete('/aduan/:id', aduan.destroy); //  Padam aduan

module.exports = router;
```

> **Nota:** Susunan laluan **penting**. `/aduan/create` mesti didaftar **sebelum** `/aduan/:id`, kerana jika tidak, Express akan menganggap perkataan `create` sebagai satu `:id` dan cuba mencari aduan dengan id `create`.

### Tambah butang Edit & Padam pada paparan butiran

Buka `views/aduan/show.ejs` dan tambah bahagian tindakan di hujung kad. Perhatikan borang padam menggunakan `?_method=DELETE` dan `onsubmit="return confirm(...)"` untuk meminta pengesahan:

```html
  <div class="flex gap-2 pt-4 border-t">
    <a href="/aduan/<%= aduan.id %>/edit" class="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-400">Edit</a>

    <!-- Borang padam: guna method-override untuk hantar DELETE -->
    <form method="POST" action="/aduan/<%= aduan.id %>?_method=DELETE"
      onsubmit="return confirm('Padam aduan ini? Tindakan ini tidak boleh diundur.');">
      <button type="submit" class="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500">Padam</button>
    </form>

    <a href="/aduan" class="px-4 py-2 rounded border border-slate-300 hover:bg-slate-50">Kembali</a>
  </div>
```

**Konsep penting:**

- **`confirm('...')`** — fungsi pelayar yang memaparkan kotak dialog "OK / Batal". Jika pengguna tekan "Batal", `confirm` memulangkan `false` dan `return false` menghalang borang daripada dihantar. Ini melindungi daripada padam tidak sengaja.
- **`findByIdAndDelete(id)`** — kaedah Mongoose untuk mencari dokumen mengikut `_id` dan memadamnya dalam satu langkah.

### Tambah pautan Edit pada senarai

Supaya pengguna boleh terus ke borang kemaskini dari senarai, kita juga tambah pautan **Edit** dalam lajur "Tindakan" pada `views/aduan/index.ejs` (kod penuh `index.ejs` ditunjukkan di Langkah 4):

```html
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <a href="/aduan/<%= a.id %>" class="text-blue-700 hover:underline">Lihat</a>
              <a href="/aduan/<%= a.id %>/edit" class="text-amber-700 hover:underline ml-2">Edit</a>
            </td>
```

---

## Langkah 4: Tapisan Status pada Senarai

Pegawai KPDN selalunya mahu melihat hanya aduan yang *Baru* atau yang *Dalam Siasatan*. Mari tambah **tapisan status** di sebelah kotak carian.

### Kemaskini controller `index`

Dalam `controllers/aduanController.js`, kemaskini kaedah `index` supaya ia membaca parameter `status` dan menambahnya ke dalam pertanyaan:

```js
/**
 * Papar senarai semua aduan.
 * Menyokong carian (mengikut nama/no aduan/premis) dan tapisan status.
 */
exports.index = async (req, res) => {
  const { carian, status } = req.query;

  // Bina objek pertanyaan secara berperingkat.
  const pertanyaan = {};

  if (carian) {
    // $or: padankan mana-mana satu medan dengan katakunci (tidak case-sensitive).
    pertanyaan.$or = [
      { namaPengadu: { $regex: carian, $options: 'i' } },
      { noAduan: { $regex: carian, $options: 'i' } },
      { premis: { $regex: carian, $options: 'i' } },
    ];
  }

  if (status) {
    pertanyaan.status = status;
  }

  const senaraiAduan = await Aduan.find(pertanyaan).sort({ createdAt: -1 });

  res.render('aduan/index', {
    title: 'Senarai Aduan',
    senaraiAduan,
    carian: carian || '',
    status: status || '',
    STATUS: Aduan.STATUS,
  });
};
```

**Konsep penting:**

- **Membina pertanyaan secara berperingkat** — kita mula dengan objek kosong `{}`, kemudian tambah syarat hanya jika parameter itu wujud. Jika kedua-dua `carian` dan `status` diberi, MongoDB akan padankan **kedua-duanya** (DAN).
- **`$regex` dengan `$options: 'i'`** — carian separa yang **tidak** mengambil kira huruf besar/kecil (case-insensitive).
- **`Aduan.STATUS`** — kita hantar senarai status (dari model) ke paparan supaya boleh membina pilihan dropdown secara dinamik.

### Kemaskini paparan `views/aduan/index.ejs`

Inilah fail penuh `views/aduan/index.ejs` untuk Hari 3, dengan dropdown tapisan status dan pautan Edit:

```html
<div class="flex items-center justify-between mb-6">
  <div>
    <h1 class="text-2xl font-bold text-slate-800">Senarai Aduan</h1>
    <p class="text-slate-500"><%= senaraiAduan.length %> aduan dijumpai.</p>
  </div>
  <a href="/aduan/create" class="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600">+ Daftar Aduan</a>
</div>

<!-- Borang carian & tapisan -->
<form method="GET" action="/aduan" class="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3 items-end">
  <div class="flex-1 min-w-[200px]">
    <label class="block text-sm text-slate-600 mb-1">Carian</label>
    <input type="text" name="carian" value="<%= carian %>" placeholder="Nama, no. aduan, atau premis"
      class="w-full border border-slate-300 rounded px-3 py-2" />
  </div>
  <div>
    <label class="block text-sm text-slate-600 mb-1">Status</label>
    <select name="status" class="border border-slate-300 rounded px-3 py-2">
      <option value="">Semua status</option>
      <% STATUS.forEach(function (s) { %>
        <option value="<%= s %>" <%= status === s ? 'selected' : '' %>><%= s %></option>
      <% }) %>
    </select>
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
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <a href="/aduan/<%= a.id %>" class="text-blue-700 hover:underline">Lihat</a>
              <a href="/aduan/<%= a.id %>/edit" class="text-amber-700 hover:underline ml-2">Edit</a>
            </td>
          </tr>
        <% }) %>
      </tbody>
    </table>
  <% } %>
</div>
```

> **Nota:** Kedua-dua input carian dan tapisan status berada dalam **satu** borang `GET`. Apabila ditekan "Cari", pelayar menghantar kedua-dua nilai dalam URL, contoh: `/aduan?carian=ahmad&status=Baru`. Inilah cara borang carian biasanya berfungsi.

---

## Langkah 5: Papan Pemuka (Dashboard)

Daripada halaman utama hanya memaparkan teks selamat datang, mari jadikan ia **papan pemuka** yang menunjukkan statistik aduan dan 5 aduan terkini.

### Tambah kaedah `dashboard` dalam controller

Dalam `controllers/aduanController.js`, tambah:

```js
/**
 * Papar papan pemuka (dashboard) dengan statistik ringkas.
 */
exports.dashboard = async (req, res) => {
  const jumlah = await Aduan.countDocuments();
  const baru = await Aduan.countDocuments({ status: 'Baru' });
  const siasatan = await Aduan.countDocuments({ status: 'Dalam Siasatan' });
  const selesai = await Aduan.countDocuments({ status: 'Selesai' });
  const terkini = await Aduan.find().sort({ createdAt: -1 }).limit(5);

  res.render('index', {
    title: 'Papan Pemuka',
    statistik: { jumlah, baru, siasatan, selesai },
    terkini,
  });
};
```

**Konsep penting:**

- **`countDocuments()`** — mengira bilangan dokumen. Tanpa hujah ia mengira **semua**; dengan penapis seperti `{ status: 'Baru' }` ia mengira yang sepadan sahaja.
- **`.sort({ createdAt: -1 }).limit(5)`** — susun dari terbaru ke terlama (`-1` = menurun), kemudian hadkan kepada 5 rekod.

### Arahkan laluan `/` ke dashboard

Dalam `routes/web.js`, laluan utama kini memanggil `aduan.dashboard` (sudah ditunjukkan dalam kod penuh di Langkah 3):

```js
// Papan pemuka / halaman utama
router.get('/', aduan.dashboard);
```

### Cipta paparan `views/index.ejs`

Gantikan kandungan `views/index.ejs` dengan kad statistik dan jadual aduan terkini:

```html
<div class="mb-6">
  <h1 class="text-2xl font-bold text-slate-800">Papan Pemuka</h1>
  <p class="text-slate-500">Ringkasan aduan pengguna yang diterima.</p>
</div>

<!-- Kad statistik -->
<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
  <div class="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
    <div class="text-3xl font-bold"><%= statistik.jumlah %></div>
    <div class="text-sm text-slate-500">Jumlah Aduan</div>
  </div>
  <div class="bg-white rounded-lg shadow p-4 border-l-4 border-slate-400">
    <div class="text-3xl font-bold"><%= statistik.baru %></div>
    <div class="text-sm text-slate-500">Baru</div>
  </div>
  <div class="bg-white rounded-lg shadow p-4 border-l-4 border-amber-500">
    <div class="text-3xl font-bold"><%= statistik.siasatan %></div>
    <div class="text-sm text-slate-500">Dalam Siasatan</div>
  </div>
  <div class="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
    <div class="text-3xl font-bold"><%= statistik.selesai %></div>
    <div class="text-sm text-slate-500">Selesai</div>
  </div>
</div>

<!-- Aduan terkini -->
<div class="bg-white rounded-lg shadow">
  <div class="px-4 py-3 border-b flex items-center justify-between">
    <h2 class="font-semibold">5 Aduan Terkini</h2>
    <a href="/aduan" class="text-sm text-blue-700 hover:underline">Lihat semua &rarr;</a>
  </div>
  <% if (terkini.length === 0) { %>
    <p class="px-4 py-6 text-slate-500">Belum ada aduan. <a href="/aduan/create" class="text-blue-700 hover:underline">Daftar aduan pertama</a>.</p>
  <% } else { %>
    <table class="w-full text-sm">
      <thead class="bg-slate-50 text-slate-500 text-left">
        <tr>
          <th class="px-4 py-2">No. Aduan</th>
          <th class="px-4 py-2">Pengadu</th>
          <th class="px-4 py-2">Kategori</th>
          <th class="px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <% terkini.forEach(function (a) { %>
          <tr class="border-t hover:bg-slate-50">
            <td class="px-4 py-2 font-mono"><a href="/aduan/<%= a.id %>" class="text-blue-700 hover:underline"><%= a.noAduan %></a></td>
            <td class="px-4 py-2"><%= a.namaPengadu %></td>
            <td class="px-4 py-2"><%= a.kategori %></td>
            <td class="px-4 py-2"><%- include('partials/status', { status: a.status }) %></td>
          </tr>
        <% }) %>
      </tbody>
    </table>
  <% } %>
</div>
```

### Kemaskini navbar

Buka `views/partials/navbar.ejs` dan pastikan pautan pertama menunjuk ke "Papan Pemuka":

```html
<nav class="bg-blue-800 text-white shadow">
  <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold text-lg">
      <span class="bg-white text-blue-800 rounded px-2 py-0.5">KPDN</span>
      <span>Sistem Aduan Pengguna</span>
    </a>
    <div class="flex items-center gap-1 text-sm">
      <a href="/" class="px-3 py-2 rounded hover:bg-blue-700 <%= currentPath === '/' ? 'bg-blue-700' : '' %>">Papan Pemuka</a>
      <a href="/aduan" class="px-3 py-2 rounded hover:bg-blue-700 <%= currentPath.startsWith('/aduan') && currentPath !== '/aduan/create' ? 'bg-blue-700' : '' %>">Senarai Aduan</a>
      <a href="/aduan/create" class="px-3 py-2 rounded bg-amber-400 text-slate-900 font-semibold hover:bg-amber-300">+ Daftar Aduan</a>
    </div>
  </div>
</nav>
```

Sekarang buka [http://localhost:3000](http://localhost:3000) dan anda sepatutnya nampak papan pemuka dengan statistik!

---

## Langkah 6: REST API (Bab 12)

Setakat ini aplikasi kita memulangkan **HTML** untuk dipaparkan dalam pelayar. Tetapi bagaimana jika aplikasi **mobile** atau sistem lain mahu mengakses data aduan? Mereka tidak mahu HTML — mereka mahu data mentah dalam format **JSON**. Inilah tujuan **REST API**.

**Apa itu REST API?**
REST ialah satu gaya seni bina di mana setiap "sumber" (di sini: aduan) diakses melalui URL dan kaedah HTTP yang konsisten:

| Kaedah | Laluan | Tindakan |
|--------|--------|----------|
| GET | `/api/aduan` | Senarai semua aduan |
| GET | `/api/aduan/:id` | Dapatkan satu aduan |
| POST | `/api/aduan` | Cipta aduan baru |
| PUT | `/api/aduan/:id` | Kemaskini aduan |
| DELETE | `/api/aduan/:id` | Padam aduan |

### Cipta `controllers/apiController.js`

Cipta fail baru `controllers/apiController.js`:

```js
// controllers/apiController.js
// Logik untuk REST API (memulangkan JSON, bukan HTML).
// Berguna untuk aplikasi mobile, frontend SPA, atau integrasi sistem lain.

const Aduan = require('../models/Aduan');

/**
 * GET /api/aduan — senarai semua aduan dalam format JSON.
 */
exports.index = async (req, res) => {
  const senarai = await Aduan.find().sort({ createdAt: -1 });
  res.json({
    jumlah: senarai.length,
    data: senarai,
  });
};

/**
 * GET /api/aduan/:id — satu aduan dalam format JSON.
 */
exports.show = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);
  if (!aduan) {
    return res.status(404).json({ mesej: 'Aduan tidak dijumpai' });
  }
  res.json({ data: aduan });
};

/**
 * POST /api/aduan — cipta aduan baru dari badan permintaan JSON.
 */
exports.store = async (req, res) => {
  try {
    const aduan = await Aduan.create(req.body);
    res.status(201).json({ mesej: 'Aduan dicipta', data: aduan });
  } catch (error) {
    res.status(400).json({ mesej: 'Gagal cipta aduan', ralat: error.message });
  }
};

/**
 * PUT /api/aduan/:id — kemaskini aduan.
 */
exports.update = async (req, res) => {
  try {
    const aduan = await Aduan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!aduan) {
      return res.status(404).json({ mesej: 'Aduan tidak dijumpai' });
    }
    res.json({ mesej: 'Aduan dikemaskini', data: aduan });
  } catch (error) {
    res.status(400).json({ mesej: 'Gagal kemaskini', ralat: error.message });
  }
};

/**
 * DELETE /api/aduan/:id — padam aduan.
 */
exports.destroy = async (req, res) => {
  const aduan = await Aduan.findByIdAndDelete(req.params.id);
  if (!aduan) {
    return res.status(404).json({ mesej: 'Aduan tidak dijumpai' });
  }
  res.json({ mesej: 'Aduan dipadam' });
};
```

**Konsep penting:**

- **`res.json(objek)`** — memulangkan respons dalam format JSON (berbeza dengan `res.render` yang memulangkan HTML).
- **Kod status HTTP** — `200` (OK, lalai), `201` (Dicipta), `400` (Permintaan tidak sah / validasi gagal), `404` (Tidak dijumpai). API yang baik memulangkan kod status yang betul supaya klien tahu apa yang berlaku.
- **`{ new: true, runValidators: true }`** — `new: true` memulangkan dokumen **selepas** dikemaskini (bukan versi lama); `runValidators: true` memaksa validasi skema berjalan semasa `findByIdAndUpdate`.

### Cipta `routes/api.js`

Cipta fail baru `routes/api.js`:

```js
// routes/api.js
// Laluan REST API (memulangkan JSON). Semua laluan berawalan /api (lihat server.js).

const express = require('express');
const router = express.Router();
const api = require('../controllers/apiController');

router.get('/aduan', api.index); //         GET    /api/aduan
router.post('/aduan', api.store); //        POST   /api/aduan
router.get('/aduan/:id', api.show); //      GET    /api/aduan/:id
router.put('/aduan/:id', api.update); //    PUT    /api/aduan/:id
router.delete('/aduan/:id', api.destroy); // DELETE /api/aduan/:id

module.exports = router;
```

### Daftar laluan API dalam `server.js`

Dalam `server.js`, pastikan dua perkara ini ada (sudah disertakan dalam kod penuh di Langkah 1):

```js
const apiRoutes = require('./routes/api');
// ...
app.use(express.json()); // baca JSON (untuk REST API)
// ...
app.use('/api', apiRoutes);
```

> **Nota:** `app.use(express.json())` **penting** untuk API. Tanpa ia, `req.body` akan kosong apabila klien menghantar data JSON. Ia berbeza dengan `express.urlencoded()` yang membaca data **borang** HTML.

### Menguji API

**1. Dengan pelayar (hanya untuk GET):**
Buka [http://localhost:3000/api/aduan](http://localhost:3000/api/aduan) di pelayar. Anda akan nampak data JSON seperti:

```json
{
  "jumlah": 4,
  "data": [
    {
      "_id": "66500a1f2c...",
      "noAduan": "ADN-2026-0004",
      "namaPengadu": "Rajesh a/l Kumar",
      "kategori": "Penipuan Pengguna",
      "status": "Baru",
      "...": "..."
    }
  ]
}
```

**2. Dengan `curl` (terminal):**

```bash
# Senarai semua aduan
curl http://localhost:3000/api/aduan

# Cipta aduan baru (POST + data JSON)
curl -X POST http://localhost:3000/api/aduan \
  -H "Content-Type: application/json" \
  -d '{
    "namaPengadu": "Lim Wei Sheng",
    "noIc": "950707081234",
    "telefon": "0161112222",
    "kategori": "Harga Tidak Berpatutan",
    "premis": "Pasar Mini Sejahtera",
    "lokasi": "Jalan Ria, 11900 Bayan Lepas, Pulau Pinang",
    "butiran": "Harga gula melebihi harga siling ditetapkan."
  }'
```

Respons yang dijangka (kod `201`):

```json
{
  "mesej": "Aduan dicipta",
  "data": { "noAduan": "ADN-2026-0005", "...": "..." }
}
```

**3. Dengan Thunder Client (dalam VS Code):**
Pasang sambungan **Thunder Client** dari pasaran VS Code. Kemudian:
1. Klik ikon Thunder Client di bar sisi.
2. Tekan **New Request**.
3. Pilih kaedah (cth: `POST`), masukkan URL `http://localhost:3000/api/aduan`.
4. Pergi ke tab **Body** → pilih **JSON**, dan tampal objek JSON aduan.
5. Tekan **Send** dan lihat respons.

> **Nota:** Untuk `PUT` dan `DELETE`, gantikan `:id` dengan `_id` sebenar sesuatu aduan (anda boleh dapatkan dari respons `GET /api/aduan`).

---

## Langkah 7: Naik ke Awan (Deploy)

Aplikasi anda berjalan sempurna di komputer sendiri (`localhost`). Langkah terakhir ialah **deploy** — menyiarkannya ke internet supaya sesiapa sahaja boleh mengaksesnya melalui URL awam. Kita akan guna **Render** (percuma) untuk pelayan, dan **MongoDB Atlas** (yang sudah kita sediakan pada Hari 1) untuk pangkalan data.

### 7.1 — Naikkan kod ke GitHub

Render mengambil kod anda dari repositori GitHub. Pastikan fail `.gitignore` anda **mengecualikan** `node_modules/` dan `.env`:

```
node_modules/
.env
npm-debug.log*
.DS_Store
*.log
```

> **PENTING:** Jangan sekali-kali memuat naik fail `.env` ke GitHub! Ia mengandungi kata laluan pangkalan data anda. Itulah sebabnya `.env` disenaraikan dalam `.gitignore`.

Kemudian, dalam folder projek:

```bash
git init
git add .
git commit -m "Sistem Aduan KPDN siap"
git branch -M main
git remote add origin https://github.com/<nama-anda>/sistem-aduan-kpdn.git
git push -u origin main
```

### 7.2 — Benarkan akses MongoDB Atlas dari mana-mana

Secara lalai, MongoDB Atlas hanya membenarkan sambungan dari alamat IP tertentu. Oleh kerana pelayan Render menggunakan IP yang berubah-ubah, kita perlu benarkan akses umum:

1. Log masuk ke [MongoDB Atlas](https://cloud.mongodb.com/).
2. Pergi ke **Network Access** (menu kiri) → **Add IP Address**.
3. Pilih **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**.

> **Nota:** Untuk projek pembelajaran ini, `0.0.0.0/0` memudahkan. Untuk sistem sebenar dalam produksi, hadkan kepada IP pelayan anda sahaja demi keselamatan.

### 7.3 — Deploy ke Render

1. Daftar / log masuk di [render.com](https://render.com/) (boleh guna akaun GitHub).
2. Tekan **New +** → **Web Service**.
3. Sambungkan repositori GitHub `sistem-aduan-kpdn` anda.
4. Isikan tetapan berikut:

| Tetapan | Nilai |
|---------|-------|
| **Name** | `sistem-aduan-kpdn` (atau apa-apa nama) |
| **Region** | Singapore (terdekat dengan Malaysia) |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Instance Type** | Free |

5. Pergi ke bahagian **Environment Variables** dan tambah:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | _(salin connection string Atlas anda)_ |
| `SESSION_SECRET` | _(mana-mana string rawak yang panjang)_ |

6. Tekan **Create Web Service**. Render akan memasang pakej, membina, dan menjalankan aplikasi anda. Selepas beberapa minit, anda akan dapat URL awam seperti `https://sistem-aduan-kpdn.onrender.com` 🎉

**Konsep penting:**

- **`npm start`** — Render menjalankan skrip `start` dari `package.json` anda, iaitu `node server.js`. (Kita guna `nodemon` hanya semasa pembangunan, bukan produksi.)
- **`process.env.PORT`** — Render menetapkan port sendiri melalui pemboleh ubah persekitaran. Kod kita sudah betul kerana ia membaca `const PORT = process.env.PORT || 3000` — guna port Render jika ada, jika tidak guna 3000 secara tempatan.
- **Pemboleh ubah persekitaran** — kita **tidak** memuat naik `.env`, sebaliknya kita masukkan nilainya secara manual dalam tetapan Render. Ini cara selamat menguruskan rahsia dalam produksi.

> **Nota:** Pelan percuma Render akan "tidur" selepas tempoh tidak aktif, jadi lawatan pertama selepas tidur mungkin mengambil masa ~30 saat untuk "bangun". Ini normal untuk pelan percuma.

### Alternatif: Railway

Anda juga boleh deploy ke [Railway](https://railway.app/) dengan cara yang serupa:
1. **New Project** → **Deploy from GitHub repo**.
2. Pilih repositori anda.
3. Pergi ke tab **Variables** dan tambah `MONGODB_URI` serta `SESSION_SECRET`.
4. Railway mengesan projek Node secara automatik dan menjalankan `npm start`.

---

## Cara Menjalankan Aplikasi

Ringkasan arahan untuk menjalankan projek lengkap Hari 3 secara tempatan:

```bash
# 1. Pasang semua pakej
npm install

# 2. Sediakan fail persekitaran
cp .env.example .env
# (kemudian edit .env — isi MONGODB_URI dan SESSION_SECRET)

# 3. (Pilihan) Isi data contoh
npm run seed

# 4. Jalankan dalam mod pembangunan (auto-reload)
npm run dev

# atau jalankan secara biasa
npm start
```

Layari [http://localhost:3000](http://localhost:3000).

`package.json` projek ini mengandungi skrip berikut:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed": "node seed.js"
  }
}
```

---

## Pengesahan & Kebenaran (Bab 13)

> **Pengenalan (Bab 13 buku):** Bahagian ini memperkenalkan konsep — kita tidak melaksanakannya sepenuhnya dalam kursus 3 hari ini. Rujuk **Bab 13** buku untuk pelaksanaan penuh menggunakan **Passport.js**.

Setakat ini, sesiapa sahaja yang membuka aplikasi boleh kemaskini atau padam aduan. Dalam sistem sebenar KPDN, hanya **pegawai** yang dibenarkan berbuat demikian. Di sinilah pengesahan & kebenaran diperlukan.

### Authentication vs Authorization

| Istilah | Soalan yang dijawab | Contoh |
|---------|---------------------|--------|
| **Authentication** (pengesahan) | *"Siapa anda?"* | Pegawai log masuk dengan emel + kata laluan |
| **Authorization** (kebenaran) | *"Apa yang anda dibenarkan buat?"* | Hanya pegawai boleh padam aduan; orang awam hanya boleh hantar |

### JWT (JSON Web Token) ringkas

**JWT** ialah satu cara popular untuk mengingati "siapa yang sudah log masuk". Selepas log masuk berjaya, pelayan menjana satu **token** bertandatangan yang dihantar balik kepada pelanggan. Setiap permintaan seterusnya menyertakan token tersebut sebagai bukti identiti — tanpa perlu menyimpan sesi di pelayan. Token mengandungi tiga bahagian: *header*, *payload*, dan *signature*.

### Passport.js

**Passport.js** ialah *middleware* pengesahan untuk Express yang menyokong banyak **strategy** (cara log masuk): emel/kata laluan tempatan, Google, Facebook, JWT, dan lain-lain. Ia menjadikan penambahan log masuk lebih teratur.

Idea ringkas: satu *middleware* yang menyemak sama ada pengguna sudah log masuk sebelum membenarkan akses ke laluan tertentu.

```js
// Contoh konsep — middleware untuk lindungi laluan (untuk ditambah kemudian)
function requireLogin(req, res, next) {
  if (req.user) {
    return next(); // sudah log masuk — teruskan
  }
  return res.redirect('/login'); // belum log masuk — minta log masuk
}

// Gunakannya pada laluan yang perlu dilindungi:
// router.get('/aduan/:id/edit', requireLogin, aduan.edit);
// router.delete('/aduan/:id', requireLogin, aduan.destroy);
```

> **Konsep penting:** *Authentication* mengesahkan identiti; *authorization* mengawal kebenaran. Untuk KPDN, kita lindungi laluan **edit** dan **delete** supaya hanya pegawai yang log masuk boleh menggunakannya. **Rujuk Bab 13 buku untuk pelaksanaan penuh.**

---

## Pengendalian Ralat (Bab 14)

> **Pengenalan (Bab 14 buku):** Bahagian ini menunjukkan amalan yang disyorkan. Anda boleh tambah *error-handling middleware* di bawah ke dalam `server.js` projek anda untuk mengendalikan ralat dengan kemas.

Sehingga kini, jika berlaku ralat (cth: ID aduan tidak sah), pengguna mungkin nampak halaman ralat yang berserabut. Aplikasi yang baik **menangkap ralat** dan memaparkan mesej yang mesra.

### Jenis ralat

| Jenis | Penerangan | Contoh |
|-------|------------|--------|
| **Syntax error** | Kesilapan penulisan kod | Tertinggal `)` atau `}` |
| **Runtime error** | Ralat semasa aplikasi berjalan | Sambungan DB terputus, ID tidak sah |

### Error-handling middleware dalam Express

Express mengenali *middleware* khas dengan **empat** parameter `(err, req, res, next)` sebagai pengendali ralat. Letakkannya **selepas** semua laluan, sebelum `app.listen`:

```js
// Diletakkan SELEPAS semua app.use(...) laluan, sebelum app.listen
app.use((err, req, res, next) => {
  console.error(err.stack); // log ralat untuk pembangun
  res.status(err.status || 500).render('ralat', {
    title: 'Ralat Pelayan',
    mesej: 'Maaf, berlaku masalah. Sila cuba lagi.',
  });
});
```

### Mematikan aplikasi dengan elok (graceful shutdown)

Apabila pelayan dihentikan (cth: semasa deploy versi baharu), tutup sambungan MongoDB dengan elok supaya tiada data tergantung:

```js
process.on('SIGTERM', async () => {
  console.log('Menerima SIGTERM, menutup pelayan...');
  await mongoose.connection.close();
  process.exit(0);
});
```

> **Konsep penting:** Lemparkan ralat yang **bermakna** (mesej jelas), kendalikan secara berpusat dengan *error-handling middleware*, dan tutup sumber (seperti sambungan DB) dengan elok. **Rujuk Bab 14 buku** untuk *custom error classes* dan butiran lanjut.

---

## Keselamatan Aplikasi (Bab 15)

> **Pengenalan (Bab 15 buku):** Senarai semak ringkas amalan keselamatan asas. Rujuk **Bab 15** buku untuk *Node.js threat model* dan OWASP Top 10 dengan terperinci.

Aplikasi yang akan digunakan oleh orang ramai **mesti** selamat. Berikut amalan keselamatan asas yang relevan dengan projek ini.

### OWASP Top 10 (ringkas)

**OWASP Top 10** ialah senarai 10 risiko keselamatan aplikasi web yang paling kritikal (cth: *injection*, *broken authentication*, *security misconfiguration*). Ia titik permulaan yang baik untuk memahami ancaman.

### Senarai semak keselamatan untuk projek ini

- ✅ **Tetapkan header keselamatan** — pasang [`helmet`](https://www.npmjs.com/package/helmet): `npm install helmet`, kemudian `app.use(helmet())`.
- ✅ **Sahkan input pengguna** — gunakan [`express-validator`](https://www.npmjs.com/package/express-validator) untuk menyemak & membersih data borang sebelum disimpan (selain validasi Mongoose).
- ✅ **Jangan sesekali commit `.env`** — fail `.env` (kata laluan DB, `SESSION_SECRET`) mesti dalam `.gitignore`. Jangan kongsi rahsia.
- ✅ **Hadkan kadar permintaan (rate limiting)** — pasang [`express-rate-limit`](https://www.npmjs.com/package/express-rate-limit) untuk menghalang serangan *brute-force*.
- ✅ **Elak XSS** — EJS dengan `<%= %>` **meng-escape** output secara automatik (selamat). Berhati-hati dengan `<%- %>` yang **tidak** meng-escape — gunakan hanya untuk kandungan yang anda percayai.
- ✅ **Kemaskini dependency** — jalankan `npm audit` secara berkala untuk mengesan pakej dengan kelemahan diketahui.

> **Konsep penting:** Keselamatan bukan satu langkah, tetapi **amalan berterusan**. Mulakan dengan `helmet`, validasi input, rahsia dalam `.env`, dan `npm audit`. **Rujuk Bab 15 buku** untuk *Node.js threat model* dan cadangan rasmi.

---

## Ringkasan Hari 3

Hari ini anda telah **melengkapkan** sistem dengan:

| Ciri | Fail Utama | Konsep |
|------|-----------|--------|
| Mesej flash | `server.js`, `partials/flash.ejs` | `express-session`, `connect-flash`, `res.locals` |
| Kemaskini (Update) | `aduanController.js`, `aduan/edit.ejs` | `method-override`, `PUT`, `aduan.set().save()` |
| Padam (Delete) | `aduanController.js`, `aduan/show.ejs` | `DELETE`, `findByIdAndDelete`, `confirm()` |
| Tapisan status | `aduanController.js`, `aduan/index.ejs` | Membina pertanyaan berperingkat |
| Papan pemuka | `aduanController.js`, `index.ejs` | `countDocuments`, `sort`, `limit` |
| REST API | `apiController.js`, `routes/api.js` | JSON, kod status HTTP, `express.json()` |
| Deploy | GitHub, Render, Atlas | Pemboleh ubah persekitaran produksi |

**Aliran CRUD penuh** yang kini berfungsi:

| Operasi | Kaedah HTTP | Laluan | Controller |
|---------|-------------|--------|------------|
| Senarai | GET | `/aduan` | `index` |
| Borang daftar | GET | `/aduan/create` | `create` |
| Simpan | POST | `/aduan` | `store` |
| Papar | GET | `/aduan/:id` | `show` |
| Borang kemaskini | GET | `/aduan/:id/edit` | `edit` |
| Kemaskini | PUT | `/aduan/:id` | `update` |
| Padam | DELETE | `/aduan/:id` | `destroy` |

---

## Penutup Kursus

🎉 **Tahniah!** Anda telah menamatkan kursus Node.js 3 hari dan membina sebuah aplikasi web lengkap dari kosong:

- **Hari 1** — Anda belajar asas Node.js, Express, EJS, dan menyambung ke MongoDB.
- **Hari 2** — Anda membina model Mongoose, struktur MVC, serta operasi Cipta & Baca.
- **Hari 3** — Anda melengkapkan CRUD, menambah REST API, dan men-deploy ke internet.

Sistem Aduan Pengguna KPDN anda kini sebuah aplikasi web sebenar yang boleh diakses sesiapa sahaja di dunia!

### Ke mana selepas ini?

Tiga topik **Bahagian 4** buku yang kita perkenalkan hari ini ialah langkah pendalaman seterusnya yang paling penting — jadikan ia keutamaan:

- **Pengesahan & Kebenaran (Bab 13)** — laksanakan log masuk pegawai sepenuhnya dengan **Passport.js**/JWT, dan lindungi laluan edit/padam. Pengguna awam hanya boleh hantar aduan; pegawai pula boleh kemaskini status.
- **Pengendalian Ralat (Bab 14)** — tambah *error-handling middleware* berpusat & *custom error classes*.
- **Keselamatan Aplikasi (Bab 15)** — laksanakan senarai semak keselamatan (helmet, validasi input, `npm audit`) dan kaji OWASP Top 10.

Selain itu, cuba juga tambah:
- **Penomboran halaman (Pagination)** — apabila aduan menjadi terlalu banyak, paparkan 10 setiap halaman menggunakan `.skip()` dan `.limit()`.
- **Muat naik fail (File Upload)** — benarkan pengadu lampirkan gambar bukti menggunakan `multer`.
- **Pengesahan e-mel** — hantar e-mel pengesahan automatik kepada pengadu menggunakan `nodemailer`.
- **Ujian (Testing)** — tulis ujian automatik menggunakan `jest` dan `supertest` untuk memastikan API anda berfungsi.
- **Hubungan Model (Relationships)** — tambah model `Pegawai` dan kaitkan setiap aduan dengan pegawai yang menyiasatnya menggunakan `ref` dan `.populate()`.

### Sumber pembelajaran lanjutan

- 📘 **_Node.js for Beginners_** — Ulises Gascón (Packt, 2024) — buku rujukan kursus ini; Bab 13–15 mendalami auth, ralat & keselamatan
- [Dokumentasi Express](https://expressjs.com/)
- [Dokumentasi Mongoose](https://mongoosejs.com/docs/)
- [MDN — JavaScript](https://developer.mozilla.org/ms/docs/Web/JavaScript)
- [The Odin Project — Node.js](https://www.theodinproject.com/paths/full-stack-javascript)

Teruskan berlatih, bina projek anda sendiri, dan jangan takut membuat kesilapan — itulah cara terbaik untuk belajar. Selamat membina! 🚀

---

_Disediakan oleh **Habib** — [bespokesb.com](https://bespokesb.com)_
