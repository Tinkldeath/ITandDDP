const express = require('express');
const router = express.Router();
const controller = require('../controllers/postsController');
const auth = require('./../middleware/auth');
const cookieParser = require('./../middleware/cookieRequired');
const upload = require('./../middleware/multer');

//GET: http://localhost:port/api/posts/
router.get('/posts', controller.posts);
//GET: http://localhost:port/api/posts/top/
router.get('/posts/top', controller.top);
//POST: http://localhost:port/api/posts/add/
router.post('/posts/add', auth, upload.single('recfile'), controller.addPost);
// DELETE: http://localhost:port/api/posts/:id/
router.delete('/posts/:id', cookieParser, auth, controller.deletePost);
// GET: http://localhost:port/api/posts/:id/like
router.get('/posts/:id/like', cookieParser, auth, controller.like);
// GET: http://localhost:port/api/posts/archive/:id
router.get('/posts/archive/:id', cookieParser, auth, controller.archive);
// DELETE: http://localhost:port/api/posts/archive/:id
router.delete('/posts/archive/:id', cookieParser, auth, controller.unarchive);
// GET: http://localhost:port/api/archive/
router.get('/archive', cookieParser, auth, controller.getArchive);
// GET: http://localhost:port/api/ststistics/
router.get('/statistics', cookieParser, auth, controller.statistics);
//POST: http://localhost:port/api/posts/search/
router.post('/posts/search/', controller.search);

module.exports = router;