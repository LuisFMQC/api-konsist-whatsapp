const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../auth/verificaJWT');

router.post('/', authenticate, messageController.get);
router.post('/notas', authenticate, messageController.getPesquisa);
router.post('/create', authenticate, messageController.postMessage);
router.post('/pesquisa', authenticate, messageController.postPesquisa);

module.exports = router;
