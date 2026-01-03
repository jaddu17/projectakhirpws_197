// controllers/janjiTemuController.js
const { JanjiTemu, Pasien, Dokter } = require('../models');

// Helper: cek double booking
const cekDoubleBooking = async (tanggal, jam, dokter_id, excludeId = null) => {
  let where = {
    tanggal,
    jam,
    dokter_id
  };

  // Jika ini update (exclude id yang sedang di-update)
  if (excludeId) {
    where.id = { [require('sequelize').Op.ne]: excludeId };
  }

  const existing = await JanjiTemu.findOne({ where });
  return !!existing;
};

// Helper: validasi role
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak: hanya admin yang diizinkan' });
  }
  next();
};

const requireDokter = (req, res, next) => {
  if (req.user.role !== 'dokter') {
    return res.status(403).json({ message: 'Akses ditolak: hanya dokter yang diizinkan' });
  }
  next();
};

// 22. GET /janji-temu — Lihat semua janji temu (Admin)
exports.getAllJanjiTemu = async (req, res) => {
  try {
    const janji = await JanjiTemu.findAll({
      include: [
        { model: Pasien, as: 'pasien' },   // ← Gunakan instance yang sudah diimport
        { model: Dokter, as: 'dokter' }     // ← Gunakan instance yang sudah diimport
      ],
      order: [['tanggal', 'ASC'], ['jam', 'ASC']]
    });
    res.json(janji);
  } catch (err) {
    console.error('Error getAllJanjiTemu:', err); // Tambahkan log
    res.status(500).json({ message: err.message });
  }
};

// 23. GET /janji-temu/{id} — Detail janji temu (Admin)
exports.getJanjiTemuById = async (req, res) => {
  try {
    const { id } = req.params;
    const janjiTemu = await JanjiTemu.findByPk(id, {
      include: [
        { model: Pasien, attributes: ['id', 'nama', 'no_telepon'] },
        { model: Dokter, attributes: ['id', 'nama', 'spesialis'] }
      ]
    });
    if (!janjiTemu) {
      return res.status(404).json({ message: 'Janji temu tidak ditemukan' });
    }
    res.json(janjiTemu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 24. POST /janji-temu — Buat janji temu baru (Admin)
exports.createJanjiTemu = async (req, res) => {
  const { tanggal, jam, pasien_id, dokter_id } = req.body;

  try {
    // Validasi input
    if (!tanggal || !jam || !pasien_id || !dokter_id) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    // Cek double booking
    const isDouble = await cekDoubleBooking(tanggal, jam, dokter_id);
    if (isDouble) {
      return res.status(400).json({ message: 'Dokter sudah memiliki janji temu pada waktu tersebut' });
    }

    // Buat janji temu
    const newJanji = await JanjiTemu.create({
      tanggal,
      jam,
      pasien_id,
      dokter_id,
      status: 'menunggu'
    });

    // Return dengan relasi
    const janjiWithRelasi = await JanjiTemu.findByPk(newJanji.id, {
      include: [Pasien, Dokter]
    });

    res.status(201).json(janjiWithRelasi);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ message: 'pasien_id atau dokter_id tidak valid' });
    }
    res.status(500).json({ message: err.message });
  }
};

// 25. PUT /janji-temu/{id} — Update (tanggal/jam/status) (Admin)
exports.updateJanjiTemu = async (req, res) => {
  const { id } = req.params;
  const { tanggal, jam, status } = req.body;

  try {
    const janjiTemu = await JanjiTemu.findByPk(id);
    if (!janjiTemu) {
      return res.status(404).json({ message: 'Janji temu tidak ditemukan' });
    }

    // Jika update tanggal/jam, cek double booking (abaikan ID ini)
    if (tanggal || jam) {
      const newTanggal = tanggal || janjiTemu.tanggal;
      const newJam = jam || janjiTemu.jam;
      const isDouble = await cekDoubleBooking(newTanggal, newJam, janjiTemu.dokter_id, id);
      if (isDouble) {
        return res.status(400).json({ message: 'Dokter sudah ada janji temu di waktu tersebut' });
      }
    }

    // Update hanya field yang dikirim
    await janjiTemu.update({
      tanggal: tanggal || janjiTemu.tanggal,
      jam: jam || janjiTemu.jam,
      status: status || janjiTemu.status
    });

    const updated = await JanjiTemu.findByPk(id, {
      include: [Pasien, Dokter]
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 26. DELETE /janji-temu/{id} — Hapus janji temu (Admin)
exports.deleteJanjiTemu = async (req, res) => {
  const { id } = req.params;

  try {
    const janjiTemu = await JanjiTemu.findByPk(id);
    if (!janjiTemu) {
      return res.status(404).json({ message: 'Janji temu tidak ditemukan' });
    }

    await janjiTemu.destroy();
    res.json({ message: 'Janji temu berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 27. GET /janji-temu/search — Cari (pasien/dokter/tanggal/status)
exports.searchJanjiTemu = async (req, res) => {
  try {
    const { pasien, dokter, tanggal, status } = req.query;
    const where = {};

    if (pasien) {
      const pasienData = await Pasien.findOne({
        where: { nama: { [require('sequelize').Op.iLike]: `%${pasien}%` } }
      });
      if (pasienData) {
        where.pasien_id = pasienData.id;
      } else {
        where.pasien_id = -1; // tidak akan match
      }
    }

    if (dokter) {
      const dokterData = await Dokter.findOne({
        where: { nama: { [require('sequelize').Op.iLike]: `%${dokter}%` } }
      });
      if (dokterData) {
        where.dokter_id = dokterData.id;
      } else {
        where.dokter_id = -1;
      }
    }

    if (tanggal) where.tanggal = tanggal;
    if (status) where.status = status;

    const results = await JanjiTemu.findAll({
      where,
      include: [
        { model: Pasien, attributes: ['id', 'nama'] },
        { model: Dokter, attributes: ['id', 'nama'] }
      ],
      order: [['tanggal', 'ASC'], ['jam', 'ASC']]
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 28. GET /janji-temu/dokter/jadwal — Lihat jadwal dokter yang sedang login (Dokter)
exports.getDokterJadwal = async (req, res) => {
  try {
    const dokterId = req.user.dokter_id;

    if (!dokterId) {
      return res.status(400).json({
        message: 'Akun dokter belum terhubung dengan data dokter'
      });
    }

    const jadwal = await JanjiTemu.findAll({
      where: { dokter_id: dokterId },
      include: [
        { model: Pasien, as: 'pasien', attributes: ['id', 'nama', 'no_telepon'] }
      ],
      order: [['tanggal', 'ASC'], ['jam', 'ASC']]
    });

    res.json(jadwal);
  } catch (err) {
    console.error('ERROR getDokterJadwal:', err);
    res.status(500).json({ message: err.message });
  }
};
