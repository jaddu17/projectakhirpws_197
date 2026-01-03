// controllers/dokterController.js
const { Dokter, User } = require('../models');
const crypto = require('crypto');

// Helper fungsi
const generatePassword = () => Math.random().toString(36).slice(-8);
const generateApiKey = () => crypto.randomBytes(32).toString('hex');

// GET /dokter
exports.getAllDokter = async (req, res) => {
  try {
    const dokter = await Dokter.findAll({ order: [['nama', 'ASC']] });
    res.json(dokter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /dokter/{id}
exports.getDokterById = async (req, res) => {
  try {
    const { id } = req.params;
    const dokter = await Dokter.findByPk(id);
    if (!dokter) return res.status(404).json({ message: 'Dokter tidak ditemukan' });
    res.json(dokter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /dokter — Buat dokter + akun otomatis
exports.createDokter = async (req, res) => {
  const { nama, spesialis, no_telepon, username } = req.body;

  try {
    // 1. Buat data dokter
    const newDokter = await Dokter.create({ nama, spesialis, no_telepon });

    // 2. Generate password & API Key
    const password = generatePassword();
    const apiKey = generateApiKey();

    // 3. Buat akun user untuk dokter
    await User.create({
      username: username || `dokter${newDokter.id}`,
      password,
      nama_lengkap: nama,
      role: 'dokter',
      api_key: apiKey,
      dokter_id: newDokter.id // penting untuk endpoint /janji-temu/dokter/jadwal
    });

    res.status(201).json({
      dokter: newDokter,
      akun: {
        username: username || `dokter${newDokter.id}`,
        password // kirim ke admin untuk diberikan ke dokter
      }
    });
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /dokter/{id}
exports.updateDokter = async (req, res) => {
  try {
    const { id } = req.params;
    const dokter = await Dokter.findByPk(id);
    if (!dokter) return res.status(404).json({ message: 'Dokter tidak ditemukan' });

    await dokter.update(req.body);
    res.json(dokter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /dokter/{id}
exports.deleteDokter = async (req, res) => {
  try {
    const { id } = req.params;
    const dokter = await Dokter.findByPk(id);
    if (!dokter) return res.status(404).json({ message: 'Dokter tidak ditemukan' });

    // Hapus juga akun user-nya
    await User.destroy({ where: { dokter_id: id, role: 'dokter' } });

    await dokter.destroy();
    res.json({ message: 'Dokter berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /dokter/search
exports.searchDokter = async (req, res) => {
  try {
    const { q } = req.query;
    const dokter = await Dokter.findAll({
      where: {
        nama: { [require('sequelize').Op.iLike]: `%${q}%` }
      },
      order: [['nama', 'ASC']]
    });
    res.json(dokter);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};