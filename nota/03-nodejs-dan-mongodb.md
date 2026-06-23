# Nota Rujukan: Kenapa Node.js + MongoDB Bersama? Contoh Sistem Komersial

> Baca dahulu: [Nota 01 — Kenapa Node.js?](./01-kenapa-nodejs.md) dan [Nota 02 — Kenapa MongoDB?](./02-kenapa-mongodb.md)

## Kenapa Pasangan Node.js + MongoDB Sangat Popular?

Node.js dan MongoDB sering digunakan **bersama** kerana mereka "bercakap bahasa yang sama" — **JSON**.

| Sebab | Penerangan |
|-------|------------|
| **JSON dari hujung ke hujung** | Pelayar hantar JSON → Node.js proses objek JavaScript → MongoDB simpan dokumen JSON. **Tiada terjemahan** antara lapisan. |
| **Tiada *impedance mismatch*** | Dalam stack SQL, objek kod perlu "dipetakan" ke jadual/baris (ORM). Dengan Node + Mongo, objek = dokumen. |
| **Mongoose (ODM)** | Pustaka **Mongoose** menyambungkan Node.js ke MongoDB dengan skema, validasi, dan model — seperti yang kita guna dalam kursus. |
| **Async sepadan** | Operasi MongoDB adalah tak segerak (asynchronous) — sepadan sempurna dengan model `async/await` Node.js. |
| **Pembangunan pantas** | Satu bahasa (JavaScript) + data JSON = pasukan bergerak laju, sesuai untuk startup & prototaip. |

---

## Stack Popular: MEAN / MERN / MEVN

Pasangan Node + MongoDB membentuk asas kepada beberapa *stack* web penuh (full-stack) yang terkenal:

| Stack | Komponen | Frontend |
|-------|----------|----------|
| **MEAN** | **M**ongoDB · **E**xpress · **A**ngular · **N**ode.js | Angular |
| **MERN** | **M**ongoDB · **E**xpress · **R**eact · **N**ode.js | React |
| **MEVN** | **M**ongoDB · **E**xpress · **V**ue · **N**ode.js | Vue |

> Dalam **ketiga-tiga** stack, lapisan belakang (backend) ialah **Express + Node.js**, dan pangkalan data ialah **MongoDB**. Hanya rangka kerja frontend yang berbeza. Kursus ini menggunakan **EJS** (server-rendered) sebagai ganti SPA frontend, tetapi backend + pangkalan datanya sama.

### Aliran data JSON hujung ke hujung

```
Pelayar (borang/JSON)
        │  HTTP
        ▼
Express + Node.js  ──►  objek JavaScript { ... }
        │  Mongoose
        ▼
MongoDB  ──►  dokumen JSON/BSON { ... }
```

---

## Bila Guna Kombinasi Node.js + MongoDB

✅ **REST API & backend SPA** — aplikasi web/mudah alih moden.

✅ **Aplikasi masa nyata** — sembang, notifikasi, papan pemuka langsung.

✅ **Sistem CRUD & portal** — sistem tempahan, inventori, **portal aduan** (seperti projek kursus ini).

✅ **Prototaip & MVP** — bergerak pantas dengan satu bahasa.

✅ **Sistem kandungan & e-dagang** — katalog produk, artikel, profil pengguna.

---

## Contoh Sistem Komersial Sebenar

### Syarikat yang menggunakan Node.js

| Syarikat | Penggunaan Node.js | Hasil dilaporkan |
|----------|--------------------|------------------|
| **Netflix** | Antara muka pengguna (UI) & lapisan penstriman | Masa permulaan (startup) berkurang ~**70%** |
| **PayPal** | Membina semula aplikasi web (dari Java) | Pasukan **2** vs 5 orang, kod separuh lebih pendek, respons **35%** lebih laju |
| **LinkedIn** | Backend aplikasi mudah alih | Lebih cekap & boleh skala di bawah trafik tinggi |
| **Uber** | Sistem pemadanan pemandu–penumpang masa nyata | Mengendalikan jumlah data besar secara berterusan |
| **Walmart, eBay, NASA, Trello, Medium** | Backend, API, alat dalaman | Antara pengguna Node.js yang dilaporkan secara awam |

### Syarikat yang menggunakan MongoDB

| Syarikat | Penggunaan MongoDB |
|----------|--------------------|
| **eBay** | Katalog produk & interaksi pelanggan (replica set hingga ~50 ahli untuk skala bacaan) |
| **Forbes** | Sistem kandungan (CMS) — menskala ke **120 juta+** pelawat unik sebulan ketika puncak |
| **Adobe** | Adobe Experience Manager — pengurusan kandungan digital |
| **SAP** | Komponen teras dalam tawaran Platform-as-a-Service (PaaS) |
| **Toyota, Verizon, Coinbase** | Antara pengguna MongoDB dalam pelbagai industri |

### Sistem yang menggunakan KEDUA-DUANYA (Node.js + MongoDB)

- **eBay** — dilaporkan menggunakan **Node.js** (backend/API) **dan** **MongoDB** (katalog) — contoh nyata gabungan ini pada skala besar.
- **Ekosistem MEAN/MERN** — ribuan startup, SaaS, dan aplikasi perusahaan dibina di atas gabungan ini kerana kepantasan pembangunan dan keserasian JSON.
- **Aplikasi masa nyata & portal moden** — banyak sistem tempahan, e-dagang, dan portal kerajaan/korporat menggunakan Express+Node.js dengan MongoDB sebagai pangkalan data.

> **Nota kejujuran:** Syarikat besar biasanya menggunakan **banyak** teknologi serentak (polyglot) — bukan Node.js atau MongoDB sahaja. Contoh di atas menunjukkan ia **terbukti dalam pengeluaran (production)** pada skala besar, bukan bahawa keseluruhan sistem mereka dibina dengan satu teknologi.

---

## Kaitan dengan Projek Kursus (Sistem Aduan KPDN)

Projek kursus ini menggunakan gabungan yang **sama** seperti sistem komersial di atas:

- **Express + Node.js** — backend & REST API
- **MongoDB + Mongoose** — pangkalan data
- **EJS** — paparan (server-rendered)

Dengan menyiapkan kursus ini, anda telah membina sebuah aplikasi menggunakan **stack yang digunakan oleh Netflix, PayPal, eBay, dan Forbes** — pada skala pembelajaran. Kemahiran yang sama boleh dikembangkan ke sistem sebenar.

---

## Sumber Rujukan

- [Top Companies That Use Node.js in Production — Toptal](https://www.toptal.com/external-blogs/youteam/top-companies-that-used-node-js-in-production)
- [How Netflix and PayPal did product transformation using Node.js — HackerNoon](https://hackernoon.com/how-netflix-and-paypal-did-product-transformation-using-node-js-22074e13caad)
- [15+ Popular Companies Using Node.js — Simform](https://www.simform.com/blog/companies-using-nodejs/)
- [MongoDB Case Studies & Customer Successes — FeaturedCustomers](https://www.featuredcustomers.com/vendor/mongodb/case-studies)
- [10 Real-World MongoDB Use Cases — CData](https://www.cdata.com/blog/mongodb-use-cases)
- Buku rujukan: _Node.js for Beginners_ — Ulises Gascón (Packt, 2024), Bab 1 & Bab 12.

---

Kembali ke [Nota 01](./01-kenapa-nodejs.md) · [Nota 02](./02-kenapa-mongodb.md) · [Indeks Nota](./README.md)
