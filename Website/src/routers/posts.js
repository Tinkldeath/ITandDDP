const express = require('express');
const router = express.Router();
const controller = require('../controllers/postsController');

//GET: http://localhost:port/posts/
router.get('/posts', controller.posts);
//GET: http://localhost:port/posts/top/
router.get('/posts/top', controller.top);

module.exports = router;