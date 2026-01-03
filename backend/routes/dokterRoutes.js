// routes/dokterRoutes.js
const express = require('express');
const router = express.Router();
const dokterController = require('../controllers/dokterController');
const authApiKey = require('../middleware/authApiKey');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.use(authApiKey);

// Hanya Admin yang boleh mengakses
router.get('/', requireAdmin, dokterController.getAllDokter);
router.get('/:id', requireAdmin, dokterController.getDokterById);
router.post('/', requireAdmin, dokterController.createDokter);
router.put('/:id', requireAdmin, dokterController.updateDokter);
router.delete('/:id', requireAdmin, dokterController.deleteDokter);
router.get('/search', requireAdmin, dokterController.searchDokter);

module.exports = router;