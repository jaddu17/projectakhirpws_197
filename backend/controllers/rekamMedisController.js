const {
  RekamMedis,
  Pasien,
  Dokter,
  JanjiTemu,
  Tindakan
} = require('../models');

/**
 * ===============================
 * GET ALL REKAM MEDIS
 * ===============================
 */
exports.getAllRekamMedis = async (req, res) => {
  try {
    const data = await RekamMedis.findAll({
      include: [
        {
          model: Pasien,
          as: 'pasien',
          attributes: ['id', 'nama']
        },
        {
          model: Dokter,
          as: 'dokter',
          attributes: ['id', 'nama']
        },
        {
          model: JanjiTemu,
          as: 'janji_temu',
          attributes: ['id', 'tanggal', 'jam'],
          required: false
        },
        {
          model: Tindakan,
          as: 'tindakan',
          attributes: ['id', 'nama'],
          required: false
        }
      ],
      order: [['tanggal', 'DESC']]
    });

    res.json(data);
  } catch (error) {
    console.error('ERROR getAllRekamMedis:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * GET REKAM MEDIS BY ID
 * ===============================
 */
exports.getRekamMedisById = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await RekamMedis.findByPk(id, {
      include: [
        { model: Pasien, as: 'pasien', attributes: ['id', 'nama'] },
        { model: Dokter, as: 'dokter', attributes: ['id', 'nama'] },
        { model: JanjiTemu, as: 'janji_temu', attributes: ['id', 'tanggal', 'jam'], required: false },
        { model: Tindakan, as: 'tindakan', attributes: ['id', 'nama'], required: false }
      ]
    });

    if (!data) {
      return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    }

    res.json(data);
  } catch (error) {
    console.error('ERROR getRekamMedisById:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * GET REKAM MEDIS BY PASIEN
 * ===============================
 */
exports.getRekamMedisByPasien = async (req, res) => {
  try {
    const { pasien_id } = req.params;

    const data = await RekamMedis.findAll({
      where: { pasien_id },
      include: [
        { model: Dokter, as: 'dokter', attributes: ['id', 'nama'] },
        { model: JanjiTemu, as: 'janji_temu', attributes: ['id', 'tanggal', 'jam'], required: false },
        { model: Tindakan, as: 'tindakan', attributes: ['id', 'nama'], required: false }
      ],
      order: [['tanggal', 'DESC']]
    });

    res.json(data);
  } catch (error) {
    console.error('ERROR getRekamMedisByPasien:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * GET REKAM MEDIS BY JANJI TEMU
 * ===============================
 */
exports.getRekamMedisByJanjiTemu = async (req, res) => {
  try {
    const { janji_temu_id } = req.params;

    const data = await RekamMedis.findOne({
      where: { janji_temu_id },
      include: [
        { model: Pasien, as: 'pasien', attributes: ['id', 'nama'] },
        { model: Dokter, as: 'dokter', attributes: ['id', 'nama'] },
        { model: Tindakan, as: 'tindakan', attributes: ['id', 'nama'], required: false }
      ]
    });

    res.json(data);
  } catch (error) {
    console.error('ERROR getRekamMedisByJanjiTemu:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * CREATE REKAM MEDIS
 * ===============================
 */
exports.createRekamMedis = async (req, res) => {
  try {
    const {
      pasien_id,
      dokter_id,
      janji_temu_id,
      tindakan_id,
      catatan,
      tanggal
    } = req.body;

    if (!pasien_id || !dokter_id || !catatan || !tanggal) {
      return res.status(400).json({
        message: 'pasien_id, dokter_id, catatan, dan tanggal wajib diisi'
      });
    }

    const newData = await RekamMedis.create({
      pasien_id,
      dokter_id,
      janji_temu_id: janji_temu_id || null,
      tindakan_id: tindakan_id || null,
      catatan,
      tanggal
    });

    res.status(201).json({
      message: 'Rekam medis berhasil ditambahkan',
      data: newData
    });
  } catch (error) {
    console.error('ERROR createRekamMedis:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * UPDATE REKAM MEDIS
 * ===============================
 */
exports.updateRekamMedis = async (req, res) => {
  try {
    const { id } = req.params;

    const rekamMedis = await RekamMedis.findByPk(id);
    if (!rekamMedis) {
      return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    }

    const {
      pasien_id,
      dokter_id,
      janji_temu_id,
      tindakan_id,
      catatan,
      tanggal
    } = req.body;

    await rekamMedis.update({
      pasien_id,
      dokter_id,
      janji_temu_id: janji_temu_id || null,
      tindakan_id: tindakan_id || null,
      catatan,
      tanggal
    });

    res.json({
      message: 'Rekam medis berhasil diperbarui',
      data: rekamMedis
    });
  } catch (error) {
    console.error('ERROR updateRekamMedis:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ===============================
 * DELETE REKAM MEDIS
 * ===============================
 */
exports.deleteRekamMedis = async (req, res) => {
  try {
    const { id } = req.params;

    const rekamMedis = await RekamMedis.findByPk(id);
    if (!rekamMedis) {
      return res.status(404).json({ message: 'Rekam medis tidak ditemukan' });
    }

    await rekamMedis.destroy();
    res.json({ message: 'Rekam medis berhasil dihapus' });
  } catch (error) {
    console.error('ERROR deleteRekamMedis:', error);
    res.status(500).json({ message: error.message });
  }
};
