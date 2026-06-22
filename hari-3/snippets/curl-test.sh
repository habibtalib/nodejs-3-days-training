#!/usr/bin/env bash
# curl-test.sh — uji semua titik akhir REST API Sistem Aduan KPDN.
# Pastikan pelayan berjalan dahulu: npm run dev
# Jalankan: bash snippets/curl-test.sh

BASE="http://localhost:3000/api/aduan"

echo "==> 1) GET senarai semua aduan"
curl -s "$BASE" | head -c 600
echo -e "\n"

echo "==> 2) POST cipta aduan baru"
CREATE=$(curl -s -X POST "$BASE" \
  -H "Content-Type: application/json" \
  -d '{
    "namaPengadu": "Ujian API",
    "noIc": "900101145566",
    "telefon": "0123456789",
    "kategori": "Barang Kawalan",
    "premis": "Stesen Minyak Laju",
    "lokasi": "KM5, Lebuhraya Utama, Kedah",
    "butiran": "Premis enggan menjual gas memasak bersubsidi."
  }')
echo "$CREATE"
echo ""

# Cuba ambil _id daripada respons (perlukan jq; jika tiada, langkau)
ID=$(echo "$CREATE" | sed -n 's/.*"_id":"\([a-f0-9]*\)".*/\1/p')
echo "ID aduan baru: $ID"
echo ""

if [ -n "$ID" ]; then
  echo "==> 3) GET satu aduan"
  curl -s "$BASE/$ID"
  echo -e "\n"

  echo "==> 4) PUT kemaskini status"
  curl -s -X PUT "$BASE/$ID" \
    -H "Content-Type: application/json" \
    -d '{"status":"Dalam Siasatan"}'
  echo -e "\n"

  echo "==> 5) DELETE padam aduan"
  curl -s -X DELETE "$BASE/$ID"
  echo -e "\n"
fi

echo "Selesai."
