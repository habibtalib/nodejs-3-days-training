# Tutorial: Persediaan Persekitaran Tempatan (Node.js + MongoDB) di Windows

Panduan lengkap untuk pelajar yang menggunakan **Windows** memasang persekitaran pembangunan di komputer sendiri (offline/tempatan). Ikut langkah di bawah, **atau** gunakan **pautan tutorial visual rasmi** (dengan tangkapan skrin) yang dilampirkan pada setiap bahagian.

> **Penanda 📸:** Langkah bertanda **📸** ialah skrin yang elok ditangkap untuk slaid/panduan bercetak. Pengajar boleh tambah tangkapan skrin sendiri, atau rujuk panduan visual rasmi yang dipautkan.

## Apa yang akan dipasang

| Perisian | Tujuan |
|----------|--------|
| **Node.js + npm** | Runtime JavaScript + pengurus pakej |
| **VS Code** | Editor kod |
| **MongoDB Community Server** | Pangkalan data tempatan |
| **MongoDB Compass** | Antara muka grafik (GUI) untuk lihat data |
| _(Pilihan)_ nvm-windows | Urus beberapa versi Node.js |

**Keperluan:** Windows 10/11 (64-bit) · ≥4GB RAM · ~2GB ruang cakera · kebenaran **Administrator**.

---

## Bahagian 1: Pasang Node.js

1. Layari **<https://nodejs.org/en/download>** dan muat turun pemasang **LTS** untuk **Windows Installer (.msi, 64-bit)**.
   > 📸 Halaman muat turun nodejs.org
2. Jalankan fail `.msi`:
   - Terima lesen → **Next**.
   - Pastikan **Add to PATH** ditandakan → **Next** → **Install**.
   > 📸 Skrin pemasang (bahagian *Add to PATH*)
3. Buka **PowerShell** (atau Command Prompt) dan sahkan:
   ```bash
   node -v
   npm -v
   ```
   > 📸 Output versi dalam PowerShell

**Alternatif pantas (winget):** jika anda ada Windows Package Manager:
```powershell
winget install OpenJS.NodeJS.LTS
```

> 📘 **Panduan visual rasmi (dengan tangkapan skrin):**
> - [Microsoft Learn — Set up Node.js on native Windows](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows)
> - [GeeksforGeeks — Install Node.js on Windows](https://www.geeksforgeeks.org/installation-guide/install-node-js-on-windows/)
> - [phoenixNAP — Install Node.js and NPM on Windows](https://phoenixnap.com/kb/install-node-js-npm-on-windows)

---

## Bahagian 2: Pasang VS Code

1. Muat turun pemasang **Windows (User Installer, 64-bit)** dari **<https://code.visualstudio.com/download>**.
   > 📸 Halaman muat turun VS Code
2. Semasa pasang, tandakan **Add to PATH** dan **Open with Code**.
3. Buka VS Code → tab **Extensions** → pasang: **ESLint**, **Prettier**, **EJS language support**, **DotENV**, **MongoDB for VS Code**.
   > 📸 Tab Extensions dengan sambungan dipasang

> 📘 **Panduan rasmi:** [VS Code — Setup on Windows](https://code.visualstudio.com/docs/setup/windows)

---

## Bahagian 3 (Pilihan): nvm-windows — Urus Versi Node.js

Jika anda perlu bertukar antara beberapa versi Node.js:

1. Muat turun pemasang dari **[github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows/releases)** (`nvm-setup.exe`).
2. Selepas pasang:
   ```powershell
   nvm install lts
   nvm use lts
   node -v
   ```

> Letak fail `.nvmrc` (mengandungi nombor versi) dalam projek supaya pasukan guna versi sama.

---

## Bahagian 4: Pasang MongoDB Community Server + Compass (Tempatan)

1. Layari **<https://www.mongodb.com/try/download/community>**. Pilih **Version** terkini, **Platform: Windows**, **Package: msi** → **Download**.
   > 📸 Halaman muat turun MongoDB Community Server
2. Jalankan fail `.msi`:
   - Terima lesen → pilih jenis **Complete**.
   - Tandakan **Install MongoDB as a Service** (*Run service as Network Service user*) — supaya MongoDB berjalan automatik.
   - Tandakan **Install MongoDB Compass**.
   > 📸 Skrin pemasang (*Install as a Service* + *Install Compass*)
3. Selepas siap, MongoDB berjalan di **`localhost:27017`**. Sahkan servisnya berjalan: buka **Services** (`services.msc`) → cari **MongoDB Server (MongoDB)** → status *Running*.
   > 📸 Tetingkap Services menunjukkan MongoDB *Running*
4. Buka **MongoDB Compass** → pada medan sambungan `mongodb://localhost:27017` → klik **Connect**.
   > 📸 MongoDB Compass selepas berjaya Connect
5. **Connection string** anda untuk kursus:
   ```
   mongodb://localhost:27017/aduan_kpdn
   ```

> 📘 **Panduan visual rasmi (dengan tangkapan skrin):**
> - [MongoDB Docs — Install MongoDB Community on Windows](https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/)
> - [MongoDB Docs — Download & Install Compass](https://www.mongodb.com/docs/compass/install/)
> - [TutorialsTeacher — Install MongoDB (Server, Shell, Compass) on Windows](https://www.tutorialsteacher.com/mongodb/install-mongodb)

---

## Bahagian 5: Sahkan Persediaan (Jalankan Projek Kursus)

1. Dapatkan kod kursus (clone atau muat turun ZIP), kemudian:
   ```bash
   cd hari-1
   npm install
   copy .env.example .env
   ```
2. Buka `.env` dan tetapkan sambungan **tempatan**:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/aduan_kpdn
   ```
3. Uji sambungan MongoDB:
   ```bash
   node snippets/test-mongodb.js
   ```
   Anda sepatutnya nampak **`✅ Sambungan berjaya!`**.
4. Jalankan aplikasi:
   ```bash
   npm run dev
   ```
   Buka **<http://localhost:3000>** — aplikasi sepatutnya muncul, dan terminal menunjukkan **`✅ Berjaya sambung ke MongoDB`**.
   > 📸 Pelayar memaparkan halaman utama + terminal "Berjaya sambung"

---

## Masalah Biasa (Troubleshooting)

| Masalah | Penyelesaian |
|---------|--------------|
| `node` / `npm` tidak dikenali | Tutup &amp; buka semula terminal; jika masih gagal, *restart* komputer (PATH belum dimuatkan) |
| Gagal sambung MongoDB tempatan | Pastikan servis **MongoDB Server** *Running* dalam `services.msc` |
| `Port 3000 is already in use` | Tukar `PORT` dalam `.env` (cth: `PORT=4000`) atau tutup aplikasi lain |
| `MONGODB_URI undefined` | Pastikan fail `.env` wujud &amp; `require('dotenv').config()` di baris paling atas |
| Compass tidak boleh Connect | Sahkan MongoDB berjalan; cuba `mongodb://127.0.0.1:27017` |

---

## Senarai Tangkapan Skrin Diperlukan

Untuk penyedia bahan kursus — tangkap skrin bagi setiap skrin berikut:

| # | Skrin |
|---|-------|
| 1 | Muat turun Node.js (nodejs.org) |
| 2 | Pemasang Node.js (*Add to PATH*) |
| 3 | Output `node -v` / `npm -v` |
| 4 | Muat turun VS Code |
| 5 | Tab Extensions VS Code |
| 6 | Muat turun MongoDB Community Server |
| 7 | Pemasang MongoDB (*Service* + *Compass*) |
| 8 | Services menunjukkan MongoDB *Running* |
| 9 | MongoDB Compass selepas Connect |
| 10 | Aplikasi berjalan (pelayar + terminal) |

---

## Rujukan Tutorial Web (Semua Ada Tangkapan Skrin)

| Topik | Pautan |
|-------|--------|
| Node.js di Windows (rasmi MS) | <https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-windows> |
| Node.js di Windows (GeeksforGeeks) | <https://www.geeksforgeeks.org/installation-guide/install-node-js-on-windows/> |
| VS Code di Windows (rasmi) | <https://code.visualstudio.com/docs/setup/windows> |
| nvm-windows | <https://github.com/coreybutler/nvm-windows> |
| MongoDB Community di Windows (rasmi) | <https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-windows/> |
| MongoDB Compass (rasmi) | <https://www.mongodb.com/docs/compass/install/> |
| MongoDB di Windows (TutorialsTeacher) | <https://www.tutorialsteacher.com/mongodb/install-mongodb> |
| _(Alternatif awan)_ MongoDB Atlas | <https://www.mongodb.com/docs/atlas/getting-started/> |

> **Nota:** Tutorial ini fokus pada **MongoDB tempatan** (offline). Jika kelas ada internet stabil, **MongoDB Atlas** (awan) lebih mudah — lihat bahagian *Persediaan* dalam [`hari-1/README.md`](../hari-1/) (Pilihan A).

---

**Lihat juga:** [Nota 04 — Pengurus Pakej](./04-pengurus-pakej.md) · [Nota 05 — Deployment](./05-deployment.md) · [Indeks Nota](./README.md)
