const { base64decode } = require('nodejs-base64')
const { Pool } = require('pg')
const sconect = 'postgres://'+base64decode(process.env.USERBD)+'@'+process.env.LINKBD+'/'+process.env.IDBD
const conexao = new Pool({connectionString:sconect})
module.exports = conexao
