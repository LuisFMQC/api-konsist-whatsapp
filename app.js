require('dotenv').config();
const index = require('./routes/index');
const messageRoute = require('./routes/messageRoute');

('use strict');

const express = require('express'),
  body_parser = require('body-parser'),
  app = express().use(body_parser.json());

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.use('/', index);
app.use('/message', messageRoute);
