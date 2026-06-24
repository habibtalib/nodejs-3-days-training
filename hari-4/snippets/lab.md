# Lab Hari 4 — Ciri Lanjutan (Hubungan, Muat Naik & Analitik)

Lab ini menguji kemahiran Hari 4: hubungan data (`populate`), muat naik fail (multer), dan analitik (aggregation + Chart.js).

## Persediaan

```bash
npm install              # termasuk multer
cp .env.example .env     # isi MONGODB_URI + SESSION_SECRET
npm run seed             # aduan contoh + 2 tindakan susulan
npm run dev
```

Buka <http://localhost:3000>.

## Latihan

### Latihan 1 — Rekod tindakan susulan (hubungan data)
Buka satu aduan, isi borang **Tindakan Susulan**: nama pegawai, catatan, dan pilih status baharu (cth: "Dalam Siasatan"). Hantar.
- Sahkan tindakan muncul dalam senarai pada halaman butiran.
- Sahkan **status aduan berubah** mengikut pilihan anda.

### Latihan 2 — Lihat `populate()` di papan pemuka
Buka **Papan Pemuka**. Bahagian "Tindakan Susulan Terkini" memaparkan **no. aduan & nama pengadu** — walaupun `Tindakan` hanya menyimpan **id** aduan. Inilah hasil `populate('aduan', 'noAduan namaPengadu')`. Klik pautan no. aduan untuk kembali ke butiran aduan.

### Latihan 3 — Muat naik lampiran
Pada halaman butiran aduan, guna borang **Lampiran / Bukti** untuk muat naik satu imej (JPG/PNG) atau PDF.
- Sahkan ia muncul sebagai pautan 📎 dan boleh dibuka.
- Cuba muat naik fail **bukan** imej/PDF (cth: `.txt`) — sahkan ia **ditolak** dengan mesej ralat (error handling berfungsi).

### Latihan 4 — Analitik
Buka **Analitik**. Perhatikan dua carta:
- **Bar** — aduan mengikut kategori.
- **Garis** — trend aduan mengikut bulan.

Daftar beberapa aduan baharu dalam kategori yang sama, kemudian *refresh* halaman analitik — sahkan carta berubah.

### Latihan 5 (Cabaran) — Carta ketiga: ikut status
Tambah satu lagi carta **"Aduan Mengikut Status"** pada halaman analitik.

> **Petua:**
> - Dalam `controllers/analitikController.js`, tambah satu aggregation: `{ $group: { _id: '$status', jumlah: { $sum: 1 } } }`.
> - Hantar `statusLabel` & `statusData` ke view.
> - Dalam `views/analitik.ejs`, tambah satu `<canvas>` + satu `new Chart(...)` jenis `'doughnut'` atau `'bar'`.

### Latihan 6 (Cabaran) — Tambah medan pada tindakan
Tambah medan `lokasiTindakan` (String) pada model `Tindakan`, papar dalam senarai tindakan, dan benarkan ia diisi melalui borang.

## Semakan kendiri

- [ ] Tindakan susulan berfungsi & boleh menukar status aduan
- [ ] `populate()` memaparkan no. aduan + nama pengadu di papan pemuka
- [ ] Muat naik fail berfungsi; fail jenis salah ditolak dengan mesej
- [ ] Halaman analitik memaparkan carta kategori & trend bulan
- [ ] Saya faham perbezaan antara **referencing** (`ref` + `populate`) dan menyimpan data terus
