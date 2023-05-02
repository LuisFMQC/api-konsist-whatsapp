require('dotenv').config();
const index = require('./routes/index');
const messageRoute = require('./routes/messageRoute');

('use strict');

const express = require('express');
const bodyparser = require('body-parser');
const app = express().use(bodyparser.json({ limit: '500mb' }));
app.use(
  bodyparser.urlencoded({
    limit: '500mb',
    extended: true,
    parameterLimit: 500000,
  }),
);

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.use('/', index);
app.use('/message', messageRoute);
