const express = require('express');
const router = express.Router();
const controller = require('../controllers/portalController');
const auth = require('./../middleware/auth');
const cookieRequired = require('../middleware/cookieRequired');

//GET: http://localhost:port/
router.get('/', controller.portal);
router.get('/new-post', cookieRequired, auth, controller.newPost);

module.exports = router;