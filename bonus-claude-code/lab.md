# Lab Bonus — Bina Ciri dengan Claude Code

Dalam lab ini, anda akan menggunakan **Claude Code** untuk menambah satu **ciri baharu** pada Sistem Aduan KPDN — sambil mengamalkan kitaran **Rancang → Arah → Semak → Uji → Ulang**.

## Persediaan

1. Pasang Claude Code (jika belum):
   ```bash
   npm install -g @anthropic-ai/claude-code
   ```
2. Salin folder `sistem-aduan/` (atau `hari-3/`) ke folder kerja anda, `cd` ke dalamnya, dan pasang kebergantungan:
   ```bash
   npm install
   cp .env.example .env       # isi MONGODB_URI + SESSION_SECRET
   npm run seed
   ```
3. Mulakan Claude Code:
   ```bash
   claude
   ```

> **Sebelum mula:** jalankan `git init && git add -A && git commit -m "asas"` supaya anda boleh undur jika perlu.

---

## Pilih SATU cabaran

### Cabaran 1 (Mudah) — Tambah medan baharu

Tambah medan **`tarikhSiasatan`** (Date) pada aduan, papar dalam halaman butiran, dan benarkan ia diisi semasa edit.

> **Prompt cadangan:**
> "Dalam `models/Aduan.js`, tambah medan `tarikhSiasatan` jenis Date (tidak wajib). Papar nilainya dalam `views/aduan/show.ejs`, dan tambah input tarikh dalam `views/aduan/edit.ejs` supaya pegawai boleh kemas kini."

### Cabaran 2 (Sederhana) — Tapis API mengikut status

Tambah sokongan `GET /api/aduan?status=Baru` supaya REST API memulangkan hanya aduan berstatus tertentu.

> **Prompt cadangan:**
> "Dalam `controllers/apiController.js`, kemas kini fungsi `index` supaya membaca `req.query.status` dan menapis `Aduan.find()` mengikut status jika diberi. Pastikan tanpa parameter ia masih pulangkan semua."

### Cabaran 3 (Mencabar) — Eksport CSV

Tambah butang "Muat turun CSV" pada senarai aduan yang menjana fail CSV semua aduan.

> **Prompt cadangan:**
> "Tambah laluan `GET /aduan/eksport.csv` yang menjana fail CSV daripada semua aduan (lajur: noAduan, namaPengadu, kategori, status, tarikh). Tetapkan header `Content-Type` dan `Content-Disposition` yang betul. Tambah butang muat turun pada `views/aduan/index.ejs`."

---

## Kitaran kerja (untuk setiap cabaran)

1. **Rancang** — tulis dalam satu ayat apa hasil yang anda mahu.
2. **Arah** — beri prompt kepada Claude Code (rujuk cadangan di atas, atau tulis sendiri).
3. **Semak** — baca setiap perubahan. **Faham** kod itu. Tanya Claude: *"terangkan perubahan ini"* jika ragu.
4. **Uji** — jalankan `npm run dev`, cuba ciri itu dalam pelayar / API client.
5. **Ulang** — jika ada ralat atau tidak kemas, beri prompt susulan (cth: *"butang tidak muncul bila belum log masuk — betulkan"*).

---

## Senarai semak kendiri

- [ ] Ciri berfungsi seperti dijangka apabila diuji
- [ ] Saya **faham** setiap baris kod yang ditambah (bukan sekadar terima)
- [ ] Tiada rahsia (`.env`) ter-*commit* ke Git
- [ ] Kod mengikut gaya sedia ada (camelCase, struktur MVC)
- [ ] Saya cuba sekurang-kurangnya **satu prompt susulan** untuk memperbaiki hasil

---

## Renungan

Tulis 2–3 ayat:
- Apa yang **lebih pantas** dengan Claude Code?
- Bila anda perlu **membetulkan** atau **tidak bersetuju** dengan cadangan AI? (Di sinilah kefahaman Hari 1–3 penting.)

> **Pengajaran utama:** Claude Code mempercepat **penulisan** kod, tetapi **kefahaman, semakan, dan ujian** tetap tanggungjawab anda. Pembangun yang baik + AI = sangat produktif. AI tanpa kefahaman = risiko.
