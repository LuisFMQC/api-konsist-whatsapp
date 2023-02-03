const messageController = require("../controllers/messageController");
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.status(200).send("Api Whatsapp KonsistMed");
});
router.get("/webhook", messageController.getwebhook);
router.post("/webhook", messageController.postWebhook);
router.post("/criaratualizarcliente", messageController.postCliente);

module.exports = router;
