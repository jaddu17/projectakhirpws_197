// routes/janjiTemuRoutes.js
const express = require('express');
const router = express.Router();
const janjiTemuController = require('../controllers/janjiTemuController');
const authApiKey = require('../middleware/authApiKey');
const { requireAdmin, requireDokter } = require('../middleware/roleMiddleware');

router.use(authApiKey);

// Endpoint untuk Admin
router.get('/', requireAdmin, janjiTemuController.getAllJanjiTemu);
router.get('/:id', requireAdmin, janjiTemuController.getJanjiTemuById);
router.post('/', requireAdmin, janjiTemuController.createJanjiTemu);
router.put('/:id', requireAdmin, janjiTemuController.updateJanjiTemu);
router.delete('/:id', requireAdmin, janjiTemuController.deleteJanjiTemu);
router.get('/search', requireAdmin, janjiTemuController.searchJanjiTemu);

// Endpoint untuk Dokter
router.get('/dokter/jadwal', requireDokter, janjiTemuController.getDokterJadwal);

module.exports = router;