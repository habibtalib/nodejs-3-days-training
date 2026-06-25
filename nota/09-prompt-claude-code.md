# Nota Rujukan: Contoh Prompt Claude Code

> Pelengkap kepada [modul bonus *Bina dengan Claude Code*](../bonus-claude-code/). Nota ini mengumpulkan **contoh prompt** yang boleh anda guna semula untuk projek Sistem Aduan KPDN (Express + EJS + MongoDB).

> **Bahasa:** Claude Code faham Bahasa Melayu **dan** Bahasa Inggeris. Kekalkan **istilah teknikal** (controller, schema, middleware, populate) dalam Bahasa Inggeris supaya tepat.

---

## Prinsip Prompt yang Baik

| Prinsip | ❌ Lemah | ✅ Baik |
|---------|---------|--------|
| **Khusus** | "tambah carian" | "Tambah carian mengikut `noAduan` dan `namaPengadu` pada `controllers/aduanController.js` fungsi `index`, guna `$regex`" |
| **Beri konteks** | "ada ralat" | "Ralat `CastError` bila buka `/aduan/abc`. Lihat `show` dalam `aduanController.js`" |
| **Rujuk fail** | "ubah model" | "Dalam `models/Aduan.js`, tambah medan `tarikhSiasatan` jenis Date (tidak wajib)" |
| **Satu langkah** | "bina auth + email + laporan + carta" | Pecahkan kepada beberapa prompt kecil |
| **Nyatakan hasil** | "buat ia elok" | "Borang patut papar mesej ralat di atas setiap input yang gagal validasi" |

---

## Contoh Prompt Mengikut Tujuan

### A. Memahami kod (sebelum mengubah)

```text
Terangkan apa yang fungsi `dashboard` dalam controllers/aduanController.js
lakukan, langkah demi langkah.
```
```text
Lukiskan aliran data dari borang "Daftar Aduan" sehingga ia disimpan ke MongoDB
— fail mana yang terlibat?
```

### B. Bina ciri baharu (scaffold)

```text
Tambah medan `prioriti` (enum: Rendah/Sederhana/Tinggi, lalai Sederhana) pada
model Aduan. Papar ia dalam views/aduan/show.ejs dan benarkan ia dipilih dalam
borang create.ejs dan edit.ejs.
```
```text
Cipta satu entiti baharu `Pegawai` (nama, jawatan, negeri) dengan model,
controller, routes (CRUD), dan views EJS — ikut struktur sedia ada untuk Aduan.
```

### C. Debug ralat (beri mesej + konteks)

```text
Bila saya hantar borang daftar aduan, saya dapat ralat:
"ValidationError: noAduan is required".
Lihat models/Aduan.js dan controllers/aduanController.js — kenapa, dan betulkan.
```
```text
Halaman /analitik kosong dan console pelayar tunjuk "Chart is not defined".
Periksa views/analitik.ejs.
```

### D. Refactor & kemas

```text
Kemas controllers/aduanController.js: keluarkan logik bina pertanyaan carian
ke satu fungsi helper supaya tidak berulang. Jangan ubah kelakuan.
```
```text
Tukar semua callback dalam fail ini kepada async/await untuk kebolehbacaan.
```

### E. Validasi & keselamatan

```text
Tambah validasi: telefon mesti 10–11 digit, email mesti format sah.
Papar mesej ralat dalam Bahasa Melayu pada borang.
```
```text
Semak aplikasi untuk isu keselamatan asas (input tidak divalidasi, rahsia dalam
kod, header keselamatan) dan cadangkan pembetulan menggunakan helmet &
express-mongo-sanitize.
```

### F. Ujian (testing)

```text
Tulis ujian menggunakan node:test + supertest untuk sahkan:
GET /aduan pulangkan 200, dan POST /aduan dengan data sah mengalih (redirect)
ke senarai. Cipta fail test/aduan.test.js.
```

### G. Pangkalan data & pertanyaan (laporan)

```text
Tambah laluan GET /laporan/bulanan yang memaparkan bilangan aduan mengikut bulan
menggunakan MongoDB aggregation ($dateToString). Rujuk nota/08-query-mongodb.md.
```
```text
Tulis pertanyaan Mongoose untuk cari semua aduan berstatus "Baru" yang lebih
30 hari, disusun dari paling lama.
```

### H. Dokumentasi & komen

```text
Tambah komen JSDoc ringkas (Bahasa Melayu) pada setiap fungsi dalam
controllers/apiController.js. Jangan ubah logik.
```
```text
Kemas kini README.md untuk terangkan cara menjalankan seeder dan log masuk.
```

---

## Templat Prompt Boleh Guna Semula

Ganti bahagian `[...]`:

```text
Dalam fail `[laluan/fail]`, [tambah/ubah/betulkan] [apa] supaya [hasil yang
dikehendaki]. Ikut gaya kod sedia ada (camelCase, struktur MVC). Jangan ubah
[apa yang tidak patut disentuh].
```

```text
Saya dapat ralat ini: "[tampal mesej ralat penuh]" semasa [bila ia berlaku].
Lihat `[fail berkaitan]`, terangkan punca, dan betulkan.
```

```text
Bina [ciri] langkah demi langkah. Mulakan dengan model, kemudian controller,
routes, dan akhir sekali views. Tunjuk saya setiap fail sebelum teruskan.
```

---

## Petua & Pagar Keselamatan

- ✅ **Semak setiap perubahan** — baca kod, jangan terima membuta tuli.
- ✅ **`git commit` dahulu** sebelum prompt besar, supaya boleh undur (`git restore`).
- ✅ **Uji selepas setiap perubahan** — `npm run dev`, cuba dalam pelayar / API client.
- ✅ **Minta penjelasan** jika ragu: *"terangkan kenapa anda buat begini"*.
- ⚠️ **Jangan** kongsi rahsia (`.env`) dalam prompt; jangan terima pakej mencurigakan.
- 💡 **Satu ciri = satu (atau beberapa) prompt kecil** — lebih mudah disemak daripada satu prompt gergasi.

> **Ingat:** Claude Code mempercepat **penulisan**, tetapi **kefahaman, semakan, dan ujian** tetap tanggungjawab anda. Kemahiran Hari 1–4 yang menjadikan anda mampu menilai kod yang dihasilkan.

---

**Lihat juga:** [Modul Bonus — Bina dengan Claude Code](../bonus-claude-code/) (urutan prompt untuk bina sistem lengkap) · [Indeks Nota](./README.md)
