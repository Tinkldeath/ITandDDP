const express = require('express');
const router = express.Router();
const controller = require('../controllers/categoriesController');

//GET: http://localhost:port/posts/
router.get('/categories', controller.categories);

module.exports = router;