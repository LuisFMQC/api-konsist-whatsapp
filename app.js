'use strict';
require('dotenv').config();

const fs = require('fs');
const https = require('https');

const options = {
  key: fs.readFileSync('./SSL/key.pem'),
  cert: fs.readFileSync('./SSL/cert.pem'),
};

const token = process.env.WHATSAPP_TOKEN;

const request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  axios = require('axios').default,
  app = express().use(body_parser.json()),
  cors = require('cors');

const PORT = process.env.PORT || 80;

app.use(express.json());
app.use(cors());

app.listen(PORT, () => console.log('webhook is listening na porta ' + PORT));

app.post('/webhook', (req, res) => {
  let body = req.body;
  console.log(JSON.stringify(req.body, null, 2));

  // info on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
      axios({
        method: 'POST', // Required, HTTP method, a string, e.g. POST, GET
        url:
          'https://graph.facebook.com/v12.0/' +
          phone_number_id +
          '/messages?access_token=' +
          token,
        data: {
          messaging_product: 'whatsapp',
          to: from,
          text: { body: 'Ack: ' + msg_body },
        },
        headers: { 'Content-Type': 'application/json' },
      });
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

app.get('/webhook', (req, res) => {
  console.log('chegou no hook');
  const verify_token = process.env.VERIFY_TOKEN;

  // Parse params from the webhook verification request
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Check if a token and mode were sent
  if (mode && token) {
    // Check the mode and token sent are correct
    if (mode === 'subscribe' && token === verify_token) {
      // Respond with 200 OK and challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(80);
    }
  }
});

app.get('/', (req, res) => {
  console.log('Olá junin!');
});

const server = https.createServer(options, app);

server.listen(80, function () {
  console.log('server running at https://IP_ADDRESS:8001/');
});
