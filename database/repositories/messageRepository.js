const db = require('../index.js');

class MessageRepository {
  async getAllMessages(dados) {
    const conn = await db.connectToPg();
    const query =
      'SELECT * FROM "confirmacaowhatsapp" WHERE "chave" > $1 AND "idcliente" = $2';
    const registros = conn.query(query, [dados.chave, dados.idcliente]);

    return registros;
  }

  async getStatusAtendimento(code) {
    const conn = await db.connectToPg();
    const query =
      'SELECT "indstatus" FROM "confirmacaowhatsapp" WHERE "idconversa" = $1';
    const registros = conn.query(query, [code]);

    return registros;
  }

  async postDadosAtendimento(dadosAtendimento) {
    const conn = await db.connectToPg();
    const query =
      'INSERT INTO "confirmacaowhatsapp" ( "chave", "indstatus", "idcliente", "mensagem", "contato" ) VALUES ( $1, $2, $3, $4, $5 );';
    const dados = conn.query(query, [
      dadosAtendimento.chave,
      dadosAtendimento.indstatus,
      dadosAtendimento.idcliente,
      dadosAtendimento.mensagem,
      dadosAtendimento.contato,
    ]);

    return dados;
  }

  async updateDadosAtendimento(code, dadosAtendimento) {
    const conn = await db.connectToPg();
    const query =
      'UPDATE "confirmacaowhatsapp" SET "idconversa" = $1 WHERE "contato" = $2 AND "chave" = $3';
    const dados = conn.query(query, [
      code,
      dadosAtendimento.contato,
      dadosAtendimento.chave,
    ]);

    return dados;
  }

  async updateStatusAtendimento(status, code) {
    const conn = await db.connectToPg();
    const query =
      'UPDATE "confirmacaowhatsapp" SET "indstatus" = $1 WHERE "idconversa" = $2';
    const dados = conn.query(query, [status, code]);

    return dados;
  }

  async getClienteById(code) {
    const conn = await db.connectToPg();
    const query = 'SELECT * FROM "agendawebcliente" WHERE "id" = $1;';
    const dados = await conn.query(query, [code]);

    return dados;
  }

  async getClienteByIdCliente(code) {
    const conn = await db.connectToPg();
    const query = 'SELECT * FROM "agendawebcliente" WHERE "idcliente" = $1;';
    const dados = conn.query(query, [code]);

    return dados;
  }

  async insertCliente(dadosCliente) {
    const conn = await db.connectToPg();
    const query =
      'INSERT INTO "agendawebcliente" ( "nome", "idcliente", "nome_schema", "idtelefonewhatsapp", "tokenwhatsapp" ) VALUES ( $1, $2, $3, $4, $5 );';
    const dados = conn.query(query, [
      dadosCliente.nome,
      dadosCliente.idcliente,
      dadosCliente.nome_schema,
      dadosCliente.idtelefonewhatsapp,
      dadosCliente.tokenwhatsapp,
    ]);

    return dados;
  }

  async updateCliente(dadosCliente) {
    const conn = await db.connectToPg();
    const query =
      'UPDATE "agendawebcliente" SET "idtelefonewhatsapp" = $1, "tokenwhatsapp" = $2 WHERE "idcliente" = $3';
    const dados = conn.query(query, [
      dadosCliente.idtelefonewhatsapp,
      dadosCliente.tokenwhatsapp,
      dadosCliente.idcliente,
    ]);

    return dados;
  }

  async getIdCliente(code) {
    const conn = await db.connectToPg();
    const query =
      'SELECT "idcliente" FROM "confirmacaowhatsapp" WHERE "idconversa" = $1;';
    const dados = conn.query(query, [code]);

    return dados;
  }
}

module.exports = MessageRepository;
