const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const { authenticate } = require("../auth/verificaJWT");

router.post("/envio", authenticate, messageController.getRelatorioEnvio);
router.post(
  "/enviounico",
  authenticate,
  messageController.getRelatorioEnvioUnico
);
router.post("/falha", authenticate, messageController.getRelatorioFalha);
router.post(
  "/falhaunica",
  authenticate,
  messageController.getRelatorioFalhaUnico
);

router.post("/cobranca", authenticate, messageController.getRelatorioCobranca);
router.post(
  "/recaptacao",
  authenticate,
  messageController.getSolicitacaoContato
);

router.post("/cobrancageral", messageController.getEnviosCobradosTodos);

module.exports = router;
