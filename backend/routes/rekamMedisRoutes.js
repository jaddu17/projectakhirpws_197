// routes/rekamMedisRoutes.js
const express = require('express');
const router = express.Router();
const rekamMedisController = require('../controllers/rekamMedisController');
const authApiKey = require('../middleware/authApiKey');
const { requireAdmin, requireDokter } = require('../middleware/roleMiddleware');

router.use(authApiKey);

// Endpoint untuk Admin
router.get('/', requireAdmin, rekamMedisController.getAllRekamMedis);
router.get('/:id', requireAdmin, rekamMedisController.getRekamMedisById);
router.post('/', requireAdmin, rekamMedisController.createRekamMedis);
router.put('/:id', requireAdmin, rekamMedisController.updateRekamMedis);
router.delete('/:id', requireAdmin, rekamMedisController.deleteRekamMedis);

// Endpoint untuk Dokter
router.get('/pasien/:id_pasien', requireDokter, rekamMedisController.getRekamMedisByPasien);
router.get('/janji/:id_janji', requireDokter, rekamMedisController.getRekamMedisByJanji);

module.exports = router;