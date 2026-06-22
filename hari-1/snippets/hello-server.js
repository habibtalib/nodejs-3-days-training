// hello-server.js
// Contoh pelayan Express paling minimum (Langkah 2).
// Jalankan secara berasingan untuk faham asas sebelum bina struktur penuh:
//   node snippets/hello-server.js

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Helo KPDN! Pelayan Express anda berjalan.');
});

app.get('/masa', (req, res) => {
  res.send('Masa pelayan sekarang: ' + new Date().toLocaleString('ms-MY'));
});

app.listen(3000, () => {
  console.log('Pelayan di http://localhost:3000');
});
