# Slaid Kursus Node.js 3 Hari

Buka deck slaid reveal.js terus dalam pelayar:

```text
slides/nodejs-training.html
```

## Versi PowerPoint / Google Slides

Tersedia juga versi **`.pptx`** yang **boleh disunting**:

```text
slides/nodejs-training.pptx
```

- **Google Slides:** buka Google Slides → **File → Import slides** → muat naik `nodejs-training.pptx`.
- **PowerPoint / Keynote:** buka terus fail `.pptx`.

> Nota: Dalam versi `.pptx`, blok kod dipaparkan sebagai teks *monospace* yang boleh disunting (tanpa penyerlahan warna seperti reveal.js). Untuk kekalkan penyerlahan, gantikan blok kod dengan tangkapan skrin dari deck reveal.js. **Deck reveal.js (`.html`) kekal sebagai sumber utama** untuk sesi teknikal.

### Menjana semula `.pptx`

Versi `.pptx` dijana dari deck `.html` menggunakan `slides/build-pptx.py`:

```bash
python3 -m venv venv && ./venv/bin/pip install python-pptx beautifulsoup4 lxml
./venv/bin/python slides/build-pptx.py   # tulis semula slides/nodejs-training.pptx
```

## Rangka Kerja (Framework)

Deck ini menggunakan reveal.js, yang disimpan secara tempatan (vendored) di bawah:

```text
slides/vendor/reveal/
```

Ini membolehkan deck berfungsi terus dari `file://` tanpa CDN atau pelayan pembangunan.

## Kawalan

- Anak panah kanan / bawah / Space: slaid seterusnya
- Anak panah kiri / atas: slaid sebelumnya
- Esc: gambaran keseluruhan slaid
- S: nota penceramah (speaker notes)
- Ctrl/Cmd + F: carian
- Alt + klik: zum

## Kandungan Deck (41 slaid)

| Bahagian | Tajuk |
|----------|-------|
| Pembuka | Gambaran kursus, **pengajar &amp; portfolio**, hasil pembelajaran, rentak kelas, peta jalan, tech stack |
| Konsep | **Kenapa Node.js** (perbandingan teknologi) · **bila guna Node.js** · **kenapa MongoDB** (SQL vs NoSQL) · **bila guna MongoDB** · kenapa kedua-duanya · **contoh sistem komersial** · entiti `Aduan` |
| Hari 1 | **Node.js vs Laravel**, persediaan, **persediaan Windows tempatan**, asas JavaScript, **konvensyen penamaan**, pelayan Express, **pengurus pakej (npm/pnpm/Yarn/Bun)**, EJS + layout, sambungan MongoDB |
| Hari 2 | Corak MVC, model Mongoose, controller (Cipta + Baca), susunan laluan, borang/validasi/seeder |
| Hari 3 | method-override, mesej flash, papan pemuka, REST API, ujian curl, deploy, **pilihan deployment**, **deployment di AWS**, peta CRUD↔HTTP |

## Eksport ke PDF

Buka deck dengan:

```text
slides/nodejs-training.html?print-pdf
```

Kemudian guna dialog cetak pelayar dan pilih "Save as PDF".
