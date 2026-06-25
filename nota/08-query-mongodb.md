# Nota Rujukan: Senarai Pertanyaan MongoDB (Fokus Laporan)

> Selaras dengan **Bab 12 — Data Persistence with MongoDB**. Pertanyaan di bawah berdasarkan data kursus: koleksi **`aduans`** (model `Aduan`) dan **`tindakans`** (model `Tindakan`, Hari 4).

## Cara Menggunakan

- **MongoDB Compass** → tab **MONGOSH**, atau terminal `mongosh "<connection-string>"`. Guna sintaks `db.aduans...`.
- **Dalam kod Node.js (Mongoose)** → guna `Aduan.find(...)`, `Aduan.aggregate([...])`. **Pipeline aggregation adalah sama** dalam kedua-dua.

> Ingat: Mongoose menukar nama model kepada koleksi huruf kecil + jamak — `Aduan` → `aduans`, `Tindakan` → `tindakans`.

---

## 1. Pertanyaan Asas (Find)

```js
// Semua aduan
db.aduans.find()

// Tapis: hanya status "Baru"
db.aduans.find({ status: "Baru" })

// Tapis berbilang medan (DAN)
db.aduans.find({ status: "Baru", kategori: "Barang Kawalan" })

// Satu dokumen sahaja
db.aduans.findOne({ noAduan: "ADN-2026-0001" })

// Pilih medan tertentu sahaja (projection): 1 = papar, 0 = sembunyi
db.aduans.find({}, { noAduan: 1, namaPengadu: 1, status: 1, _id: 0 })

// Susun (1 = menaik, -1 = menurun) + had
db.aduans.find().sort({ createdAt: -1 }).limit(10)

// Langkau + had (pagination: halaman 2, 10 setiap halaman)
db.aduans.find().skip(10).limit(10)

// Kira bilangan
db.aduans.countDocuments({ status: "Selesai" })
```

**Setara dalam Mongoose:**
```js
await Aduan.find({ status: "Baru" }).sort({ createdAt: -1 }).limit(10);
await Aduan.countDocuments({ status: "Selesai" });
```

---

## 2. Operator Berguna untuk Laporan

```js
// Carian teks separa (regex), tidak case-sensitive
db.aduans.find({ namaPengadu: { $regex: "ahmad", $options: "i" } })

// Mana-mana satu (ATAU)
db.aduans.find({ $or: [{ status: "Baru" }, { status: "Dalam Siasatan" }] })

// Dalam senarai
db.aduans.find({ kategori: { $in: ["Barang Kawalan", "Penipuan Pengguna"] } })

// Julat tarikh (cth: sepanjang tahun 2026)
db.aduans.find({ createdAt: { $gte: ISODate("2026-01-01"), $lt: ISODate("2027-01-01") } })

// Medan wujud / tidak kosong (cth: ada email)
db.aduans.find({ email: { $exists: true, $ne: "" } })

// Ada lampiran (array tidak kosong)
db.aduans.find({ "lampiran.0": { $exists: true } })
```

| Operator | Maksud |
|----------|--------|
| `$gte` / `$lte` / `$gt` / `$lt` | lebih besar/kecil sama dengan |
| `$ne` | tidak sama dengan |
| `$in` / `$nin` | dalam / tiada dalam senarai |
| `$or` / `$and` | logik ATAU / DAN |
| `$regex` | padanan corak teks |
| `$exists` | medan wujud |

---

## 3. Laporan dengan Aggregation Pipeline

**Aggregation** ialah "talian paip" (pipeline) — data mengalir melalui beberapa peringkat (`$match`, `$group`, `$sort`, dll.). Inilah alat utama untuk **laporan**.

### 3.1 Bilangan aduan mengikut status
```js
db.aduans.aggregate([
  { $group: { _id: "$status", jumlah: { $sum: 1 } } },
  { $sort: { jumlah: -1 } }
])
// → [{ _id: "Selesai", jumlah: 120 }, { _id: "Baru", jumlah: 45 }, ...]
```

### 3.2 Bilangan aduan mengikut kategori
```js
db.aduans.aggregate([
  { $group: { _id: "$kategori", jumlah: { $sum: 1 } } },
  { $sort: { jumlah: -1 } }
])
```

### 3.3 Trend bulanan (kira ikut bulan)
```js
db.aduans.aggregate([
  { $group: {
      _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
      jumlah: { $sum: 1 }
  } },
  { $sort: { _id: 1 } }
])
// → [{ _id: "2026-01", jumlah: 30 }, { _id: "2026-02", jumlah: 41 }, ...]
```

### 3.4 Jadual silang: kategori × status
```js
db.aduans.aggregate([
  { $group: { _id: { kategori: "$kategori", status: "$status" }, jumlah: { $sum: 1 } } },
  { $sort: { "_id.kategori": 1, "_id.status": 1 } }
])
```

### 3.5 Peratus selesai (KPI)
```js
db.aduans.aggregate([
  { $group: {
      _id: null,
      jumlah: { $sum: 1 },
      selesai: { $sum: { $cond: [{ $eq: ["$status", "Selesai"] }, 1, 0] } }
  } },
  { $project: {
      _id: 0, jumlah: 1, selesai: 1,
      peratusSelesai: { $round: [{ $multiply: [{ $divide: ["$selesai", "$jumlah"] }, 100] }, 1] }
  } }
])
// → [{ jumlah: 165, selesai: 120, peratusSelesai: 72.7 }]
```

### 3.6 Top 5 premis paling banyak diadu
```js
db.aduans.aggregate([
  { $group: { _id: "$premis", jumlah: { $sum: 1 } } },
  { $sort: { jumlah: -1 } },
  { $limit: 5 }
])
```

### 3.7 Laporan untuk julat tarikh tertentu ($match dahulu)
```js
db.aduans.aggregate([
  { $match: { createdAt: { $gte: ISODate("2026-01-01"), $lt: ISODate("2026-07-01") } } },
  { $group: { _id: "$kategori", jumlah: { $sum: 1 } } },
  { $sort: { jumlah: -1 } }
])
```

> **Petua prestasi:** letak `$match` **seawal mungkin** dalam pipeline supaya MongoDB menapis dahulu sebelum mengumpul.

---

## 4. Laporan Melibatkan Hubungan (`$lookup` / populate)

`$lookup` = "join" antara dua koleksi (`aduans` ↔ `tindakans`).

### 4.1 Setiap aduan + bilangan tindakan susulan
```js
db.aduans.aggregate([
  { $lookup: { from: "tindakans", localField: "_id", foreignField: "aduan", as: "tindakan" } },
  { $project: { noAduan: 1, namaPengadu: 1, status: 1, bilTindakan: { $size: "$tindakan" } } },
  { $sort: { bilTindakan: -1 } }
])
```

### 4.2 Aduan yang BELUM ada tindakan (perlu perhatian)
```js
db.aduans.aggregate([
  { $lookup: { from: "tindakans", localField: "_id", foreignField: "aduan", as: "tindakan" } },
  { $match: { tindakan: { $size: 0 } } },
  { $project: { noAduan: 1, namaPengadu: 1, status: 1 } }
])
```

### 4.3 Bilangan tindakan mengikut pegawai (beban kerja)
```js
db.tindakans.aggregate([
  { $group: { _id: "$pegawai", bilTindakan: { $sum: 1 } } },
  { $sort: { bilTindakan: -1 } }
])
```

> Dalam Mongoose, hubungan ringkas dibaca dengan `.populate()` (lihat Hari 4). `$lookup` digunakan apabila anda perlu **mengumpul/mengira** merentas koleksi dalam satu laporan.

---

## 5. Petua Prestasi: Indeks untuk Laporan

Laporan yang kerap menapis/menyusun medan tertentu jadi lebih laju dengan **indeks**:

```js
db.aduans.createIndex({ status: 1 })
db.aduans.createIndex({ kategori: 1 })
db.aduans.createIndex({ createdAt: -1 })
db.tindakans.createIndex({ aduan: 1 })
```

> **Nota:** medan `noAduan` sudah ada indeks unik (dari skema). Indeks mempercepat bacaan tetapi memperlahankan sedikit penulisan — buat indeks hanya untuk medan yang kerap ditapis/disusun.

---

## 6. Rujukan Pantas: mongosh ↔ Mongoose

| Tugas | mongosh (Compass) | Mongoose (Node.js) |
|-------|-------------------|---------------------|
| Cari | `db.aduans.find({status:"Baru"})` | `Aduan.find({ status: "Baru" })` |
| Kira | `db.aduans.countDocuments({...})` | `Aduan.countDocuments({...})` |
| Aggregate | `db.aduans.aggregate([...])` | `Aduan.aggregate([...])` |
| Join | `$lookup` dalam pipeline | `.populate()` atau `$lookup` |
| Tarikh | `ISODate("2026-01-01")` | `new Date("2026-01-01")` |

---

**Lihat juga:** [Nota 02 — Kenapa MongoDB?](./02-kenapa-mongodb.md) · [Indeks Nota](./README.md) · Controller `analitikController.js` (Hari 4) menggunakan pipeline 3.2 & 3.3.
