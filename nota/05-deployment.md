# Nota Rujukan: Deployment (Menaikkan Aplikasi ke Awan)

> Selaras dengan **Hari 3** kursus (langkah deploy) dan Bahagian 4 buku rujukan _Node.js for Beginners_.

## Apa itu Deployment?

**Deployment** ialah proses menaikkan aplikasi anda daripada komputer tempatan (`localhost`) ke **pelayan awam (hosting)** supaya orang lain boleh mengaksesnya melalui internet.

Untuk aplikasi **Express + MongoDB** seperti dalam kursus ini, kita perlukan **dua** komponen:
1. **Hosting aplikasi** — menjalankan kod Node.js anda (cth: Render, Railway).
2. **Hosting pangkalan data** — MongoDB (cth: **MongoDB Atlas** — sudah di awan).

---

## Konsep Penting Sebelum Deploy

| Konsep | Penerangan |
|--------|------------|
| **Environment variables** | Simpan rahsia (`MONGODB_URI`, `SESSION_SECRET`) di tetapan hosting — **bukan** dalam kod. |
| **PORT dinamik** | Guna `process.env.PORT \|\| 3000` — hosting akan tetapkan port sendiri. |
| **Build &amp; start command** | Hosting perlu tahu cara pasang (`npm install`) dan jalankan (`npm start`). |
| **Network Access (Atlas)** | Benarkan IP hosting (`0.0.0.0/0` untuk mula) supaya pelayan awam boleh sambung ke DB. |
| **`.gitignore`** | Jangan *commit* `node_modules` &amp; `.env` ke repositori. |

---

## Pilihan Platform Deployment

| Platform | Jenis | Sesuai untuk |
|----------|-------|--------------|
| **Render** | PaaS | Pemula — Web Service percuma, mudah, sokong Node + Docker *(disyorkan kursus)* |
| **Railway** | PaaS | Mudah, pengalaman pembangun yang baik |
| **Fly.io** | PaaS / kontena | Aplikasi global, berasaskan Docker |
| **Vercel** | Serverless | Terbaik untuk Next.js/serverless; Express boleh (sebagai *function*) |
| **VPS** (DigitalOcean, Linode, AWS EC2) | Pelayan maya | Kawalan penuh — guna **PM2** + **Nginx** (reverse proxy) |
| **Docker** + mana-mana host | Kontena | Persekitaran konsisten "build once, run anywhere" |

> **Nota:** Hampir semua platform di atas berpasangan dengan **MongoDB Atlas** sebagai pangkalan data terurus (managed) — anda tidak perlu uruskan pelayan MongoDB sendiri.

---

## Deployment di AWS (Amazon Web Services)

**AWS** ialah platform awan terbesar dengan banyak pilihan servis. Ia lebih berkuasa tetapi lebih **kompleks** — sesuai untuk sistem perusahaan atau berskala besar.

### Menjalankan Node.js di AWS

| Servis AWS | Jenis | Penerangan |
|------------|-------|------------|
| **Elastic Beanstalk** | PaaS | **Paling mudah** di AWS — auto provision, load balancing &amp; scaling untuk aplikasi Node.js |
| **App Runner** | Kontena terurus | Deploy terus dari GitHub atau imej Docker, auto-scale |
| **Lightsail** | VPS dipermudah | Pelayan maya mudah dengan harga tetap (ada *blueprint* Node.js) |
| **EC2** | Pelayan maya | Kawalan penuh — pasang Node + **PM2** + **Nginx** sendiri |
| **Lambda + API Gateway** | Serverless | Jalankan Express sebagai *function* (guna adapter `serverless-http`) |
| **ECS / Fargate** | Kontena | Orkestrasi Docker; **Fargate** = kontena tanpa server |
| **Amplify** | Full-stack | Hosting + backend serverless (sesuai frontend + API) |

### MongoDB di AWS

| Pilihan | Penerangan |
|---------|------------|
| **MongoDB Atlas (di AWS)** | Atlas boleh berjalan di infrastruktur AWS — MongoDB **terurus**, paling disyorkan |
| **Amazon DocumentDB** | Pangkalan data terurus AWS yang **serasi dengan MongoDB** (API-compatible) |
| **MongoDB di EC2** | Pasang MongoDB sendiri pada pelayan EC2 — kawalan penuh, tetapi urus sendiri |

> **Untuk pemula:** AWS mempunyai keluk pembelajaran yang **curam**. Mulakan dengan **Render + MongoDB Atlas** yang lebih mudah; berpindah ke AWS apabila anda perlukan skala, kawalan, atau keperluan *enterprise*. Cara paling mudah masuk AWS ialah **Elastic Beanstalk** (Node.js) berpasangan dengan **Atlas** atau **Amazon DocumentDB** (MongoDB).

---

## Langkah Umum Deploy (contoh: Render)

```text
1) Push projek ke GitHub  (.gitignore tolak node_modules & .env)
        │
2) MongoDB Atlas → Network Access → benarkan 0.0.0.0/0
        │
3) Render → New → Web Service → sambung repo GitHub
        │
4) Build: npm install   ·   Start: npm start
        │
5) Set environment variables: MONGODB_URI, SESSION_SECRET
        │
6) Deploy → buka URL awam → aplikasi anda kini dalam talian!
```

---

## Konsep Lanjutan (Untuk Diterokai)

- **Process manager (PM2)** — pastikan aplikasi mula semula automatik jika ranap (untuk VPS).
- **Reverse proxy (Nginx)** — uruskan HTTPS &amp; trafik (untuk VPS).
- **CI/CD** — *auto-deploy* setiap kali anda *push* ke GitHub (Render/Railway sokong secara lalai).
- **Health checks &amp; logs** — pantau status &amp; ralat aplikasi.
- **Scaling** — tambah instance apabila pengguna bertambah.

---

## Kaitan dengan Kursus

Pada **Hari 3**, kita deploy Sistem Aduan KPDN ke **Render** (percuma) dengan **MongoDB Atlas** sebagai pangkalan data — gabungan paling mudah untuk pemula menaikkan aplikasi Express ke internet.

---

**Lihat juga:** [Nota 04 — Pengurus Pakej](./04-pengurus-pakej.md) · [Indeks Nota](./README.md)
