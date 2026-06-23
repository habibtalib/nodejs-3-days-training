# Nota Rujukan: Konvensyen Penamaan (Naming Conventions) — Node.js & MongoDB

> Selaras dengan **Bab 3 — JavaScript Fundamentals (Naming conventions)** dalam buku rujukan _Node.js for Beginners_ (Ulises Gascón, Packt 2024).

## Kenapa Penamaan Penting?

- **Konsisten** → kod lebih mudah dibaca &amp; diselenggara.
- **Memudahkan kerja berpasukan** — semua orang faham gaya yang sama.
- **Kurang silap (bug)** akibat nama yang mengelirukan.

---

## Konvensyen dalam JavaScript / Node.js

| Jenis | Gaya | Contoh |
|-------|------|--------|
| Pemboleh ubah &amp; fungsi | `camelCase` | `namaPengadu`, `getAduanById()` |
| Kelas &amp; model | `PascalCase` | `Aduan`, `AduanController` |
| Pemalar &amp; *environment variable* | `UPPER_SNAKE_CASE` | `MONGODB_URI`, `MAX_RETRY` |
| Nama fail | `kebab-case` (umum) atau `PascalCase` (model) | `aduan-controller.js`, `Aduan.js` |
| Nama folder | huruf kecil, biasanya jamak | `controllers/`, `models/`, `routes/` |
| Boolean | awalan `is` / `has` / `should` | `isAktif`, `hasAccess` |

**Petua:**
- Guna nama **deskriptif** — `senaraiAduan` lebih baik daripada `data` atau `x`.
- Elak singkatan yang kabur.
- Gunakan **English** untuk identifier (kekalkan kata nama domain BM jika ia memetakan ke medan UI/data, cth: `namaPengadu`).

---

## Konvensyen dalam MongoDB / Mongoose

| Perkara | Gaya | Contoh |
|---------|------|--------|
| Medan dokumen (*field*) | `camelCase` | `namaPengadu`, `createdAt` |
| Nama model (dalam kod) | `PascalCase` (singular) | `Aduan` |
| Nama koleksi (*collection*) | huruf kecil, jamak (auto oleh Mongoose) | `aduans` |
| Kunci utama | `_id` (ObjectId, auto) | `_id` |

> **Nota:** Mongoose menukar nama model `Aduan` secara automatik kepada koleksi `aduans` (huruf kecil + jamak).

**Elak** dalam nama medan: bermula dengan `$`, mengandungi `.`, atau ada ruang.

---

## camelCase vs snake_case — Yang Mana?

| Konteks | Konvensyen lazim |
|---------|------------------|
| JavaScript / Node.js | `camelCase` |
| MongoDB (medan dokumen) | `camelCase` |
| SQL (lajur MySQL/PostgreSQL) | `snake_case` |

> **Kunci:** Dalam stack **Node.js + MongoDB**, gunakan **`camelCase` hujung ke hujung** — kerana dokumen MongoDB ialah objek JavaScript (JSON). Ini mengelak "terjemahan" antara lapisan kod dan pangkalan data.
>
> `snake_case` lebih lazim dalam dunia **SQL** (dan kadangkala dalam fail data/CSV eksport). **Yang paling penting: konsisten** — pilih **satu** gaya dan patuhinya untuk **seluruh** projek.

---

## Contoh dari Projek Kursus

Model `Aduan` menggunakan `camelCase` untuk semua medan — konsisten dengan kod JavaScript:

```js
const aduanSchema = new mongoose.Schema({
  noAduan: { type: String, unique: true },   // camelCase
  namaPengadu: { type: String, required: true },
  noIc: { type: String, required: true },
  createdAt: { type: Date },                  // dari timestamps
});

module.exports = mongoose.model('Aduan', aduanSchema); // PascalCase → koleksi 'aduans'
```

---

## Amalan Terbaik (Ringkasan)

- ✅ `camelCase` untuk **variable, function, dan medan MongoDB**.
- ✅ `PascalCase` untuk **kelas &amp; model**.
- ✅ `UPPER_SNAKE_CASE` untuk **pemalar &amp; environment variable**.
- ✅ Folder huruf kecil + jamak (`controllers/`, `models/`).
- ✅ Nama **deskriptif**, English, elak singkatan kabur.
- ✅ Boolean guna awalan `is` / `has` / `should`.
- ✅ Gunakan **ESLint + Prettier** untuk menguatkuasakan gaya secara automatik.
- ✅ **Konsisten** mengatasi pilihan peribadi — pilih satu gaya, patuhinya.

---

**Lihat juga:** [Nota 04 — Pengurus Pakej](./04-pengurus-pakej.md) · [Nota 05 — Deployment](./05-deployment.md) · [Indeks Nota](./README.md)
