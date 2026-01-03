// controllers/rekamMedisController.js
const { RekamMedis, Pasien, Dokter, JanjiTemu, Tindakan } = require('../models');

// GET /rekam-medis
exports.getAllRekamMedis = async (req, res) => {
  try {
    const data = await RekamMedis.findAll({
      include: [
        { model: Pasien, attributes: ['id', 'nama'] },
        { model: Dokter, attributes: ['id', 'nama'] },
        { model: Tindakan, attributes: ['id', 'nama'] }
      ],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /rekam-medis/{id}
exports.getRekamMedisById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await RekamMedis.findByPk(id, {
      include: [Pasien, Dokter, Tindakan]
    });
    if (!data) return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /rekam-medis
exports.createRekamMedis = async (req, res) => {
  try {
    const { catatan, tanggal, pasien_id, dokter_id, janji_temu_id, tindakan_id } = req.body;
    const newRekam = await RekamMedis.create({
      catatan, tanggal, pasien_id, dokter_id, janji_temu_id, tindakan_id
    });
    res.status(201).json(newRekam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /rekam-medis/{id}
exports.updateRekamMedis = async (req, res) => {
  try {
    const { id } = req.params;
    const rekam = await RekamMedis.findByPk(id);
    if (!rekam) return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });

    await rekam.update(req.body);
    res.json(rekam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /rekam-medis/{id}
exports.deleteRekamMedis = async (req, res) => {
  try {
    const { id } = req.params;
    const rekam = await RekamMedis.findByPk(id);
    if (!rekam) return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });

    await rekam.destroy();
    res.json({ message: 'Rekam medis berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /rekam-medis/pasien/{id_pasien}
exports.getRekamMedisByPasien = async (req, res) => {
  try {
    const { id_pasien } = req.params;
    const data = await RekamMedis.findAll({
      where: { pasien_id: id_pasien },
      include: [Dokter, Tindakan],
      order: [['tanggal', 'DESC']]
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /rekam-medis/janji/{id_janji}
exports.getRekamMedisByJanji = async (req, res) => {
  try {
    const { id_janji } = req.params;
    const data = await RekamMedis.findOne({
      where: { janji_temu_id: id_janji },
      include: [Pasien, Dokter, Tindakan]
    });
    if (!data) return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};