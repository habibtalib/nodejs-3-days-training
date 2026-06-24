# Hari 4 — Panduan Bengkel: Ciri Lanjutan (Hubungan Data, Muat Naik Fail & Analitik)

Panduan langkah demi langkah untuk menambah **tiga ciri lanjutan** pada Sistem Aduan KPDN yang telah anda bina pada Hari 1–3. Pada akhir bengkel ini (lebih kurang 6 jam), aplikasi anda akan mempunyai **hubungan data** antara dua model, keupayaan **muat naik fail**, dan halaman **analitik** dengan carta.

> **Imbas kembali Hari 1–3:** Anda telah membina aplikasi CRUD penuh (`Aduan`), REST API, papan pemuka, dan menerbitkannya ke awan. Hari 4 mengambil aplikasi siap itu dan menambah ciri yang membuatnya terasa seperti sistem sebenar.

**Apa yang akan dibina:**
- Model `Tindakan` yang **berkaitan** dengan `Aduan` (hubungan satu-ke-banyak menggunakan `ObjectId` + `ref`)
- Borang rekod **tindakan susulan** yang boleh menukar status aduan
- Penggunaan `populate()` untuk memuatkan data berkaitan
- **Muat naik fail** lampiran (bukti) menggunakan **multer**
- Halaman **analitik** dengan **aggregation pipeline** MongoDB + carta **Chart.js**
- Pengendalian ralat untuk muat naik fail

> **Nota untuk pemula:** Hari 4 ialah hari **lanjutan**. Pastikan anda selesa dengan Hari 1–3 dahulu. Mulakan dengan menyalin folder `hari-3` (atau teruskan kerja anda), kemudian ikut langkah di bawah.

---

## Rujukan Buku

Hari 4 **mendalami Bab 12 (Data Persistence with MongoDB)** — khususnya **hubungan antara dokumen** (`ref` + `populate`) yang hanya disentuh secara ringkas dalam kursus teras. Dua lagi ciri — **muat naik fail** (multer) dan **analitik** (aggregation + Chart.js) — adalah kemahiran praktikal **di luar skop teras buku**, tetapi sangat berguna untuk aplikasi sebenar.

| Bahagian dalam nota ini | Rujukan |
|-------------------------|---------|
| Hubungan data, `ref`, `populate` | Bab 12 (lanjutan) |
| Muat naik fail (multer) | Kemahiran praktikal tambahan |
| Analitik (aggregation pipeline) | Kemahiran praktikal tambahan |

> **Nota:** Hari 4 ialah hari **lanjutan / pilihan** selepas 3 hari teras. Ia tidak wajib untuk memahami asas Node.js, tetapi memberi peserta kemahiran untuk membina ciri yang lebih kaya.

---

## Persediaan

Salin folder `hari-3` ke `hari-4` (atau teruskan projek sedia ada), kemudian pasang pakej baharu yang diperlukan:

```bash
cd hari-4
npm install
```

Kita akan menambah satu pakej baharu — **multer** (untuk muat naik fail). Ia sudah disenaraikan dalam `package.json`:

```json
"dependencies": {
  "...": "...",
  "mongoose": "^8.4.0",
  "multer": "^1.4.5-lts.1"
}
```

> Jika anda bermula dari Hari 3, pasang multer secara manual: `npm install multer`.

---

## Langkah 1: Hubungan Data — Model `Tindakan`

Setakat ini kita hanya ada **satu** model: `Aduan`. Dalam sistem sebenar, satu aduan boleh mempunyai banyak **tindakan susulan** (catatan siasatan oleh pegawai). Ini ialah hubungan **satu-ke-banyak**: *satu Aduan → banyak Tindakan*.

Dalam MongoDB/Mongoose, kita hubungkan dua model menggunakan **`ObjectId`** dan **`ref`**.

Cipta fail `models/Tindakan.js`:

```js
// models/Tindakan.js
// Satu "tindakan susulan" (catatan siasatan) untuk sesuatu aduan.
// Menunjukkan HUBUNGAN data: setiap Tindakan merujuk kepada satu Aduan.

const mongoose = require('mongoose');
const { STATUS } = require('./Aduan');

const tindakanSchema = new mongoose.Schema(
  {
    // Rujukan (reference) ke dokumen Aduan — inilah "hubungan" itu.
    aduan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Aduan', // nama model yang dirujuk
      required: true,
    },
    catatan: {
      type: String,
      required: [true, 'Catatan tindakan wajib diisi'],
      trim: true,
    },
    pegawai: {
      type: String,
      required: [true, 'Nama pegawai wajib diisi'],
      trim: true,
    },
    // (Pilihan) tukar status aduan apabila tindakan direkod.
    statusBaru: {
      type: String,
      enum: STATUS,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Tindakan', tindakanSchema);
```

**Konsep penting:**
- **`mongoose.Schema.Types.ObjectId`** — jenis data khas yang menyimpan **id** dokumen lain (bukan keseluruhan dokumen).
- **`ref: 'Aduan'`** — memberitahu Mongoose bahawa id ini merujuk kepada model `Aduan`. Inilah yang membolehkan `populate()` nanti.
- Medan `aduan` menyimpan **id aduan induk** — itulah "hubungan" antara kedua-dua model.
- Kita import `STATUS` dari model `Aduan` supaya `statusBaru` guna senarai status yang sama.

> **Nota:** Ini dipanggil **referencing** (rujukan). Alternatif lain ialah **embedding** (menyimpan tindakan terus di dalam dokumen aduan). Referencing lebih sesuai apabila data anak boleh banyak atau perlu dicari secara berasingan.

---

## Langkah 2: Controller & Laluan Tindakan

Sekarang kita perlukan logik untuk **merekod** satu tindakan baharu. Cipta `controllers/tindakanController.js`:

```js
// controllers/tindakanController.js
// Logik untuk tindakan susulan (catatan siasatan) bagi sesuatu aduan.

const Aduan = require('../models/Aduan');
const Tindakan = require('../models/Tindakan');

/**
 * Rekod satu tindakan baharu untuk satu aduan.
 * Jika statusBaru diberi, kemas kini juga status aduan tersebut.
 */
exports.store = async (req, res) => {
  try {
    const aduan = await Aduan.findById(req.params.id);
    if (!aduan) {
      req.flash('gagal', 'Aduan tidak dijumpai.');
      return res.redirect('/aduan');
    }

    // Cipta tindakan yang merujuk kepada aduan ini.
    await Tindakan.create({
      aduan: aduan.id,
      catatan: req.body.catatan,
      pegawai: req.body.pegawai,
      statusBaru: req.body.statusBaru || undefined,
    });

    // Jika pegawai pilih status baharu, kemas kini aduan.
    if (req.body.statusBaru) {
      aduan.status = req.body.statusBaru;
      await aduan.save();
    }

    req.flash('jaya', 'Tindakan susulan berjaya direkod.');
    res.redirect(`/aduan/${aduan.id}`);
  } catch (error) {
    req.flash('gagal', error.message);
    res.redirect(`/aduan/${req.params.id}`);
  }
};
```

**Konsep penting:**
- Kita simpan **`aduan: aduan.id`** — inilah yang mengaitkan tindakan dengan aduan induk.
- Jika `statusBaru` diberi, kita **kemas kini aduan** sekali gus — satu tindakan boleh mengubah aliran kerja (workflow) aduan.

Tambah laluan dalam `routes/web.js` (jangan lupa import controller di atas):

```js
const tindakan = require('../controllers/tindakanController');

// Hari 4 — tindakan susulan (hubungan data)
router.post('/aduan/:id/tindakan', tindakan.store);
```

---

## Langkah 3: Papar Tindakan + `populate()`

### Muatkan tindakan dalam halaman butiran

Kemas kini fungsi `show` dalam `controllers/aduanController.js` untuk **memuatkan** semua tindakan yang berkaitan dengan aduan tersebut (ingat import `Tindakan` di atas fail):

```js
const Tindakan = require('../models/Tindakan');

exports.show = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);

  if (!aduan) {
    req.flash('gagal', 'Aduan tidak dijumpai.');
    return res.redirect('/aduan');
  }

  // Muatkan tindakan susulan yang berkaitan dengan aduan ini (hubungan data).
  const senaraiTindakan = await Tindakan.find({ aduan: aduan.id }).sort({ createdAt: -1 });

  res.render('aduan/show', {
    title: aduan.noAduan,
    aduan,
    senaraiTindakan,
    STATUS: Aduan.STATUS,
  });
};
```

Di sini kita cari **semua Tindakan yang `aduan`-nya sama dengan id aduan ini** — itulah cara mencari "anak" bagi satu "induk".

### Borang & senarai tindakan dalam `views/aduan/show.ejs`

Tambah bahagian ini di hujung `views/aduan/show.ejs`:

```html
<!-- ===== Tindakan Susulan (hubungan data) — Hari 4 ===== -->
<div class="bg-white rounded-lg shadow p-6 mt-6">
  <h2 class="font-semibold text-lg mb-3">Tindakan Susulan (<%= senaraiTindakan.length %>)</h2>

  <% if (senaraiTindakan.length > 0) { %>
    <ol class="space-y-3 mb-6">
      <% senaraiTindakan.forEach(function (t) { %>
        <li class="border-l-4 border-blue-300 pl-3 py-1">
          <p class="text-sm whitespace-pre-line"><%= t.catatan %></p>
          <p class="text-xs text-slate-400 mt-1">
            <%= t.pegawai %> · <%= t.createdAt.toLocaleString('ms-MY') %>
            <% if (t.statusBaru) { %> · status → <strong><%= t.statusBaru %></strong><% } %>
          </p>
        </li>
      <% }) %>
    </ol>
  <% } else { %>
    <p class="text-slate-500 text-sm mb-4">Belum ada tindakan susulan direkod.</p>
  <% } %>

  <!-- Borang rekod tindakan baharu -->
  <form method="POST" action="/aduan/<%= aduan.id %>/tindakan" class="space-y-3 border-t pt-4">
    <div class="grid md:grid-cols-2 gap-3">
      <div>
        <label class="block text-sm font-medium mb-1">Nama Pegawai</label>
        <input type="text" name="pegawai" required class="w-full border border-slate-300 rounded px-3 py-2" />
      </div>
      <div>
        <label class="block text-sm font-medium mb-1">Kemaskini Status (pilihan)</label>
        <select name="statusBaru" class="w-full border border-slate-300 rounded px-3 py-2">
          <option value="">— Kekalkan status —</option>
          <% STATUS.forEach(function (s) { %>
            <option value="<%= s %>" <%= aduan.status === s ? 'selected' : '' %>><%= s %></option>
          <% }) %>
        </select>
      </div>
    </div>
    <div>
      <label class="block text-sm font-medium mb-1">Catatan Tindakan</label>
      <textarea name="catatan" rows="2" required class="w-full border border-slate-300 rounded px-3 py-2"></textarea>
    </div>
    <button type="submit" class="bg-slate-700 text-white px-4 py-2 rounded hover:bg-slate-600 text-sm">Rekod Tindakan</button>
  </form>
</div>
```

### Demo `populate()` pada papan pemuka

`populate()` ialah keajaiban Mongoose: ia **menggantikan id rujukan dengan dokumen sebenar**. Kemas kini fungsi `dashboard` dalam `controllers/aduanController.js`:

```js
exports.dashboard = async (req, res) => {
  const jumlah = await Aduan.countDocuments();
  const baru = await Aduan.countDocuments({ status: 'Baru' });
  const siasatan = await Aduan.countDocuments({ status: 'Dalam Siasatan' });
  const selesai = await Aduan.countDocuments({ status: 'Selesai' });
  const terkini = await Aduan.find().sort({ createdAt: -1 }).limit(5);

  // Tindakan terkini — guna populate() untuk muatkan maklumat aduan berkaitan.
  const tindakanTerkini = await Tindakan.find()
    .populate('aduan', 'noAduan namaPengadu') // ambil hanya 2 medan dari Aduan
    .sort({ createdAt: -1 })
    .limit(5);

  res.render('index', {
    title: 'Papan Pemuka',
    statistik: { jumlah, baru, siasatan, selesai },
    terkini,
    tindakanTerkini,
  });
};
```

**Konsep penting — `populate()`:**
- Tanpa `populate()`, medan `aduan` hanyalah satu **id** (cth: `665f1a2b...`).
- Dengan **`.populate('aduan', 'noAduan namaPengadu')`**, Mongoose pergi ambil dokumen `Aduan` sebenar dan **gantikan id itu** — jadi kita boleh terus guna `t.aduan.noAduan` dan `t.aduan.namaPengadu` dalam paparan.
- Argumen kedua (`'noAduan namaPengadu'`) memilih **hanya medan yang diperlukan** — lebih cekap.

Tambah bahagian ini di hujung `views/index.ejs`:

```html
<!-- Tindakan terkini (guna populate untuk maklumat aduan berkaitan) — Hari 4 -->
<div class="bg-white rounded-lg shadow mt-6">
  <div class="px-4 py-3 border-b">
    <h2 class="font-semibold">Tindakan Susulan Terkini</h2>
  </div>
  <% if (!tindakanTerkini || tindakanTerkini.length === 0) { %>
    <p class="px-4 py-6 text-slate-500">Belum ada tindakan susulan direkod.</p>
  <% } else { %>
    <ul class="divide-y">
      <% tindakanTerkini.forEach(function (t) { %>
        <li class="px-4 py-3 text-sm">
          <% if (t.aduan) { %>
            <a href="/aduan/<%= t.aduan.id %>" class="font-mono text-blue-700 hover:underline"><%= t.aduan.noAduan %></a>
            <span class="text-slate-400">·</span> <%= t.aduan.namaPengadu %>
          <% } %>
          <p class="text-slate-600 mt-1"><%= t.catatan %></p>
          <p class="text-xs text-slate-400"><%= t.pegawai %> · <%= t.createdAt.toLocaleString('ms-MY') %></p>
        </li>
      <% }) %>
    </ul>
  <% } %>
</div>
```

---

## Langkah 4: Muat Naik Fail dengan multer

Pengadu sering perlu lampirkan **bukti** (gambar resit, foto premis, PDF). Express tidak mengendalikan muat naik fail secara lalai — kita guna pakej **multer**.

### Pasang multer

```bash
npm install multer
```

### Tambah medan `lampiran` pada model `Aduan`

Dalam `models/Aduan.js`, tambah medan ini (selepas medan `status`):

```js
// Senarai nama fail lampiran (bukti) yang dimuat naik. (Hari 4)
lampiran: {
  type: [String],
  default: [],
},
```

Ini menyimpan **senarai nama fail** (bukan fail itu sendiri — fail disimpan dalam folder).

### Konfigurasi multer

Cipta `config/multer.js`:

```js
// config/multer.js
// Konfigurasi multer untuk muat naik fail (lampiran bukti aduan).

const multer = require('multer');
const path = require('path');

// Simpan fail ke public/uploads dengan nama unik.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    // Nama unik: masa + nombor rawak + sambungan asal.
    const unik = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `lampiran-${unik}${path.extname(file.originalname)}`);
  },
});

// Hanya benarkan imej & PDF, maksimum 5MB setiap fail.
function fileFilter(req, file, cb) {
  const dibenarkan = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  if (dibenarkan.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya fail imej (JPG/PNG/GIF) atau PDF dibenarkan.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = upload;
```

**Konsep penting:**
- **`diskStorage`** — simpan fail ke cakera (folder `public/uploads`). Kita beri **nama unik** supaya fail tidak bertindih.
- **`fileFilter`** — hanya benarkan jenis fail tertentu (imej & PDF). Tolak yang lain.
- **`limits.fileSize`** — hadkan saiz (5MB) supaya tiada fail besar membebankan pelayan.

> **Nota:** Cipta folder `public/uploads/` (Express akan hidangkan fail dari `public` secara automatik melalui `express.static`). Fail dalam `public/uploads/<nama-fail>` boleh diakses di URL `/uploads/<nama-fail>`.

### Laluan muat naik

Dalam `routes/web.js`, import dan tambah laluan:

```js
const upload = require('../config/multer');

// Hari 4 — muat naik lampiran (multer; "lampiran" = nama medan input fail)
router.post('/aduan/:id/lampiran', upload.array('lampiran', 5), aduan.muatNaikLampiran);
```

**`upload.array('lampiran', 5)`** ialah **middleware** multer: ia memproses sehingga 5 fail dari medan borang bernama `lampiran` **sebelum** controller dijalankan.

### Controller muat naik

Tambah fungsi ini dalam `controllers/aduanController.js`:

```js
/**
 * Muat naik fail lampiran (bukti) untuk satu aduan.
 * Fail dikendalikan oleh middleware multer; di sini kita simpan namanya.
 */
exports.muatNaikLampiran = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);
  if (!aduan) {
    req.flash('gagal', 'Aduan tidak dijumpai.');
    return res.redirect('/aduan');
  }

  if (req.files && req.files.length > 0) {
    const namaFail = req.files.map((f) => f.filename);
    aduan.lampiran.push(...namaFail);
    await aduan.save();
    req.flash('jaya', `${namaFail.length} lampiran berjaya dimuat naik.`);
  } else {
    req.flash('gagal', 'Tiada fail dipilih.');
  }

  res.redirect(`/aduan/${aduan.id}`);
};
```

**Konsep penting:**
- Multer meletakkan maklumat fail dalam **`req.files`**. Setiap fail ada `f.filename` (nama yang kita tetapkan).
- Kita simpan **nama fail** ke dalam array `aduan.lampiran` dan `save()`.

### Borang & senarai lampiran dalam `views/aduan/show.ejs`

Tambah bahagian ini dalam `views/aduan/show.ejs`:

```html
<!-- ===== Lampiran (muat naik fail) — Hari 4 ===== -->
<div class="bg-white rounded-lg shadow p-6 mt-6">
  <h2 class="font-semibold text-lg mb-3">Lampiran / Bukti</h2>

  <% if (aduan.lampiran && aduan.lampiran.length > 0) { %>
    <ul class="flex flex-wrap gap-3 mb-4">
      <% aduan.lampiran.forEach(function (fail) { %>
        <li>
          <a href="/uploads/<%= fail %>" target="_blank"
            class="inline-flex items-center gap-1 text-blue-700 border border-slate-200 rounded px-3 py-2 hover:bg-slate-50 text-sm">
            📎 <%= fail %>
          </a>
        </li>
      <% }) %>
    </ul>
  <% } else { %>
    <p class="text-slate-500 text-sm mb-4">Belum ada lampiran.</p>
  <% } %>

  <!-- Borang muat naik: enctype WAJIB multipart/form-data untuk fail -->
  <form method="POST" action="/aduan/<%= aduan.id %>/lampiran" enctype="multipart/form-data"
    class="flex flex-wrap items-center gap-2">
    <input type="file" name="lampiran" multiple accept="image/*,application/pdf"
      class="text-sm border border-slate-300 rounded px-3 py-2" />
    <button type="submit" class="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm">Muat Naik</button>
    <span class="text-xs text-slate-400">Imej/PDF · maksimum 5MB setiap fail</span>
  </form>
</div>
```

> **Konsep penting — `enctype="multipart/form-data"`:** Untuk menghantar **fail**, borang **WAJIB** mempunyai atribut `enctype="multipart/form-data"`. Tanpa ini, hanya nama fail dihantar, bukan fail sebenar. Perhatikan juga `name="lampiran"` mesti **sama** dengan nama dalam `upload.array('lampiran', 5)`.

### Jangan commit fail yang dimuat naik

Tambah dalam `.gitignore` supaya fail muat naik tidak masuk ke Git:

```
# Fail lampiran yang dimuat naik (jangan commit)
public/uploads/*
!public/uploads/.gitkeep
```

> Letak satu fail kosong `public/uploads/.gitkeep` supaya folder itu kekal wujud dalam repositori walaupun kosong.

---

## Langkah 5: Analitik dengan Aggregation + Chart.js

Pengurus KPDN mahu lihat **corak** — aduan ikut kategori, trend ikut bulan. Untuk ini kita guna **aggregation pipeline** MongoDB: satu siri "peringkat" (stages) yang memproses & meringkaskan data.

### Controller analitik

Cipta `controllers/analitikController.js`:

```js
// controllers/analitikController.js
// Analitik menggunakan "aggregation pipeline" MongoDB.

const Aduan = require('../models/Aduan');

/**
 * Papar halaman analitik:
 *  - Bilangan aduan mengikut kategori
 *  - Bilangan aduan mengikut bulan (trend)
 */
exports.index = async (req, res) => {
  // 1) Kumpulkan & kira aduan mengikut kategori.
  const ikutKategori = await Aduan.aggregate([
    { $group: { _id: '$kategori', jumlah: { $sum: 1 } } },
    { $sort: { jumlah: -1 } },
  ]);

  // 2) Kumpulkan & kira aduan mengikut bulan (YYYY-MM).
  const ikutBulan = await Aduan.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        jumlah: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.render('analitik', {
    title: 'Analitik',
    // Hantar data sebagai JSON untuk digunakan oleh Chart.js di pelayar.
    kategoriLabel: ikutKategori.map((k) => k._id),
    kategoriData: ikutKategori.map((k) => k.jumlah),
    bulanLabel: ikutBulan.map((b) => b._id),
    bulanData: ikutBulan.map((b) => b.jumlah),
  });
};
```

**Konsep penting — aggregation pipeline:**
- **`$group`** — kumpulkan dokumen mengikut sesuatu kunci (`_id`). Di sini, mengikut `$kategori`.
- **`$sum: 1`** — kira bilangan (tambah 1 untuk setiap dokumen dalam kumpulan).
- **`$dateToString`** — tukar tarikh kepada teks `YYYY-MM` supaya boleh dikumpul ikut bulan.
- **`$sort`** — susun hasil.
- Bayangkan ia seperti **GROUP BY** dalam SQL, tetapi dalam bentuk senarai "peringkat".

### Halaman analitik dengan Chart.js

Cipta `views/analitik.ejs`:

```html
<div class="mb-6">
  <h1 class="text-2xl font-bold text-slate-800">Analitik Aduan</h1>
  <p class="text-slate-500">Visualisasi data menggunakan MongoDB aggregation + Chart.js.</p>
</div>

<div class="grid lg:grid-cols-2 gap-6">
  <div class="bg-white rounded-lg shadow p-5">
    <h2 class="font-semibold mb-3">Aduan Mengikut Kategori</h2>
    <canvas id="cartaKategori"></canvas>
  </div>
  <div class="bg-white rounded-lg shadow p-5">
    <h2 class="font-semibold mb-3">Trend Aduan Mengikut Bulan</h2>
    <canvas id="cartaBulan"></canvas>
  </div>
</div>

<!-- Chart.js melalui CDN -->
<script src="https://cdn.jsdelivr.net/npm/chart.js@4"></script>
<script>
  // Data dari pelayan (hasil aggregation) disuntik sebagai JSON.
  const kategoriLabel = <%- JSON.stringify(kategoriLabel) %>;
  const kategoriData  = <%- JSON.stringify(kategoriData) %>;
  const bulanLabel    = <%- JSON.stringify(bulanLabel) %>;
  const bulanData     = <%- JSON.stringify(bulanData) %>;

  // Carta bar: aduan mengikut kategori
  new Chart(document.getElementById('cartaKategori'), {
    type: 'bar',
    data: {
      labels: kategoriLabel,
      datasets: [{ label: 'Bilangan Aduan', data: kategoriData, backgroundColor: '#2563eb' }],
    },
    options: { plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } },
  });

  // Carta garis: trend mengikut bulan
  new Chart(document.getElementById('cartaBulan'), {
    type: 'line',
    data: {
      labels: bulanLabel,
      datasets: [{ label: 'Bilangan Aduan', data: bulanData, borderColor: '#0f766e', tension: 0.3, fill: false }],
    },
    options: { scales: { y: { beginAtZero: true } } },
  });
</script>
```

**Konsep penting:**
- Data hasil aggregation dihantar dari pelayan, kemudian **disuntik ke JavaScript pelayar** menggunakan `<%- JSON.stringify(...) %>` (perhatikan `<%-` yang mengeluarkan teks mentah, bukan `<%=`).
- **Chart.js** (dimuatkan dari CDN) melukis carta ke dalam elemen `<canvas>`.

### Laluan & pautan navbar

Tambah laluan dalam `routes/web.js`:

```js
const analitik = require('../controllers/analitikController');

// Analitik (aggregation) — daftar sebelum /aduan/:id supaya tidak bertindih
router.get('/analitik', analitik.index);
```

> **Nota:** Amalan mendaftar laluan khusus (`/analitik`) sebelum laluan dinamik (`/aduan/:id`) adalah baik untuk mengelak kekeliruan.

Tambah pautan dalam `views/partials/navbar.ejs`:

```html
<a href="/analitik" class="px-3 py-2 rounded hover:bg-blue-700 <%= currentPath === '/analitik' ? 'bg-blue-700' : '' %>">Analitik</a>
```

---

## Langkah 6: Error Handling untuk Muat Naik

Apa berlaku jika pengguna cuba muat naik fail **terlalu besar** atau **jenis salah**? Multer akan **lemparkan ralat**. Kita perlukan **error-handling middleware** untuk menangkapnya dengan kemas.

Tambah dalam `server.js`, **selepas** laluan dan halaman 404:

```js
// 7b) Pengendali ralat — termasuk ralat muat naik fail (multer).
//     Mesti ada 4 parameter (err, req, res, next).
app.use((err, req, res, next) => {
  console.error('❌ Ralat:', err.message);
  // Untuk ralat muat naik, kembali ke halaman sebelumnya dengan mesej.
  if (req.flash) {
    req.flash('gagal', err.message || 'Ralat tidak dijangka.');
    return res.redirect(req.get('Referrer') || '/');
  }
  res.status(500).send('Ralat pelayan: ' + err.message);
});
```

**Konsep penting:**
- Middleware ralat Express dikenali dengan **empat** parameter: `(err, req, res, next)`.
- Ia mesti diletak **paling akhir** (selepas semua laluan).
- Di sini kita papar mesej ralat sebagai **flash** dan kembali ke halaman sebelumnya — pengguna nampak mesej mesra, bukan halaman ralat berserabut.

---

## Cara Menjalankan Aplikasi

```bash
# 1. Pasang semua pakej (termasuk multer)
npm install

# 2. Sediakan fail persekitaran
cp .env.example .env
# (kemudian edit .env — isi MONGODB_URI dan SESSION_SECRET)

# 3. Isi data contoh (aduan + 2 tindakan susulan)
npm run seed

# 4. Jalankan dalam mod pembangunan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Cuba:
- Klik **Papan Pemuka** — lihat "Tindakan Susulan Terkini" (data dimuatkan dengan `populate`).
- Buka satu aduan — **rekod tindakan susulan** & **muat naik lampiran**.
- Klik **Analitik** — lihat carta kategori & trend bulan.

> **Nota:** `npm run seed` mencipta data aduan contoh **berserta 2 tindakan susulan** supaya papan pemuka & halaman butiran ada data untuk dipaparkan.

---

## Ringkasan Hari 4

Anda telah berjaya:

- ✅ Mencipta model **`Tindakan`** yang **berkaitan** dengan `Aduan` (`ObjectId` + `ref`)
- ✅ Merekod tindakan susulan yang boleh menukar status aduan
- ✅ Menggunakan **`populate()`** untuk memuatkan dokumen berkaitan
- ✅ Memuat naik fail lampiran dengan **multer** (`diskStorage`, `fileFilter`, had saiz)
- ✅ Memahami `enctype="multipart/form-data"`
- ✅ Membina halaman **analitik** dengan **aggregation pipeline** + **Chart.js**
- ✅ Menambah **error-handling middleware** untuk ralat muat naik

---

## Penutup

Tahniah! Anda kini boleh membina ciri yang lebih kaya — **hubungan data**, **muat naik fail**, dan **analitik** — di atas asas CRUD yang dipelajari pada Hari 1–3.

Ciri-ciri ini ialah **lanjutan / pilihan**, tetapi sangat berguna dalam aplikasi sebenar. Untuk mendalami lagi:

- **Penyimpanan fail:** untuk produksi, fail lebih elok disimpan di **storan awan** (AWS S3, Cloudinary) atau **GridFS** MongoDB, bukan cakera pelayan.
- **Aggregation:** terokai peringkat lain seperti `$match`, `$lookup` (join antara koleksi), `$project`, dan `$bucket`.
- **Prestasi:** tambah **index** pada medan yang kerap dicari (cth: `aduan` dalam `Tindakan`) untuk mempercepat carian hubungan.
- **Relationships:** belajar perbezaan antara **referencing** (yang kita guna) dan **embedding**, dan bila menggunakan setiap satu.

Selamat membina! 🚀
