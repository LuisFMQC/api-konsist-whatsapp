/*
 * Starter Project for WhatsApp Echo Bot Tutorial
 *
 * Remix this as the starting point for following the WhatsApp Echo Bot tutorial
 *
 */

'use strict';
require('dotenv').config();
// Access token for your app
// (copy token from DevX getting started page
// and save it as environment variable into the .env file)
const token = process.env.WHATSAPP_TOKEN;

// Imports dependencies and set up http server
const request = require('request'),
  express = require('express'),
  body_parser = require('body-parser'),
  axios = require('axios'),
  app = express().use(body_parser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.post('/message', (req, res) => {
  const phone_number = '5561995257425';
  const phone_number_id = '109951971956273';
  let body = req.body;
  axios({
    method: 'POST',
    url: 'https://graph.facebook.com/v15.0/109951971956273/messages?access_token=EAAJ1RTPM5H0BACrXjZCzkpXU07bPGnUpyz1XBi1Wz4cxHGxQQFTKmP9IUzgsvx1bHK0iMbjF3x4eRKDAH4eTyJyuH9bZAL5T7f2AcHRzfol7dyRdZBbIqvpkgs0o5rZCPgznAR6ijRSWSOvghkTnnO0smZAmMkwOrK5ixKLLNQXYmbqzd9bbaMn0fjTfIKxAlCCyuHpdoiW1SD9Ws0znVwPEjmZBipGboZD',
    data: {
      messaging_product: 'whatsapp',
      to: phone_number,
      type: 'template',
      template: {
        name: 'sample_shipping_confirmation',
        language: {
          code: 'en_US',
          policy: 'deterministic',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: 'your-text-string',
              },
            ],
          },
        ],
      },
      headers: {
        'Content-Type': 'application/json',
      },
    },
  });
  res.sendStatus(200);
});

// Accepts POST requests at /webhook endpoint
app.post('/webhook', (req, res) => {
  // Parse the request body from the POST
  let body = req.body;

  // Check the Incoming webhook message
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
          to: '5561995257425',
          text: {
            body:
              msg_body === 'confirmar'
                ? 'Agendamento Confirmado!'
                : 'Deseja remarcar?',
          },
        },
        headers: { 'Content-Type': 'application/json' },
      });
    }
    res.sendStatus(200);
    console.log(req.body);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

// Accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get('/webhook', (req, res) => {
  /**
   * UPDATE YOUR VERIFY TOKEN
   *This will be the Verify Token value when you set up webhook
   **/
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
      res.sendStatus(403);
    }
  }
});
