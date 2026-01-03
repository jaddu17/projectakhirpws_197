// controllers/pasienController.js
const { Pasien } = require('../models');

// GET /pasien
exports.getAllPasien = async (req, res) => {
  try {
    const pasien = await Pasien.findAll({ order: [['nama', 'ASC']] });
    res.json(pasien);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /pasien/{id}
exports.getPasienById = async (req, res) => {
  try {
    const { id } = req.params;
    const pasien = await Pasien.findByPk(id);
    if (!pasien) return res.status(404).json({ message: 'Pasien tidak ditemukan' });
    res.json(pasien);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /pasien
exports.createPasien = async (req, res) => {
  try {
    const { nama, no_telepon, alamat, tanggal_lahir } = req.body;
    const newPasien = await Pasien.create({ nama, no_telepon, alamat, tanggal_lahir });
    res.status(201).json(newPasien);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Nomor telepon sudah terdaftar' });
    }
    res.status(500).json({ message: err.message });
  }
};

// PUT /pasien/{id}
exports.updatePasien = async (req, res) => {
  try {
    const { id } = req.params;
    const pasien = await Pasien.findByPk(id);
    if (!pasien) return res.status(404).json({ message: 'Pasien tidak ditemukan' });

    await pasien.update(req.body);
    res.json(pasien);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Nomor telepon sudah terdaftar' });
    }
    res.status(500).json({ message: err.message });
  }
};

// DELETE /pasien/{id}
exports.deletePasien = async (req, res) => {
  try {
    const { id } = req.params;
    const pasien = await Pasien.findByPk(id);
    if (!pasien) return res.status(404).json({ message: 'Pasien tidak ditemukan' });

    await pasien.destroy();
    res.json({ message: 'Pasien berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /pasien/search
exports.searchPasien = async (req, res) => {
  try {
    const { q } = req.query;
    const pasien = await Pasien.findAll({
      where: {
        nama: { [require('sequelize').Op.iLike]: `%${q}%` }
      },
      order: [['nama', 'ASC']]
    });
    res.json(pasien);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};