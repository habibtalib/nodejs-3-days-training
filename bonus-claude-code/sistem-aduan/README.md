# Sistem Aduan Pengguna KPDN — Versi Lengkap

Sistem **lengkap** yang dibina dalam modul bonus *[Bina dengan Claude Code](../README.md)*. Ia mengambil aplikasi Hari 3 (CRUD + REST API) dan menambah ciri **Bahagian 4 buku** yang sebelum ini hanya *pengenalan*:

| Ciri tambahan | Bab buku | Pakej |
|---------------|----------|-------|
| **Pengesahan & kebenaran** (log masuk kakitangan) | Bab 13 | `passport`, `passport-local`, `bcryptjs` |
| **Pengendalian ralat** (middleware 404/500, graceful shutdown) | Bab 14 | — |
| **Keselamatan** (header, kadar had, sanitasi NoSQL) | Bab 15 | `helmet`, `express-rate-limit`, `express-mongo-sanitize` |

## Apa yang berbeza daripada Hari 3?

- Paparan **awam**: sesiapa boleh lihat senarai & butiran aduan.
- Pengurusan (**daftar / edit / padam**) memerlukan **log masuk** kakitangan.
- Model **`User`** + Passport (strategi *local*) + kata laluan di-hash (`bcryptjs`).
- Middleware ralat berpusat + halaman **500** tersuai.
- Header keselamatan (`helmet`), had kadar log masuk, dan sanitasi input MongoDB.

## Struktur tambahan

\`\`\`
sistem-aduan/
├── config/passport.js          # strategi Passport local
├── middleware/
│   ├── auth.js                 # requireLogin
│   └── errorHandler.js         # notFound + errorHandler (500)
├── controllers/authController.js
├── models/User.js              # + bcryptjs
├── views/login.ejs
└── views/500.ejs
\`\`\`

## Cara Menjalankan

\`\`\`bash
npm install
cp .env.example .env       # isi MONGODB_URI + SESSION_SECRET
npm run seed               # data contoh + akaun admin
npm run dev
\`\`\`

Buka <http://localhost:3000>. Untuk mengurus aduan, log masuk:

- **Username:** \`admin\`
- **Kata laluan:** \`kpdn1234\`

> **Nota keselamatan (untuk produksi):** CSP \`helmet\` dimatikan kerana kita guna Tailwind CDN — untuk produksi, bina Tailwind secara tempatan & aktifkan CSP yang ketat. Gunakan juga *session store* sebenar (cth: \`connect-mongo\`) menggantikan MemoryStore lalai.
