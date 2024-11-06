const express = require('express');
const whatsappClient = require('../services/WhatsappClient');
const router = new express.Router();
router.get('/', (req, res) => {
  res.send('Hello World!');
});

router.post("/message", (req, res) => {
  whatsappClient.sendMessage(req.body.phoneNumber, req.body.message);
  res.send();
})

module.exports = router