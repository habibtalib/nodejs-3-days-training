// controllers/aduanController.js
// Logik untuk setiap operasi CRUD aduan (paparan HTML).

const Aduan = require('../models/Aduan');

/**
 * Papar senarai semua aduan.
 * Menyokong carian (mengikut nama/no aduan/premis) dan tapisan status.
 */
exports.index = async (req, res) => {
  const { carian, status } = req.query;

  // Bina objek pertanyaan secara berperingkat.
  const pertanyaan = {};

  if (carian) {
    // $or: padankan mana-mana satu medan dengan katakunci (tidak case-sensitive).
    pertanyaan.$or = [
      { namaPengadu: { $regex: carian, $options: 'i' } },
      { noAduan: { $regex: carian, $options: 'i' } },
      { premis: { $regex: carian, $options: 'i' } },
    ];
  }

  if (status) {
    pertanyaan.status = status;
  }

  const senaraiAduan = await Aduan.find(pertanyaan).sort({ createdAt: -1 });

  res.render('aduan/index', {
    title: 'Senarai Aduan',
    senaraiAduan,
    carian: carian || '',
    status: status || '',
    STATUS: Aduan.STATUS,
  });
};

/**
 * Papar borang daftar aduan baru.
 */
exports.create = (req, res) => {
  res.render('aduan/create', {
    title: 'Daftar Aduan Baru',
    KATEGORI: Aduan.KATEGORI,
    nilai: {},
    ralat: null,
  });
};

/**
 * Simpan aduan baru ke pangkalan data.
 */
exports.store = async (req, res) => {
  try {
    await Aduan.create(req.body);
    req.flash('jaya', 'Aduan baru berjaya didaftarkan.');
    res.redirect('/aduan');
  } catch (error) {
    // Jika validasi Mongoose gagal, papar semula borang dengan mesej ralat.
    res.status(400).render('aduan/create', {
      title: 'Daftar Aduan Baru',
      KATEGORI: Aduan.KATEGORI,
      nilai: req.body,
      ralat: ambilRalat(error),
    });
  }
};

/**
 * Papar butiran penuh satu aduan.
 */
exports.show = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);

  if (!aduan) {
    req.flash('gagal', 'Aduan tidak dijumpai.');
    return res.redirect('/aduan');
  }

  res.render('aduan/show', { title: aduan.noAduan, aduan });
};

/**
 * Papar borang kemaskini aduan.
 */
exports.edit = async (req, res) => {
  const aduan = await Aduan.findById(req.params.id);

  if (!aduan) {
    req.flash('gagal', 'Aduan tidak dijumpai.');
    return res.redirect('/aduan');
  }

  res.render('aduan/edit', {
    title: `Kemaskini ${aduan.noAduan}`,
    aduan,
    KATEGORI: Aduan.KATEGORI,
    STATUS: Aduan.STATUS,
    ralat: null,
  });
};

/**
 * Kemaskini aduan sedia ada.
 */
exports.update = async (req, res) => {
  try {
    const aduan = await Aduan.findById(req.params.id);
    if (!aduan) {
      req.flash('gagal', 'Aduan tidak dijumpai.');
      return res.redirect('/aduan');
    }

    // Tetapkan nilai baru dan simpan (supaya validasi skema berjalan).
    aduan.set(req.body);
    await aduan.save();

    req.flash('jaya', 'Aduan berjaya dikemaskini.');
    res.redirect(`/aduan/${aduan.id}`);
  } catch (error) {
    const aduan = await Aduan.findById(req.params.id);
    res.status(400).render('aduan/edit', {
      title: `Kemaskini ${aduan.noAduan}`,
      aduan: { ...aduan.toObject(), ...req.body, id: aduan.id },
      KATEGORI: Aduan.KATEGORI,
      STATUS: Aduan.STATUS,
      ralat: ambilRalat(error),
    });
  }
};

/**
 * Padam aduan.
 */
exports.destroy = async (req, res) => {
  await Aduan.findByIdAndDelete(req.params.id);
  req.flash('jaya', 'Aduan berjaya dipadam.');
  res.redirect('/aduan');
};

/**
 * Papar papan pemuka (dashboard) dengan statistik ringkas.
 */
exports.dashboard = async (req, res) => {
  const jumlah = await Aduan.countDocuments();
  const baru = await Aduan.countDocuments({ status: 'Baru' });
  const siasatan = await Aduan.countDocuments({ status: 'Dalam Siasatan' });
  const selesai = await Aduan.countDocuments({ status: 'Selesai' });
  const terkini = await Aduan.find().sort({ createdAt: -1 }).limit(5);

  res.render('index', {
    title: 'Papan Pemuka',
    statistik: { jumlah, baru, siasatan, selesai },
    terkini,
  });
};

/**
 * Helper: tukar objek ralat validasi Mongoose kepada array mesej ringkas.
 */
function ambilRalat(error) {
  if (error.errors) {
    return Object.values(error.errors).map((e) => e.message);
  }
  return [error.message];
}
