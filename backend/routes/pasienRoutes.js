// routes/pasienRoutes.js
const express = require('express');
const router = express.Router();
const pasienController = require('../controllers/pasienController');
const authApiKey = require('../middleware/authApiKey');
const { requireAdmin } = require('../middleware/roleMiddleware');

// Semua route memerlukan API Key
router.use(authApiKey);

// Hanya Admin yang boleh mengakses
router.get('/', requireAdmin, pasienController.getAllPasien);
router.get('/:id', requireAdmin, pasienController.getPasienById);
router.post('/', requireAdmin, pasienController.createPasien);
router.put('/:id', requireAdmin, pasienController.updatePasien);
router.delete('/:id', requireAdmin, pasienController.deletePasien);
router.get('/search', requireAdmin, pasienController.searchPasien);

module.exports = router;