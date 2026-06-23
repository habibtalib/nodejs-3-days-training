# Nota Rujukan: Kenapa MongoDB? Bila Guna MongoDB?

> Selaras dengan **Bab 12 — Data Persistence with MongoDB** dalam buku rujukan _Node.js for Beginners_ (Ulises Gascón, Packt 2024).

## Apa itu MongoDB?

**MongoDB** ialah pangkalan data **NoSQL** jenis **dokumen (document database)**. Daripada menyimpan data dalam **jadual, baris, dan lajur** (seperti pangkalan data SQL), MongoDB menyimpan data sebagai **dokumen** yang menyerupai **JSON**.

Contoh satu dokumen aduan dalam MongoDB:

```json
{
  "_id": "665f1a2b3c...",
  "noAduan": "ADN-2026-0001",
  "namaPengadu": "Ahmad bin Ismail",
  "kategori": "Harga Tidak Berpatutan",
  "status": "Baru",
  "createdAt": "2026-01-15T08:30:00Z"
}
```

> MongoDB menyimpan dokumen dalam format **BSON** (Binary JSON) — JSON yang dioptimumkan untuk kelajuan dan jenis data tambahan.

---

## Kenapa MongoDB Popular?

| Kekuatan | Penerangan |
|----------|------------|
| **Skema fleksibel** | Tidak perlu tetapkan struktur jadual dahulu. Setiap dokumen boleh berbeza — mudah apabila keperluan **berubah**. |
| **Semula jadi untuk JavaScript** | Dokumen JSON-like = objek JavaScript. Tiada "terjemahan" antara kod dan pangkalan data. |
| **Skala mendatar (horizontal scaling)** | Boleh **sharding** — sebar data ke banyak pelayan apabila data membesar. |
| **Pantas untuk baca/tulis** | Sesuai untuk aplikasi dengan banyak operasi data. |
| **Ketersediaan tinggi (replica set)** | Salinan data di beberapa pelayan — jika satu gagal, yang lain sambung. |
| **Mesra pembangun** | MongoDB Atlas (awan) + Compass (GUI) menjadikan ia mudah dipelajari & diurus. |

---

## SQL vs NoSQL — Perbandingan Asas

| Aspek | SQL (MySQL, PostgreSQL) | NoSQL Dokumen (MongoDB) |
|-------|-------------------------|--------------------------|
| **Struktur data** | Jadual, baris, lajur | Koleksi & dokumen (JSON) |
| **Skema** | Tetap & ketat (perlu ditakrif dahulu) | Fleksibel (boleh berubah bila-bila) |
| **Hubungan** | JOIN antara jadual | Dokumen bersarang atau rujukan |
| **Transaksi** | ACID kuat (tradisi) | Sokong transaksi multi-dokumen (versi moden) |
| **Skala** | Menegak (server lebih besar) | Mendatar (banyak server) mudah |
| **Sesuai untuk** | Data sangat berstruktur & relational | Data fleksibel, JSON, berkembang pantas |

> **Penting:** SQL dan NoSQL **bukan** "yang satu lebih baik". Ia alat berbeza untuk masalah berbeza. Banyak sistem moden malah **menggunakan kedua-duanya**.

---

## Bila SESUAI Guna MongoDB (Use Cases)

✅ **Skema yang berubah-ubah** — apabila struktur data mungkin berkembang (medan baharu ditambah dari masa ke masa).

✅ **Data berbentuk JSON** — aplikasi web/mudah alih yang bertukar data JSON (seperti REST API).

✅ **Prototaip pantas** — startup & projek baharu yang perlu bergerak laju tanpa reka bentuk skema yang kaku.

✅ **Sistem kandungan (CMS) & katalog** — artikel, produk, profil — data separa berstruktur.

✅ **Analitik masa nyata & log** — kemasukan data berkelajuan tinggi.

✅ **IoT & data sensor** — banyak penulisan, dokumen ringkas.

✅ **Data bersarang/hierarki** — pesanan dengan senarai item, profil dengan banyak medan.

---

## Bila KURANG Sesuai Guna MongoDB

⚠️ **Data sangat relational dengan banyak JOIN kompleks** — contoh: sistem perakaunan/lejar kewangan dengan transaksi merentas banyak jadual dan keperluan ACID yang sangat ketat. Pangkalan data **relational (PostgreSQL/MySQL)** selalunya lebih sesuai di sini.

> **Nota:** MongoDB moden **menyokong** transaksi multi-dokumen, jadi jurang ini semakin kecil — tetapi untuk kewangan teras, banyak organisasi masih memilih SQL.

---

## Kaitan dengan Projek Kursus (Sistem Aduan KPDN)

Satu **aduan** ialah satu **dokumen** dengan medan yang pelbagai (pengadu, kategori, status, premis, butiran). Kategori & medan mungkin **berkembang** mengikut keperluan agensi. MongoDB membenarkan kita simpan setiap aduan sebagai dokumen JSON yang fleksibel — sepadan dengan cara Node.js bekerja. Sebab itu ia dipilih untuk kursus ini.

---

**Seterusnya:** [Nota 03 — Kenapa Node.js + MongoDB bersama & contoh sistem komersial](./03-nodejs-dan-mongodb.md) · Kembali ke [Nota 01 — Kenapa Node.js?](./01-kenapa-nodejs.md)
