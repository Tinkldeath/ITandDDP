const express = require('express');
const router = express.Router();
const controller = require('../controllers/portalController');

//GET: http://localhost:port/
router.get('/', controller.portal);

module.exports = router;