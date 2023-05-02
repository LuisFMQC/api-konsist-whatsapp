const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../auth/verificaJWT');

router.post('/', authenticate, messageController.get);
router.post('/create', authenticate, messageController.postMessage);

module.exports = router;
