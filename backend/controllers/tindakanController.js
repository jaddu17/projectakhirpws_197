// controllers/tindakanController.js
const { Tindakan } = require('../models');

// GET /tindakan
exports.getAllTindakan = async (req, res) => {
  try {
    const data = await Tindakan.findAll({ order: [['nama', 'ASC']] });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /tindakan/{id}
exports.getTindakanById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Tindakan.findByPk(id);
    if (!data) return res.status(404).json({ message: 'Tindakan tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /tindakan
exports.createTindakan = async (req, res) => {
  try {
    const newTindakan = await Tindakan.create(req.body);
    res.status(201).json(newTindakan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /tindakan/{id}
exports.updateTindakan = async (req, res) => {
  try {
    const { id } = req.params;
    const tindakan = await Tindakan.findByPk(id);
    if (!tindakan) return res.status(404).json({ message: 'Tindakan tidak ditemukan' });

    await tindakan.update(req.body);
    res.json(tindakan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /tindakan/{id}
exports.deleteTindakan = async (req, res) => {
  try {
    const { id } = req.params;
    const tindakan = await Tindakan.findByPk(id);
    if (!tindakan) return res.status(404).json({ message: 'Tindakan tidak ditemukan' });

    await tindakan.destroy();
    res.json({ message: 'Tindakan berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};