const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.get);
router.post('/create', messageController.postMessage);

module.exports = router;
