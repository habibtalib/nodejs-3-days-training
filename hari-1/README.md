# Hari 1 — Panduan Bengkel: Sistem Aduan Pengguna KPDN

Panduan langkah demi langkah untuk memulakan pembinaan **Sistem Aduan Pengguna KPDN** menggunakan **Node.js**, **Express**, **EJS**, dan **MongoDB**. Pada akhir bengkel ini (lebih kurang 6 jam), anda akan mempunyai aplikasi web yang berjalan, memaparkan halaman menggunakan templat EJS, dan bersambung ke pangkalan data MongoDB (di awan **atau** tempatan pada Windows).

**Apa yang akan dipelajari & dibina (urutan mengikut buku, Bab 1–6):**
- **Asas:** apa itu Node.js & seni bina event loop (Bab 1)
- Persekitaran pembangunan lengkap pada **Windows** — Node.js, nvm, REPL, VS Code, MongoDB (Bab 2)
- Asas JavaScript penting untuk Node.js (Bab 3)
- Pengaturcaraan tak segerak: callback, promise, `async/await` (Bab 4)
- Modul: CommonJS vs ESM (Bab 5)
- Projek Node.js baharu dengan `package.json`, npm & skrip `dev` (Bab 6)
- **Mula bina projek** (pratonton Bab 9–10): pelayan Express, susun atur EJS + Tailwind, sambungan MongoDB, halaman 404

> **Nota untuk pemula:** Jangan risau jika ada istilah yang baharu. Setiap langkah diterangkan secara perlahan-lahan. Ikut satu demi satu dan uji selalu.

---

## Rujukan Buku

Hari 1 menjajarkan **Bahagian 1–2** buku _Node.js for Beginners_ (Ulises Gascón, Packt 2024).

| Bahagian dalam nota ini | Bab buku |
|-------------------------|----------|
| Pengenalan Node.js | Bab 1 — Introduction to Node.js |
| Persediaan (Node.js, nvm, REPL, VS Code, DevTools) | Bab 2 — Setting Up the Development Environment |
| Asas JavaScript | Bab 3 — JavaScript Fundamentals |
| Pengaturcaraan Tak Segerak | Bab 4 — Asynchronous Programming |
| Modul: CommonJS vs ESM | Bab 5 — Node.js Core Libraries |
| Mulakan Projek (npm & package.json) | Bab 6 — External Modules and npm |

> Bahagian membina rangka Express + EJS + MongoDB pada hujung Hari 1 ialah **pratonton Bab 9–10**, yang akan didalami pada Hari 2.

---

## Pengenalan Node.js (Bab 1)

Sebelum memasang apa-apa, mari fahami **apa itu Node.js** dan mengapa ia popular.

### Apa itu Node.js?

Node.js ialah **persekitaran runtime** yang membolehkan kita menjalankan kod **JavaScript di luar pelayar** — di komputer atau pelayan. Ia dibina di atas enjin **V8** (enjin JavaScript yang sama digunakan oleh Google Chrome).

Dengan Node.js, JavaScript bukan lagi hanya untuk "front-end" — kita boleh tulis **back-end** (pelayan web, API, alat baris arahan) menggunakan satu bahasa sahaja.

### Seni bina single-thread & event loop

Node.js menggunakan model **single-thread** (satu urutan utama) yang dipadankan dengan **event loop** dan **I/O tak menyekat (non-blocking I/O)**:

- **Single-thread** — hanya ada satu urutan utama yang memproses kod anda.
- **Non-blocking I/O** — operasi yang lambat (baca fail, pertanyaan pangkalan data, panggilan rangkaian) **tidak menyekat** urutan utama. Node.js menghantar kerja tersebut, terus memproses kerja lain, dan menerima hasil kemudian melalui **callback**.
- **Event loop** — gelung yang sentiasa menyemak "adakah ada kerja yang sudah siap?" dan memanggil callback yang berkaitan apabila ia selesai.

> **Analogi:** Bayangkan seorang pelayan restoran (single-thread). Daripada berdiri menunggu satu meja habis makan (menyekat), dia mengambil pesanan meja itu, terus melayan meja lain, dan kembali apabila makanan siap (event loop). Inilah sebab Node.js sangat cekap untuk aplikasi yang banyak operasi I/O.

### Versi Node.js & SemVer

Node.js menggunakan **Semantic Versioning (SemVer)** — format `MAJOR.MINOR.PATCH` (contoh `22.11.0`):

| Bahagian | Maksud |
|----------|--------|
| **MAJOR** | Perubahan besar yang mungkin tidak serasi ke belakang |
| **MINOR** | Penambahan ciri baharu (masih serasi) |
| **PATCH** | Pembaikan pepijat kecil |

- **LTS (Long Term Support)** — versi **nombor genap** (cth: 20.x, 22.x) yang disokong lama dan **disyorkan untuk produksi**.
- **Current** — versi terkini dengan ciri terbaharu, tetapi kurang stabil.

> **Konsep penting:** Untuk kursus & projek sebenar, sentiasa guna versi **LTS**. Kita akan pasang LTS pada langkah seterusnya.

---

## Persediaan (Bab 2)

Sebelum menulis kod, kita perlu pasang beberapa perisian dan sediakan pangkalan data. Bahagian ini sepadan dengan **Bab 2 — Setting Up the Development Environment**.

> **Keperluan sistem (Windows):** Windows 10/11 (64-bit), minimum **4GB RAM** (8GB disyorkan), **2GB** ruang cakera kosong, dan sambungan internet. Panduan ini ditulis untuk **Windows**, tetapi langkah yang sama terpakai untuk macOS/Linux. Anda perlukan akaun pengguna dengan kebenaran *Administrator* untuk memasang perisian.

> **📸 Penanda tangkapan skrin:** Langkah yang bertanda **📸 Tangkap skrin** memerlukan tangkapan skrin (screenshot) untuk dimasukkan ke dalam slaid / panduan bercetak. Setiap penanda menyatakan URL atau skrin yang perlu ditangkap. Senarai penuh ada di [hujung bahagian ini](#senarai-tangkapan-skrin-diperlukan).

### 1. Pasang Node.js (LTS) pada Windows

Node.js membolehkan kita menjalankan JavaScript di luar pelayar (di komputer/pelayan).

1. Layari [nodejs.org](https://nodejs.org/) dan muat turun pemasang **LTS** (Long Term Support) untuk **Windows Installer (.msi, 64-bit)**.
   > 📸 **Tangkap skrin:** halaman muat turun — <https://nodejs.org/en/download>
2. Jalankan fail `.msi` dan ikut pemasang:
   - Terima perjanjian lesen, klik **Next**.
   - Biarkan tetapan lalai — pastikan **Add to PATH** ditandakan — klik **Next** > **Install**.
   - Skrin *"Tools for Native Modules"* boleh dilangkau untuk kursus ini.
   > 📸 **Tangkap skrin:** skrin pemasang Windows (bahagian *Add to PATH*)
3. **npm** (Node Package Manager) akan dipasang secara automatik bersama Node.js.

Sahkan pemasangan dengan membuka **Command Prompt** atau **PowerShell** dan jalankan:

```bash
node -v
npm -v
```

Anda sepatutnya nampak nombor versi, contohnya:

```
v22.11.0
10.9.0
```

> 📸 **Tangkap skrin:** output `node -v` dan `npm -v` dalam PowerShell

> **Nota:** Jika arahan `node` tidak dikenali, tutup dan buka semula terminal. Jika masih gagal, mulakan semula (restart) komputer selepas pemasangan.

### 2. Pasang VS Code & Sambungan pada Windows

VS Code ialah editor kod percuma yang popular untuk Node.js.

1. Muat turun pemasang **Windows (User Installer, 64-bit)** dari [code.visualstudio.com](https://code.visualstudio.com/) dan pasang. Semasa memasang, tandakan **Add to PATH** dan **Open with Code** (menu konteks).
   > 📸 **Tangkap skrin:** halaman muat turun — <https://code.visualstudio.com/download>
2. Buka VS Code, pergi ke tab **Extensions** (ikon kotak di sebelah kiri), dan pasang sambungan berikut:

   | Sambungan | Tujuan |
   |-----------|--------|
   | ESLint | Semakan kualiti kod JavaScript |
   | Prettier | Pemformatan kod automatik |
   | EJS language support | Penyerlahan sintaks fail `.ejs` |
   | DotENV | Penyerlahan fail `.env` |
   | MongoDB for VS Code | Lihat & urus data MongoDB |

   > 📸 **Tangkap skrin:** tab Extensions dengan kelima-lima sambungan dipasang

### 3. Sediakan Pangkalan Data MongoDB

MongoDB ialah pangkalan data **NoSQL** (menyimpan data sebagai dokumen, bukan jadual). Anda boleh pilih **SALAH SATU** daripada dua cara:

| Pilihan | Bila digunakan |
|---------|----------------|
| **A — MongoDB Atlas (awan)** | Disyorkan untuk kursus. Tiada pemasangan, tetapi perlu internet. |
| **B — MongoDB tempatan (Windows)** | Untuk persekitaran tanpa internet stabil, atau jika anda mahu semuanya berjalan secara *offline* di komputer sendiri. |

> **Konsep penting:** Aplikasi membaca alamat sambungan daripada pemboleh ubah `MONGODB_URI` dalam fail `.env`. Jadi kedua-dua pilihan berfungsi sama — yang berbeza hanyalah *connection string* yang anda tampal pada Langkah 5.

#### Pilihan A: MongoDB Atlas (awan) — disyorkan

**Atlas** ialah perkhidmatan MongoDB di awan yang **percuma** untuk pembelajaran — tidak perlu pasang apa-apa di komputer.

1. Layari [mongodb.com/atlas](https://www.mongodb.com/atlas) dan daftar akaun percuma.
   > 📸 **Tangkap skrin:** halaman pendaftaran Atlas — <https://www.mongodb.com/atlas>
2. Cipta **Cluster** baharu:
   - Pilih pelan **M0 (Free)**.
   - Pilih pembekal awan (AWS) dan wilayah terdekat (contoh: Singapore).
   - Klik **Create Deployment**.
   > 📸 **Tangkap skrin:** skrin pemilihan cluster **M0 (Free)**
3. **Cipta Pengguna Pangkalan Data (Database User):**
   - Masukkan **username** (cth: `pelajar`) dan **password**.
   - **Catat password ini** — kita perlukan ia kemudian.
   - Klik **Create Database User**.
   > 📸 **Tangkap skrin:** borang *Database User*
4. **Network Access (Akses Rangkaian):**
   - Pergi ke menu **Network Access** > **Add IP Address**.
   - Untuk kursus ini, pilih **Allow Access from Anywhere** (`0.0.0.0/0`).
   - Klik **Confirm**.
   > 📸 **Tangkap skrin:** skrin *Network Access* dengan `0.0.0.0/0`
5. **Dapatkan Connection String:**
   - Pergi ke **Database** > klik butang **Connect** pada cluster anda.
   - Pilih **Drivers**.
   - Salin **connection string** yang dipaparkan, contohnya:
     ```
     mongodb+srv://pelajar:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Simpan dahulu — kita akan tampal ke fail `.env` pada Langkah 5.
   > 📸 **Tangkap skrin:** dialog **Connect > Drivers** yang memaparkan connection string

> **⚠️ Amaran keselamatan:** `0.0.0.0/0` membenarkan sesiapa sahaja menghubungi cluster anda. Ini OK untuk latihan, tetapi untuk projek sebenar hadkan kepada IP tertentu sahaja.

#### Pilihan B: MongoDB tempatan pada Windows

Pasang MongoDB terus di komputer Windows anda — sesuai jika tiada internet di kelas.

1. Layari [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community). Pilih **Version** terkini, **Platform: Windows**, **Package: msi**, kemudian **Download**.
   > 📸 **Tangkap skrin:** halaman muat turun **MongoDB Community Server** — <https://www.mongodb.com/try/download/community>
2. Jalankan fail `.msi` dan ikut pemasang:
   - Pilih jenis pemasangan **Complete**.
   - Tandakan **Install MongoDB as a Service** (*Run service as Network Service user*) — supaya MongoDB berjalan automatik setiap kali Windows dihidupkan.
   - Tandakan **Install MongoDB Compass** (alat GUI untuk melihat data).
   > 📸 **Tangkap skrin:** pemasang — pilihan *Install as a Service* + *Install Compass*
3. Selepas siap, MongoDB berjalan di `localhost:27017`. Buka **MongoDB Compass**, dan pada medan sambungan `mongodb://localhost:27017`, klik **Connect**.
   > 📸 **Tangkap skrin:** MongoDB Compass selepas berjaya **Connect**
4. **Connection string** anda untuk pilihan ini ialah:
   ```
   mongodb://localhost:27017/aduan_kpdn
   ```
   Simpan dahulu — kita akan tampal ke fail `.env` pada Langkah 5.

> **Nota:** Dengan MongoDB tempatan, **tidak perlu** *Network Access* atau *Database User* seperti Atlas. Jika gagal sambung, pastikan servis **"MongoDB Server (MongoDB)"** berstatus *Running* dalam **Services** (`services.msc`).

### 4. Alat Pembangunan Tambahan (nvm, REPL, DevTools)

Buku Bab 2 turut memperkenalkan tiga alat berguna untuk pembangun Node.js.

**a) nvm — urus berbilang versi Node.js**

`nvm` (Node Version Manager) membolehkan anda memasang dan bertukar antara beberapa versi Node.js pada mesin yang sama — berguna apabila projek berbeza memerlukan versi berbeza. Pada Windows, gunakan **nvm-windows** ([github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)).

```bash
nvm install --lts     # pasang versi LTS terkini
nvm list              # senarai versi yang dipasang
nvm use 22            # tukar kepada Node.js 22
```

> Anda boleh letak fail `.nvmrc` (mengandungi nombor versi, cth `22`) dalam projek supaya pasukan guna versi yang sama.

**b) Node REPL — uji JavaScript secara interaktif**

Taip `node` (tanpa nama fail) dalam terminal untuk masuk ke **REPL** (Read-Eval-Print Loop) — tempat mencuba kod JavaScript baris demi baris:

```bash
node
> 2 + 3
5
> const nama = 'KPDN'
> `Helo ${nama}`
'Helo KPDN'
> .exit
```

> REPL sesuai untuk menguji idea pantas sebelum menulisnya dalam fail.

**c) Chrome DevTools — panel Console**

Buka Chrome, tekan **F12** (atau klik kanan > *Inspect*), dan pergi ke tab **Console**. Anda boleh menjalankan JavaScript di sini dan melihat output `console.log()`. DevTools juga ada panel **Network** untuk memeriksa permintaan HTTP — berguna pada Hari 2 & 3 apabila kita uji pelayan & API.

### Senarai Tangkapan Skrin Diperlukan

Senarai gabungan untuk penyedia bahan kursus (slaid/panduan). Tangkap skrin bagi setiap URL/skrin berikut:

| # | Skrin / URL untuk tangkap skrin |
|---|---------------------------------|
| 1 | Muat turun Node.js — <https://nodejs.org/en/download> |
| 2 | Pemasang Node.js Windows (skrin *Add to PATH*) |
| 3 | Output `node -v` / `npm -v` dalam PowerShell |
| 4 | Muat turun VS Code — <https://code.visualstudio.com/download> |
| 5 | Tab Extensions VS Code (sambungan dipasang) |
| 6 | Pendaftaran MongoDB Atlas — <https://www.mongodb.com/atlas> |
| 7 | Atlas — pemilihan cluster **M0 (Free)** |
| 8 | Atlas — borang *Database User* |
| 9 | Atlas — *Network Access* (`0.0.0.0/0`) |
| 10 | Atlas — dialog **Connect > Drivers** (connection string) |
| 11 | Muat turun MongoDB Community Server — <https://www.mongodb.com/try/download/community> |
| 12 | Pemasang MongoDB Windows (*Service* + *Compass*) |
| 13 | MongoDB Compass selepas **Connect** (`mongodb://localhost:27017`) |

> Tangkapan skrin #1–#5 wajib untuk **semua** peserta. #6–#10 untuk Pilihan A (Atlas); #11–#13 untuk Pilihan B (tempatan).

---

## Asas JavaScript (Bab 3)

Sebelum mula, mari ulang kaji beberapa konsep JavaScript yang akan kita guna sepanjang kursus. Buku **Bab 3 — JavaScript Fundamentals** membincangkan topik ini dengan lebih mendalam (jenis data, nombor, tarikh, syarat, gelung, **array**, **objek**, dan **kelas/class**).

### Pemboleh ubah: `const` dan `let`

```js
const nama = 'Ahmad';   // nilai tetap, tidak boleh ditukar
let umur = 25;          // nilai boleh berubah
umur = 26;              // OK
```

> Guna `const` secara lalai. Hanya guna `let` jika nilai memang perlu berubah.

### Fungsi anak panah (arrow function)

```js
// Cara biasa
function tambah(a, b) {
  return a + b;
}

// Cara anak panah (lebih ringkas) — kita banyak guna ini
const tambah = (a, b) => a + b;
```

### Objek & template literal

```js
const pengguna = { nama: 'Siti', umur: 30 };
console.log(pengguna.nama); // Siti

// Template literal — guna backtick (`) dan ${...}
const ucapan = `Selamat datang, ${pengguna.nama}!`;
```

> **Petua:** Untuk kursus ini, fokus pada `const`/`let`, arrow function, objek, array, dan template literal. Konsep `async/await` dan modul kita asingkan ke bahagian seterusnya kerana ia sangat penting untuk Node.js.

---

## Pengaturcaraan Tak Segerak (Bab 4)

Banyak operasi dalam Node.js (baca fail, **pertanyaan pangkalan data**, panggilan rangkaian) mengambil masa. Kerana Node.js **single-thread**, kita tidak mahu "menunggu sambil menyekat". Sebaliknya kita gunakan pengaturcaraan **tak segerak (asynchronous)**. Buku **Bab 4 — Asynchronous Programming** membincangkannya secara mendalam. Terdapat tiga cara utama:

### 1) Callback (cara asal)

Fungsi yang dipanggil **selepas** sesuatu operasi selesai:

```js
setTimeout(() => {
  console.log('Dipaparkan selepas 1 saat');
}, 1000);
```

> Terlalu banyak callback bersarang menyebabkan *"callback hell"* — sukar dibaca. Itulah sebab `promise` diperkenalkan.

### 2) Promise

`Promise` mewakili nilai yang **akan** tersedia kemudian (berjaya atau gagal):

```js
sesuatuYangLambat()
  .then((hasil) => console.log(hasil))
  .catch((ralat) => console.error(ralat));
```

### 3) `async` / `await` (cara moden — kita banyak guna ini)

`async/await` menjadikan kod tak segerak **kelihatan seperti kod biasa** dan mudah dibaca:

```js
async function ambilData() {
  try {
    const hasil = await sesuatuYangLambat();
    console.log(hasil);
  } catch (ralat) {
    console.error(ralat);
  }
}
```

> **Konsep penting:** `await` hanya boleh digunakan di dalam fungsi `async`. Kita akan banyak guna corak ini untuk berbicara dengan MongoDB (cth: `await Aduan.find()`).

---

## Modul: CommonJS vs ESM (Bab 5)

Node.js membahagikan kod kepada **modul** (fail). Buku **Bab 5 — Node.js Core Libraries** menerangkan dua sistem modul: **CommonJS (CJS)** dan **ECMAScript Modules (ESM)**.

### CommonJS (CJS) — `require` & `module.exports`

Ini sistem **lalai** Node.js dan yang kita guna sepanjang kursus ini:

```js
// fail: math.js
function tambah(a, b) {
  return a + b;
}
module.exports = tambah;   // eksport supaya fail lain boleh guna
```

```js
// fail: server.js
const tambah = require('./math');   // import dari math.js
console.log(tambah(2, 3));          // 5
```

### ECMAScript Modules (ESM) — `import` & `export`

Sintaks moden yang sama seperti JavaScript pelayar. Untuk menggunakannya, tetapkan `"type": "module"` dalam `package.json` (atau guna sambungan fail `.mjs`):

```js
// fail: math.mjs
export function tambah(a, b) {
  return a + b;
}
```

```js
// fail: server.mjs
import { tambah } from './math.mjs';
console.log(tambah(2, 3));          // 5
```

> **Konsep penting:** CJS guna `require`/`module.exports`; ESM guna `import`/`export`. Kedua-duanya boleh berinteraksi (interoperability), tetapi **untuk kursus ini kita kekal dengan CommonJS** kerana ia paling biasa dalam tutorial Express & MongoDB.

---

## Langkah 1: Mulakan Projek (Bab 6 — npm & `package.json`)

Mari cipta folder projek dan mulakan projek Node.js. Bahagian ini sepadan dengan **Bab 6 — External Modules and npm**: `package.json` ialah fail yang menguruskan projek dan pakejnya, manakala **npm** ialah pengurus pakej untuk memasang modul luaran (seperti `express`).

### Cipta folder & masuk ke dalamnya

```bash
mkdir sistem-aduan-kpdn
cd sistem-aduan-kpdn
```

### Mulakan projek dengan npm

```bash
npm init -y
```

Arahan ini mencipta fail **`package.json`** — "kad pengenalan" projek anda. Ia menyimpan nama projek, versi, skrip, dan senarai pakej (dependencies) yang digunakan.

### Pasang Express & nodemon

```bash
npm install express
npm install --save-dev nodemon
```

- **express** — rangka kerja web (kita guna untuk bina pelayan).
- **nodemon** — alat pembangunan yang **memulakan semula pelayan secara automatik** setiap kali kita ubah kod. `--save-dev` bermaksud ia hanya untuk pembangunan, bukan produksi.

### Kemaskini `package.json`

Buka `package.json` dan pastikan ia mengandungi bahagian `scripts` seperti berikut. Gantikan keseluruhan fail dengan kandungan ini:

```json
{
  "name": "sistem-aduan-kpdn",
  "version": "1.0.0",
  "description": "Sistem Pengurusan Aduan Pengguna KPDN — Kursus Node.js 3 Hari (Hari 1: persediaan, Express, EJS, sambungan MongoDB)",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "keywords": ["nodejs", "express", "ejs", "mongodb", "kpdn", "kursus"],
  "author": "Habib — bespokesb.com",
  "license": "MIT",
  "dependencies": {
    "dotenv": "^16.4.5",
    "ejs": "^3.1.10",
    "express": "^4.19.2",
    "express-ejs-layouts": "^2.5.1",
    "mongoose": "^8.4.0"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

> **Nota:** Senarai `dependencies` di atas sudah termasuk pakej yang akan kita pasang pada Langkah 3 & 5 (`ejs`, `express-ejs-layouts`, `mongoose`, `dotenv`). Anda boleh pasang semuanya sekali gus sekarang dengan `npm install`, atau pasang satu demi satu mengikut langkah.

**Penerangan medan `package.json`:**

| Medan | Keterangan |
|-------|------------|
| `main` | Fail utama aplikasi (`server.js`) |
| `scripts.start` | Jalankan aplikasi untuk produksi (`node server.js`) |
| `scripts.dev` | Jalankan dengan nodemon untuk pembangunan |
| `dependencies` | Pakej yang diperlukan semasa aplikasi berjalan |
| `devDependencies` | Pakej untuk pembangunan sahaja (cth: nodemon) |

---

## Langkah 2: Pelayan Express Pertama

> 📘 **Pratonton:** Bahagian dari sini hingga akhir Hari 1 (Express, EJS, MongoDB, 404) ialah **pratonton Bab 9–10** buku. Kita memulakan rangka projek lebih awal supaya peserta dapat pengalaman *hands-on*; konsep HTTP, REST, dan Express akan **didalami pada Hari 2**.

Express ialah rangka kerja yang memudahkan kita mencipta pelayan web. Mari tulis pelayan paling asas.

Cipta fail **`server.js`** di root projek dengan kandungan sementara ini (kita akan kembangkan kemudian):

```js
const express = require('express');
const app = express();
const PORT = 3000;

// Laluan halaman utama
app.get('/', (req, res) => {
  res.send('Hello, Sistem Aduan KPDN!');
});

// Mulakan pelayan
app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
```

**Konsep penting:**

- **`express()`** — mencipta aplikasi Express.
- **`app.get('/', ...)`** — menentukan apa yang berlaku apabila pengguna melawat laluan `/` (halaman utama). Fungsi menerima dua objek: `req` (permintaan) dan `res` (respons).
- **`res.send(...)`** — menghantar respons kepada pelayar.
- **`app.listen(PORT, ...)`** — memulakan pelayan dan "mendengar" permintaan di port 3000.

### Jalankan pelayan

```bash
npm run dev
```

Anda sepatutnya nampak:

```
🚀 Pelayan berjalan di http://localhost:3000
```

Buka pelayar dan layari [http://localhost:3000](http://localhost:3000). Anda akan nampak teks **"Hello, Sistem Aduan KPDN!"**.

> **Nota:** Kerana kita guna nodemon (`npm run dev`), setiap kali anda simpan perubahan pada fail, pelayan akan dimulakan semula secara automatik. Tekan `Ctrl+C` untuk hentikan pelayan.

---

## Langkah 3: Enjin Paparan EJS

`res.send()` hanya menghantar teks ringkas. Untuk halaman web sebenar, kita perlukan **enjin templat** yang menjana HTML. Kita guna **EJS** (Embedded JavaScript).

Kita juga guna **express-ejs-layouts** supaya semua halaman boleh kongsi satu "rangka" (layout) yang sama — seperti kepala (head), bar navigasi, dan footer.

### Pasang EJS

```bash
npm install ejs express-ejs-layouts
```

### Cipta struktur folder paparan

```bash
mkdir views
mkdir views/partials
```

### Cipta fail susun atur `views/layout.ejs`

Susun atur ialah rangka HTML yang dikongsi semua halaman. `<%- body %>` ialah tempat kandungan setiap halaman akan dimasukkan.

```ejs
<!DOCTYPE html>
<html lang="ms">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><%= title %> — Sistem Aduan KPDN</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-100 text-slate-800 min-h-screen flex flex-col">

  <%- include('partials/navbar') %>

  <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-8">
    <%- body %>
  </main>

  <footer class="bg-slate-800 text-slate-300 text-center text-sm py-4">
    Sistem Aduan Pengguna KPDN &middot; Kursus Node.js 3 Hari &copy; 2026
  </footer>

</body>
</html>
```

**Konsep penting sintaks EJS:**

| Sintaks | Maksud |
|---------|--------|
| `<%= title %>` | Papar nilai pemboleh ubah (dilepaskan/escaped — selamat) |
| `<%- body %>` | Papar HTML mentah (tidak di-escape) — untuk kandungan halaman |
| `<%- include('partials/navbar') %>` | Masukkan fail separa (partial) lain |
| `<% ... %>` | Jalankan kod JavaScript tanpa memaparkan output |

> **Nota:** Kita guna **Tailwind CSS melalui CDN** (`<script src="https://cdn.tailwindcss.com">`). Ini paling mudah untuk pembelajaran — tidak perlu proses binaan. Untuk produksi sebenar, anda akan pasang Tailwind dengan betul.

### Cipta halaman utama `views/index.ejs`

```ejs
<div class="bg-white rounded-lg shadow p-8 text-center">
  <div class="text-5xl mb-4">🎉</div>
  <h1 class="text-3xl font-bold text-slate-800">Tahniah! Aplikasi Anda Berjalan</h1>
  <p class="text-slate-500 mt-2 max-w-xl mx-auto">
    Ini adalah halaman utama Sistem Aduan Pengguna KPDN yang dibina menggunakan
    <strong>Node.js</strong>, <strong>Express</strong>, dan <strong>EJS</strong>.
    Pada Hari 2 &amp; 3 kita akan tambah model, pangkalan data, dan operasi CRUD penuh.
  </p>

  <div class="mt-6 grid sm:grid-cols-3 gap-4 text-left">
    <div class="border border-slate-200 rounded p-4">
      <div class="text-2xl">⚙️</div>
      <h3 class="font-semibold mt-1">Express</h3>
      <p class="text-sm text-slate-500">Rangka kerja pelayan web untuk Node.js.</p>
    </div>
    <div class="border border-slate-200 rounded p-4">
      <div class="text-2xl">🖼️</div>
      <h3 class="font-semibold mt-1">EJS</h3>
      <p class="text-sm text-slate-500">Enjin templat untuk menjana HTML dinamik.</p>
    </div>
    <div class="border border-slate-200 rounded p-4">
      <div class="text-2xl">🍃</div>
      <h3 class="font-semibold mt-1">MongoDB</h3>
      <p class="text-sm text-slate-500">Pangkalan data NoSQL (lihat terminal — sudah bersambung).</p>
    </div>
  </div>
</div>
```

### Konfigurasi EJS dalam `server.js`

Kemaskini `server.js` untuk menggunakan EJS dan layout. Gantikan kandungan dengan:

```js
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3000;

// Tetapkan enjin paparan EJS + susun atur (layout)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Laluan halaman utama
app.get('/', (req, res) => {
  res.render('index', { title: 'Selamat Datang' });
});

app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
```

**Konsep penting:**

- **`app.set('view engine', 'ejs')`** — beritahu Express kita guna EJS.
- **`app.set('views', ...)`** — folder tempat fail paparan disimpan. `path.join(__dirname, 'views')` membina laluan penuh ke folder `views`.
- **`app.use(expressLayouts)` & `app.set('layout', 'layout')`** — guna `views/layout.ejs` sebagai rangka semua halaman.
- **`res.render('index', { title: ... })`** — papar `views/index.ejs` dan hantar data (`title`) ke paparan.

Simpan dan layari semula [http://localhost:3000](http://localhost:3000). Anda akan nampak halaman bergaya dengan Tailwind. (Bar navigasi akan kelihatan selepas Langkah 4.)

---

## Langkah 4: Fail Statik & Bar Navigasi

### Bar navigasi `views/partials/navbar.ejs`

Cipta fail bar navigasi yang dikongsi semua halaman:

```ejs
<nav class="bg-blue-800 text-white shadow">
  <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
    <a href="/" class="flex items-center gap-2 font-bold text-lg">
      <span class="bg-white text-blue-800 rounded px-2 py-0.5">KPDN</span>
      <span>Sistem Aduan Pengguna</span>
    </a>
    <div class="flex items-center gap-1 text-sm">
      <a href="/" class="px-3 py-2 rounded hover:bg-blue-700 <%= currentPath === '/' ? 'bg-blue-700' : '' %>">Utama</a>
    </div>
  </div>
</nav>
```

Perhatikan `<%= currentPath === '/' ? 'bg-blue-700' : '' %>` — ini menandakan pautan menu yang sedang aktif. Tetapi `currentPath` belum wujud lagi; mari sediakannya.

### Fail statik (CSS, imej) dengan `express.static`

Cipta folder untuk fail statik:

```bash
mkdir public
mkdir public/css
```

Kita boleh letak fail CSS tersuai di sini. Cipta `public/css/custom.css`:

```css
/* public/css/custom.css
   Fail CSS tersuai. Kebanyakan gaya datang dari Tailwind (CDN),
   tetapi anda boleh tambah gaya anda sendiri di sini. */

/* Contoh: penanda pautan aktif dalam navbar */
.nav-active {
  font-weight: 600;
}
```

### Kemaskini `server.js` (fail statik + currentPath)

```js
const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = 3000;

// Enjin paparan EJS + layout
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Middleware: fail statik dalam folder public
app.use(express.static(path.join(__dirname, 'public')));

// Jadikan laluan semasa tersedia di semua paparan (untuk penanda menu aktif)
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.get('/', (req, res) => {
  res.render('index', { title: 'Selamat Datang' });
});

app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
```

**Konsep penting — Middleware:**

- **Middleware** ialah fungsi yang berjalan **di antara** permintaan masuk dan respons keluar. Ia menerima `req`, `res`, dan `next`.
- **`express.static(...)`** — membolehkan pelayar mengakses fail dalam folder `public` (cth: `/css/custom.css`).
- **`res.locals.currentPath = req.path`** — `res.locals` ialah data yang tersedia di **semua** paparan. Kita simpan laluan semasa supaya navbar tahu menu mana yang aktif.
- **`next()`** — memberitahu Express untuk teruskan ke middleware/laluan seterusnya. **Jangan lupa panggil `next()`**, jika tidak permintaan akan tergantung.

Simpan dan muat semula pelayar. Bar navigasi biru kini muncul di atas halaman.

---

## Langkah 5: Sambung ke MongoDB

Sekarang masa untuk sambung aplikasi ke pangkalan data MongoDB Atlas yang kita sediakan tadi. Kita guna **Mongoose** (pustaka untuk bekerja dengan MongoDB) dan **dotenv** (untuk menyimpan kata laluan/rahsia dengan selamat).

### Pasang Mongoose & dotenv

```bash
npm install mongoose dotenv
```

### Cipta fail `.env`

Fail `.env` menyimpan maklumat sensitif (seperti connection string) supaya **tidak masuk ke dalam kod sumber**. Cipta fail `.env` di root projek:

**Jika anda guna Pilihan A (Atlas, awan):**

```
PORT=3000
MONGODB_URI=mongodb+srv://pelajar:KATALALUAN_ANDA@cluster0.xxxxx.mongodb.net/aduan_kpdn?retryWrites=true&w=majority
```

**Jika anda guna Pilihan B (MongoDB tempatan pada Windows):**

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/aduan_kpdn
```

> **Penting:**
> - Untuk Atlas: gantikan `pelajar`, `KATALALUAN_ANDA`, dan `cluster0.xxxxx` dengan maklumat **anda sendiri** dari MongoDB Atlas.
> - Perhatikan `/aduan_kpdn` — ini nama pangkalan data yang akan digunakan (untuk kedua-dua pilihan).
> - Untuk Atlas, jika kata laluan anda mengandungi simbol khas (seperti `@` atau `#`), ia perlu di-*encode* (cth: `@` menjadi `%40`). Sambungan tempatan tidak memerlukan kata laluan.

### Cipta fail `.env.example`

Kita simpan satu "templat" tanpa kata laluan sebenar, supaya orang lain tahu pemboleh ubah apa yang diperlukan. Cipta `.env.example`:

```
# Port pelayan aplikasi
PORT=3000

# Sambungan MongoDB Atlas
# Ganti <username>, <password>, dan nama cluster dengan maklumat anda sendiri.
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/aduan_kpdn?retryWrites=true&w=majority
```

### Cipta fail `.gitignore`

Fail `.gitignore` memberitahu Git untuk **mengabaikan** fail tertentu — kita TIDAK mahu `.env` (mengandungi kata laluan) dan `node_modules` (folder besar) masuk ke repositori. Cipta `.gitignore`:

```
node_modules/
.env
npm-debug.log*
.DS_Store
*.log
```

> **Konsep penting:** Jangan sesekali kongsi fail `.env` atau commit ke Git. Hanya `.env.example` (tanpa rahsia) yang boleh dikongsi.

### Cipta modul sambungan `config/db.js`

Mari asingkan logik sambungan ke fail tersendiri supaya kemas. Cipta folder `config` dan fail `db.js`:

```bash
mkdir config
```

`config/db.js`:

```js
// config/db.js
// Modul ini menguruskan sambungan ke pangkalan data MongoDB menggunakan Mongoose.

const mongoose = require('mongoose');

/**
 * Sambung ke MongoDB menggunakan connection string dari fail .env (MONGODB_URI).
 */
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Berjaya sambung ke MongoDB');
  } catch (error) {
    console.error('❌ Gagal sambung ke MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
```

**Konsep penting:**

- **`require('mongoose')`** — import pustaka Mongoose.
- **`async function` + `await mongoose.connect(...)`** — sambungan mengambil masa, jadi kita "tunggu" ia selesai.
- **`process.env.MONGODB_URI`** — membaca nilai dari fail `.env`.
- **`try...catch`** — jika sambungan gagal, kita tangkap ralat dan papar mesej.
- **`process.exit(1)`** — hentikan aplikasi jika gagal sambung (tiada guna teruskan tanpa pangkalan data).
- **`module.exports = connectDB`** — eksport fungsi supaya `server.js` boleh guna.

### Panggil `connectDB()` dalam `server.js`

Kemaskini `server.js` — tambah `require('dotenv').config()` di **baris paling atas** dan panggil `connectDB()`:

```js
// server.js
// Titik masuk utama aplikasi (Hari 1).
// Pada hari ini kita sediakan rangka Express + EJS dan sambung ke MongoDB.

// 1) Muatkan pemboleh ubah persekitaran dari fail .env (mesti paling atas).
require('dotenv').config();

const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// 2) Sambung ke pangkalan data MongoDB.
connectDB();

// 3) Tetapkan enjin paparan EJS + susun atur (layout).
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// 4) Middleware: fail statik (css, imej) dalam folder public.
app.use(express.static(path.join(__dirname, 'public')));

// Jadikan laluan semasa tersedia di semua paparan (untuk penanda menu aktif).
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// 5) Laluan halaman utama.
app.get('/', (req, res) => {
  res.render('index', { title: 'Selamat Datang' });
});

// 6) (Langkah 6 akan tambah halaman 404 di sini)

// 7) Mulakan pelayan.
app.listen(PORT, () => {
  console.log(`🚀 Pelayan berjalan di http://localhost:${PORT}`);
});
```

**Konsep penting:**

- **`require('dotenv').config()`** — **mesti di baris paling atas** supaya semua `process.env.XXX` tersedia sebelum digunakan.
- **`process.env.PORT || 3000`** — guna port dari `.env` jika ada, jika tidak guna 3000.

### Uji sambungan

Jalankan semula:

```bash
npm run dev
```

Anda sepatutnya nampak dalam terminal:

```
🚀 Pelayan berjalan di http://localhost:3000
✅ Berjaya sambung ke MongoDB
```

> **Penyelesaian masalah:**
> - **`bad auth`** → username/password dalam `MONGODB_URI` salah.
> - **`querySrv ENOTFOUND` / timeout** → semak Network Access di Atlas (pastikan `0.0.0.0/0` ditambah) dan sambungan internet anda.
> - **`MONGODB_URI undefined`** → pastikan `require('dotenv').config()` di baris paling atas dan fail `.env` wujud.

---

## Langkah 6: Halaman 404

Apa berlaku jika pengguna melawat laluan yang tidak wujud (cth: `/halaman-salah`)? Mari sediakan halaman ralat 404 yang kemas.

### Cipta `views/404.ejs`

```ejs
<div class="text-center py-16">
  <p class="text-6xl font-bold text-slate-300">404</p>
  <h1 class="text-2xl font-bold text-slate-700 mt-4">Halaman Tidak Dijumpai</h1>
  <p class="text-slate-500 mt-2">Maaf, halaman yang anda cari tidak wujud.</p>
  <a href="/" class="inline-block mt-6 bg-blue-700 text-white px-5 py-2 rounded hover:bg-blue-600">Kembali ke Utama</a>
</div>
```

### Tambah laluan "catch-all" dalam `server.js`

Tambah middleware ini **selepas semua laluan lain** (sebelum `app.listen`):

```js
// 6) Halaman 404 untuk laluan yang tidak wujud.
app.use((req, res) => {
  res.status(404).render('404', { title: 'Halaman Tidak Dijumpai' });
});
```

**Konsep penting:**

- Middleware ini diletak **paling akhir**. Jika tiada laluan lain yang padan dengan permintaan, Express sampai ke sini.
- **`res.status(404)`** — menetapkan kod status HTTP kepada 404 (Not Found).
- Susunan middleware **penting** — Express memproses dari atas ke bawah.

Uji dengan melayari [http://localhost:3000/halaman-salah](http://localhost:3000/halaman-salah). Anda sepatutnya nampak halaman 404.

---

## Cara Menjalankan Aplikasi

Ringkasan langkah untuk menjalankan projek dari awal (cth: jika anda salin folder `hari-1`):

```bash
# 1) Masuk ke folder projek
cd hari-1

# 2) Pasang semua pakej
npm install

# 3) Cipta fail .env dari templat, kemudian isi MONGODB_URI anda
cp .env.example .env

# 4) Jalankan pelayan (mod pembangunan dengan nodemon)
npm run dev
```

Kemudian buka [http://localhost:3000](http://localhost:3000).

| Arahan | Fungsi |
|--------|--------|
| `npm run dev` | Jalankan dengan nodemon (mula semula automatik) |
| `npm start` | Jalankan dengan node (untuk produksi) |
| `Ctrl + C` | Hentikan pelayan |

---

## Ringkasan Hari 1

Tahniah! Hari ini anda telah:

- [x] Memasang Node.js, npm, VS Code, dan menyediakan akaun MongoDB Atlas
- [x] Memahami asas JavaScript & modul CommonJS (`require` / `module.exports`)
- [x] Memulakan projek Node.js dengan `npm init` dan memahami `package.json`
- [x] Membina pelayan web Express pertama
- [x] Menyediakan enjin paparan EJS dengan susun atur dan Tailwind CSS
- [x] Menyajikan fail statik dan membina bar navigasi
- [x] Menyambung aplikasi ke pangkalan data MongoDB Atlas menggunakan Mongoose & dotenv
- [x] Membina halaman ralat 404 tersuai

**Struktur projek pada akhir Hari 1:**

```
hari-1/
├── server.js                 # Titik masuk aplikasi
├── package.json
├── .env                      # Rahsia (TIDAK dikongsi)
├── .env.example              # Templat tetapan
├── .gitignore
├── config/
│   └── db.js                 # Sambungan MongoDB
├── public/
│   └── css/custom.css        # Fail statik
└── views/
    ├── layout.ejs            # Rangka utama
    ├── index.ejs             # Halaman utama
    ├── 404.ejs               # Halaman ralat
    └── partials/
        └── navbar.ejs        # Bar navigasi
```

---

## Apa Seterusnya?

Pada **[Hari 2](../hari-2/)** (buku **Bahagian 2–3, Bab 7–10**), kita akan mendalami seni bina web Node.js dan membina ciri sebenar sistem aduan:

- **Seni bina dipacu peristiwa** & pelayan HTTP tulen (Bab 7), serta pengenalan **pengujian** (Bab 8)
- Konsep **HTTP & REST API** (Bab 9)
- **Express** secara mendalam — enjin templat/EJS, routing, middleware (Bab 10)
- Mencipta **model Mongoose** (`Aduan`) dan menyusun kod mengikut corak **MVC**
- Membina operasi **Cipta (Create)** dan **Baca (Read)** — borang daftar & senarai aduan, dengan **validasi**, **carian**, dan **seeder**

Jumpa lagi di Hari 2! 🚀
