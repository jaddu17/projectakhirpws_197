// routes/tindakanRoutes.js
const express = require('express');
const router = express.Router();
const tindakanController = require('../controllers/tindakanController');
const authApiKey = require('../middleware/authApiKey');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.use(authApiKey);

// Hanya Admin yang boleh mengakses
router.get('/', requireAdmin, tindakanController.getAllTindakan);
router.get('/:id', requireAdmin, tindakanController.getTindakanById);
router.post('/', requireAdmin, tindakanController.createTindakan);
router.put('/:id', requireAdmin, tindakanController.updateTindakan);
router.delete('/:id', requireAdmin, tindakanController.deleteTindakan);

module.exports = router;