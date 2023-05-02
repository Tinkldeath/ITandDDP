const express = require('express');
const router = express.Router();
const controller = require('../controllers/authorsController');
const auth = require('../middleware/auth');
const cookieRequired = require('../middleware/cookieRequired');

//GET: http://localhost:port/api/authors/
router.get('/authors', controller.authors);
//GET: http://localhost:port/api/user/
router.get('/user', auth, controller.user);
//GET: http://localhost:port/api/chats/
router.get('/chats/', cookieRequired, auth, controller.chats);
//GET: http://localhost:port/api/chats/:id/pool
router.get('/chats/:id/pool', cookieRequired, auth, controller.checkMessage);
//GET: http://localhost:port/api/chats/:id
router.get('/chats/:id', cookieRequired, auth, controller.chat);
//POST: http://localhost:port/api/chats/:id - send message
router.post('/chats/:id', cookieRequired, auth, controller.sendMessage);
//PUT: http://localhost:port/api/chats/:id - update message
router.put('/chats/:id', cookieRequired, auth, controller.updateMessage);
//DELETE: http://localhost:port/api/chats/:id - delete message
router.delete('/chats/:id', cookieRequired, auth, controller.deleteMessage);
//GET: http://localhost:port/api/authors/:id/
router.get('/authors/:id', cookieRequired, auth, controller.profile);
//GET: http://localhost:port/api/friends/
router.get('/friends', cookieRequired, auth, controller.friends);
//GET: http://localhost:port/api/friend/:id
router.get('/friend/:id', cookieRequired, auth, controller.friend);
//DELETE: http://localhost:port/api/unfriend/:id
router.delete('/unfriend/:id', cookieRequired, auth, controller.unfriend);
//GET: http://localhost:port/api/friend-requests/:id/accept
router.get('/friend-requests/:id/accept', cookieRequired, auth, controller.acceptFriendRequest);
//GET: http://localhost:port/api/friend-requests/:id/deny
router.get('/friend-requests/:id/deny', cookieRequired, auth, controller.denyFriendRequest);

module.exports = router;