const express = require('express');
const DSAController = require('../controllers/dsa.controller');

const router = express.Router();

/**
 * @route GET /api/dsa-content
 * @desc Get DSA content
 * @access Public
 */
router.get('/dsa-content', DSAController.getDSAContent);

/**
 * @route POST /api/run-visualized
 * @desc Run code with visualization
 * @access Public
 */
router.post('/run-visualized', DSAController.runVisualizedCode);

module.exports = router;