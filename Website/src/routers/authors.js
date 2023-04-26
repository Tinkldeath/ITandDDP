const express = require('express');
const router = express.Router();
const controller = require('../controllers/authorsController');
const auth = require('../middleware/auth');

//GET: http://localhost:port/api/posts/
router.get('/authors', controller.authors);
//GET: http://localhost:port/api/user/
router.get('/user', auth, controller.user);

module.exports = router;