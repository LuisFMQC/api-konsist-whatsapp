const messageController = require('../controllers/messageController');
const express = require('express');
const router = express.Router();
const { authenticate } = require('../auth/verificaJWT');

router.get('/', authenticate, (req, res, next) => {
  res.status(200).send('Api Whatsapp KonsistMed');
});

router.get('/webhook', messageController.getwebhook);
router.post('/webhook', messageController.postWebhook);
router.post(
  '/criaratualizarcliente',
  authenticate,
  messageController.postCliente,
);
router.post(
  '/criaratualizarperguntas',
  authenticate,
  messageController.postPerguntaCliente,
);
router.post(
  '/criaratualizarmensagens',
  authenticate,
  messageController.postMensagemFinal,
);
router.post(
  '/verificacadastro',
  authenticate,
  messageController.getClienteServico,
);
router.post(
  '/verificaclienteperguntas',
  authenticate,
  messageController.getClientePerguntas,
);
router.post('/criarservico', authenticate, messageController.postServico);
router.get('/servicos', authenticate, messageController.getServicos);
router.post('/gettoken', messageController.getToken);
router.post(
  '/registrotoken',
  authenticate,
  messageController.postRegistroToken,
);

module.exports = router;
