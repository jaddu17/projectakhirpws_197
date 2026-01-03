const express = require('express');
const router = express.Router();

// ⬇️ PASTIKAN PATH INI BENAR
const rekamMedisController = require('../controllers/rekamMedisController');

/**
 * ROUTES REKAM MEDIS
 */
router.get('/', rekamMedisController.getAllRekamMedis);
router.get('/:id', rekamMedisController.getRekamMedisById);
router.get('/pasien/:pasien_id', rekamMedisController.getRekamMedisByPasien);
router.get('/janji/:janji_temu_id', rekamMedisController.getRekamMedisByJanjiTemu);

router.post('/', rekamMedisController.createRekamMedis);
router.put('/:id', rekamMedisController.updateRekamMedis);
router.delete('/:id', rekamMedisController.deleteRekamMedis);

module.exports = router;
