# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **course material repository** for a 3-day beginner Node.js training course. Lecture notes are in **Bahasa Melayu**; code identifiers and comments are in **English**. The course project is a **Sistem Aduan Pengguna KPDN** (Consumer Complaint Management System) inspired by the Malaysian Ministry of Domestic Trade and Cost of Living (KPDN).

Unlike a typical single-app repo, each `hari-N/` folder is a **standalone, runnable snapshot** of the project at the end of that day. The folders are cumulative: hari-2 builds on hari-1, hari-3 builds on hari-2.

## Repository Structure

- `hari-{1..3}/README.md` — Full step-by-step lecture notes for each day (Bahasa Melayu)
- `hari-{1..3}/` — A complete, runnable Express app at that day's state
- `hari-{1..3}/snippets/` — Per-day lab folder: a `lab.md` exercise + helper files (e.g. `test-mongodb.js`, `curl-test.sh`, `api-requests.http`)
- `nota/` — Background concept notes (BM): why Node.js (Bab 1), why MongoDB (Bab 12), Node.js+MongoDB together + real commercial examples (Netflix/PayPal/eBay/Forbes). Reference notes, not hands-on steps.
- `slides/` — reveal.js presentation deck (`nodejs-training.html`) with vendored reveal.js under `slides/vendor/reveal/` (works from `file://`)

This layout mirrors the sibling `laravel-api` training repo (per-day `snippets/` labs + a vendored reveal.js deck).

## Tech Stack

- **Runtime:** Node.js · **Framework:** Express · **View engine:** EJS (+ express-ejs-layouts)
- **Database:** MongoDB (Atlas) via **Mongoose** · **Styling:** Tailwind CSS (CDN)
- **Helpers:** dotenv, method-override, express-session, connect-flash, nodemon

## Reference Book & Alignment

The course's **module structure and ordering are aligned to** the book **_Node.js for Beginners_** by Ulises Gascón (Packt, 2024, ISBN 978-1-80324-517-1), which is the course's reference text. The book has 4 Parts / 15 Chapters; the 3 days map to them:

- **Hari 1 → Bhg 1–2 (Bab 1–6):** Introduction to Node.js, Setting Up the Environment (nvm/REPL/DevTools), JavaScript Fundamentals, Asynchronous Programming, Core Libraries (CJS/ESM), External Modules & npm. (Also starts the Express/EJS project skeleton as a preview of Bab 9–10.)
- **Hari 2 → Bhg 2–3 (Bab 7–10):** Event-Driven Architecture (EventEmitter + raw HTTP server), Testing (intro), HTTP & REST APIs, Building Web Apps with Express (template engines/EJS, routing, middleware) — plus the Mongoose model + Create/Read CRUD build.
- **Hari 3 → Bhg 4 (Bab 11–15):** Project from Scratch, Data Persistence with MongoDB (full), and **intro-level** sections for Auth (Passport.js/JWT, Bab 13), Error Handling (Bab 14), and Security (Bab 15), plus Update/Delete, flash, dashboard, REST API, deploy.

Each `hari-N/README.md` opens with a **"Rujukan Buku"** mapping table. The root `README.md` has the full per-chapter coverage table under "Penjajaran dengan Buku Rujukan". Coverage levels: *Penuh* (taught & practised) vs *Pengenalan* (introduced with a pointer to the book chapter). When extending the course, preserve this book-aligned ordering and update the mapping tables.

## Course Progression (hands-on build)

1. **Hari 1** — Foundations (Bab 1–6) + setup (Node.js, npm, VS Code, MongoDB Atlas/local), then first Express server, EJS layout, MongoDB connection. App: layout + home page + DB connect.
2. **Hari 2** — Event-driven/HTTP/testing/REST concepts (Bab 7–9), then Express (Bab 10): Mongoose model (`Aduan`), MVC structure, Create + Read CRUD, validation, search, seeder.
3. **Hari 3** — Update + Delete (method-override), flash, status workflow, dashboard, JSON REST API, deployment; plus intro sections for auth, error handling, and security (Bab 13–15).

## Domain Model (Aduan)

Single main entity `Aduan` (English field names):

- `noAduan` (auto-generated, e.g. `ADN-2026-0001`, unique), `namaPengadu`, `noIc`, `telefon`, `email` (optional)
- `kategori` (enum: Harga Tidak Berpatutan / Barang Kawalan / Penyukatan & Penimbangan / Penipuan Pengguna / Kawalan Harga Raya / Lain-lain)
- `premis`, `lokasi`, `butiran`
- `status` (enum: Baru / Dalam Siasatan / Selesai / Ditolak, default Baru)
- timestamps (`createdAt`, `updatedAt`)

## Running a Snapshot

```bash
cd hari-1   # or hari-2 / hari-3
npm install
cp .env.example .env     # then fill MONGODB_URI
npm run dev              # nodemon
npm run seed             # (hari-2/hari-3) load sample data
```

## Language & Conventions

- **Lecture text & UI labels:** Bahasa Melayu (e.g. "Daftar Aduan", "Senarai Aduan", "Papan Pemuka")
- **Code:** English identifiers and comments. Variable names like `namaPengadu`, `noAduan`, `senaraiAduan` mix BM domain nouns where they map to UI/data fields — keep consistent with the existing model.
- Express conventions: MVC split (`models/`, `controllers/`, `routes/`, `views/`), async/await controllers, Mongoose schema validation.
- EJS uses `express-ejs-layouts` with `views/layout.ejs` as the master layout and `views/partials/` for navbar/flash/status.
