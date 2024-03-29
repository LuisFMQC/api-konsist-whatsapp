require('dotenv').config();
const index = require('./Routes/index');
const messageRoute = require('./Routes/messageRoute');
const relatorioRoute = require('./Routes/relatorioRoute');
const cors = require('cors');

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
app.use(cors());

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));

app.use('/', index);
app.use('/message', messageRoute);
app.use('/relatorio', relatorioRoute);
