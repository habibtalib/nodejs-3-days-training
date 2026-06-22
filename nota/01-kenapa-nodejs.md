# Nota Rujukan: Kenapa Node.js? Bila Guna Node.js?

> Selaras dengan **Bab 1 — Introduction to Node.js** dalam buku rujukan _Node.js for Beginners_ (Ulises Gascón, Packt 2024).

## Apa itu Node.js?

**Node.js** ialah *runtime* yang membolehkan kita menjalankan **JavaScript di luar pelayar** — iaitu di pelayan (server) atau komputer. Ia dibina di atas enjin **V8** (enjin JavaScript yang sama digunakan oleh Google Chrome).

Sebelum Node.js, JavaScript hanya berjalan dalam pelayar. Node.js membolehkan kita guna **satu bahasa (JavaScript)** untuk **frontend dan backend**.

---

## Kenapa Node.js Popular?

| Kekuatan | Penerangan |
|----------|------------|
| **Satu bahasa, depan & belakang** | Frontend (pelayar) dan backend (pelayan) guna JavaScript — pasukan tidak perlu tukar bahasa. |
| **Pantas (enjin V8)** | V8 menterjemah JavaScript terus ke kod mesin — sangat laju. |
| **I/O tak menyekat (non-blocking I/O)** | Node.js boleh mengendalikan **ribuan sambungan serentak** tanpa menunggu satu demi satu. Sesuai untuk aplikasi yang banyak *input/output* (baca/tulis pangkalan data, panggilan rangkaian). |
| **Event loop (satu utas)** | Model **dipacu peristiwa** yang ringan — tidak perlu satu *thread* untuk setiap pengguna. |
| **Ekosistem npm terbesar** | Lebih **2 juta** pakej percuma di [npmjs.com](https://www.npmjs.com/) — hampir setiap keperluan ada pakej sedia ada. |
| **Komuniti & sokongan korporat** | Disokong oleh **OpenJS Foundation**; digunakan oleh syarikat besar (lihat [Nota 03](./03-nodejs-dan-mongodb.md)). |

---

## Perbandingan Node.js dengan Teknologi Lain

| Teknologi | Bahasa | Model | Paling sesuai untuk |
|-----------|--------|-------|---------------------|
| **Node.js** | JavaScript | Event loop, non-blocking I/O | API, masa nyata (real-time), aplikasi banyak I/O, microservices |
| **PHP** (Laravel) | PHP | Permintaan segerak (request per process) | Laman web tradisional, CMS, sistem yang matang |
| **Python** (Django/Flask) | Python | Segerak (boleh async) | Sains data, AI/ML, automasi, web umum |
| **Java** (Spring) | Java | Multi-thread | Sistem perusahaan (enterprise) besar, perbankan |
| **Ruby** (Rails) | Ruby | Segerak | Prototaip pantas, startup, web umum |
| **Go** (Golang) | Go | Goroutine (concurrency) | Sistem prestasi tinggi, alat infrastruktur |
| **.NET** (C#) | C# | Multi-thread | Persekitaran Microsoft, perusahaan |

> **Ringkasnya:** Tiada teknologi "terbaik" untuk semua. Node.js **menyerlah** apabila aplikasi banyak melakukan **I/O** (baca/tulis data, banyak pengguna serentak) dan apabila pasukan mahu **satu bahasa** merentas keseluruhan aplikasi.

---

## Bila SESUAI Guna Node.js (Use Cases)

✅ **REST / GraphQL API** — backend untuk aplikasi mudah alih atau web (seperti projek kursus ini).

✅ **Aplikasi masa nyata (real-time)** — sembang (chat), notifikasi langsung, papan pemuka langsung, permainan dalam talian (guna WebSocket / Socket.io).

✅ **Backend untuk SPA** — Single-Page Applications (React, Vue, Angular).

✅ **Microservices** — perkhidmatan kecil yang ringan dan boleh skala secara berasingan.

✅ **Streaming** — penstriman video/audio/data (Netflix menggunakan Node.js untuk antara muka).

✅ **Aplikasi banyak I/O** — sistem tempahan, e-dagang, portal aduan, dashboard — banyak baca/tulis pangkalan data.

✅ **Alat baris arahan (CLI) & automasi** — banyak alat pembangun ditulis dengan Node.js.

✅ **Serverless / Functions** — AWS Lambda, Vercel, Azure Functions menyokong Node.js.

---

## Bila KURANG Sesuai Guna Node.js

⚠️ **Tugas berat CPU (CPU-bound)** — pemprosesan imej/video yang berat, latihan model AI/ML, kiraan saintifik yang besar. Kerana Node.js menggunakan **satu utas utama**, tugas berat boleh **menyekat** (block) semua pengguna lain.

> **Penyelesaian:** gunakan **Worker Threads**, baris gilir tugas (job queue), atau serahkan tugas berat kepada perkhidmatan/bahasa lain (Python untuk AI, Go untuk pemprosesan berat).

---

## Kaitan dengan Projek Kursus (Sistem Aduan KPDN)

Sistem aduan adalah aplikasi **banyak I/O**: borang dihantar, rekod disimpan/dibaca dari pangkalan data, senarai dipaparkan, carian dilakukan. **Tiada kiraan berat.** Inilah jenis aplikasi yang Node.js kendalikan dengan **cekap dan pantas** — sebab itu ia dipilih untuk kursus ini.

---

**Seterusnya:** [Nota 02 — Kenapa MongoDB?](./02-kenapa-mongodb.md) · [Nota 03 — Node.js + MongoDB & contoh sistem komersial](./03-nodejs-dan-mongodb.md)
