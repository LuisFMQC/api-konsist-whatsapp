const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../auth/verificaJWT');

router.post('/', authenticate, messageController.get);
router.post('/notas', authenticate, messageController.getPesquisa);
router.post('/create', authenticate, messageController.postMessage);
router.post('/pesquisa', authenticate, messageController.postPesquisa);
router.post('/bloqueio', authenticate, messageController.postAvisoBloqueio);
router.post(
  '/validacao-agenda',
  authenticate,
  messageController.postEnvioToken,
);
router.post(
  '/get-validacoes-agenda',
  authenticate,
  messageController.getAllTokens,
);
router.post(
  '/get-validacao-agenda-individual',
  authenticate,
  messageController.getTokenAgendamento,
);
router.post(
  '/aniversariantes',
  authenticate,
  messageController.postEnvioAniversario,
);
router.post('/avulsa', authenticate, messageController.postEnvioAvulso);
router.post('/recaptacao', authenticate, messageController.postEnvioRecaptacao);

module.exports = router;
