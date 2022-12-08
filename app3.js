<<<<<<< HEAD
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const options = {
  key: fs.readFileSync('./SSL/code.key'),
  cert: fs.readFileSync('./SSL/code.crt'),
};
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.listen(PORT || 1337, () => console.log('Api rodando na porta ' + PORT));
// Cria a instância do server e escuta na porta 3000
https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Hello world using HTTPS!\n');
  })
  .listen(80);
=======
const fs = require('fs');
const https = require('https');
require('dotenv').config();

const options = {
  key: fs.readFileSync('./SSL/code.key'),
  cert: fs.readFileSync('./SSL/code.crt'),
};
const cors = require('cors');
const express = require('express');
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());
app.listen(PORT || 1337, () => console.log('Api rodando na porta ' + PORT));
// Cria a instância do server e escuta na porta 3000
https
  .createServer(options, (req, res) => {
    res.writeHead(200);
    res.end('Hello world using HTTPS!\n');
  })
  .listen(80);
>>>>>>> 6aa4d2a465d488dad8c64c42d46770290fd5d27f
