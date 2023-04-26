const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');
const upload = require('./../middleware/multer');

const type = upload.single('recfile')

//GET: http://localhost:port/login
router.get('/login', controller.getLogin);
//POST: http://localhost:port/login
router.post('/login', controller.login);
//GET: http://localhost:port/login
router.get('/register', controller.getRegister);
//POST: http://localhost:port/login
router.post('/register', type, controller.register);

module.exports = router;