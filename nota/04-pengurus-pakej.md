# Nota Rujukan: Pengurus Pakej & Alat CLI (npm, pnpm, Yarn, Bun, npx)

> Selaras dengan **Bab 6 — External Modules and npm** dalam buku rujukan _Node.js for Beginners_ (Ulises Gascón, Packt 2024).

## Apa itu Pengurus Pakej?

**Pengurus pakej (package manager)** ialah alat untuk **memasang, mengemaskini, dan mengurus** pustaka (library) pihak ketiga yang projek anda gunakan. Ia membaca fail **`package.json`**, memuat turun pakej ke folder **`node_modules/`**, dan mengunci versi tepat dalam fail **lock** (cth: `package-lock.json`).

```bash
npm install express        # tambah satu pakej
npm install                # pasang semua dari package.json
```

---

## Perbandingan Pengurus Pakej

| Alat | Pengeluar | Kekuatan | Fail lock |
|------|-----------|----------|-----------|
| **npm** | Node.js (lalai) | Datang **automatik** bersama Node.js · paling biasa · sokongan universal | `package-lock.json` |
| **Yarn** | Meta (Facebook) | Pantas · *workspaces* (monorepo) · Yarn Berry (PnP) | `yarn.lock` |
| **pnpm** | Komuniti | **Jimat cakera** (kongsi pakej via *hard link*) · pantas · ketat &amp; selamat | `pnpm-lock.yaml` |
| **Bun** | Oven | **Sangat pantas** · runtime + pemasang + bundler + penguji dalam satu | `bun.lockb` |

> **Nota tentang Bun:** Bun bukan sekadar pengurus pakej — ia juga **runtime JavaScript** (alternatif kepada Node.js sendiri), ditulis dalam bahasa Zig untuk kelajuan. Anda boleh guna `bun install` walaupun aplikasi anda berjalan di Node.js.

### Arahan setara antara alat

| Tugas | npm | Yarn | pnpm | Bun |
|-------|-----|------|------|-----|
| Mula projek | `npm init` | `yarn init` | `pnpm init` | `bun init` |
| Tambah pakej | `npm install pkg` | `yarn add pkg` | `pnpm add pkg` | `bun add pkg` |
| Pasang semua | `npm install` | `yarn` | `pnpm install` | `bun install` |
| Jalankan skrip | `npm run dev` | `yarn dev` | `pnpm dev` | `bun run dev` |

---

## npx — Jalankan Pakej Tanpa Pasang Global

**`npx`** (datang bersama npm) menjalankan binari sesuatu pakej **tanpa** memasangnya secara global — berguna untuk alat sekali guna:

```bash
npx create-express-app myapp   # jalankan terus, tanpa pasang dahulu
```

| npm | Yarn | pnpm | Bun |
|-----|------|------|-----|
| `npx <pkg>` | `yarn dlx <pkg>` | `pnpm dlx <pkg>` | `bunx <pkg>` |

---

## Yang Mana Patut Saya Guna?

- **Pemula / kursus ini:** gunakan **npm** — ia lalai, universal, dan semua tutorial menggunakannya.
- **Projek besar / monorepo:** pertimbangkan **pnpm** (jimat cakera) atau **Yarn** (workspaces).
- **Mahu kelajuan maksimum / projek baharu:** cuba **Bun**.

> **Penting:** Pilih **satu** pengurus pakej setiap projek (jangan campur) supaya hanya ada **satu** fail lock. Mencampur npm + yarn + pnpm dalam projek yang sama boleh menyebabkan konflik.

---

## Kaitan dengan Kursus

Kursus ini menggunakan **npm** sepanjang (`npm install`, `npm run dev`, `npm run seed`) kerana ia lalai dan paling mudah untuk pemula. Setelah selesa, anda boleh cuba `pnpm` atau `bun` untuk projek anda sendiri.

---

**Lihat juga:** [Nota 05 — Deployment](./05-deployment.md) · [Indeks Nota](./README.md)
