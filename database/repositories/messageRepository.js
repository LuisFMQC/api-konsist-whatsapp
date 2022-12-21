const db = require('../conexao');

class MessageRepository {
  async getAllMessages(dadosMessagens) {
    const query =
      'SELECT * FROM "confirmacaowhatsapp" WHERE "chave" > $1 AND "idcliente" = $2';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [dadosMessagens.chave, dadosMessagens.idcliente],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro:' + erro);
          }
          return resolve(result);
        },
      );
    });
    return dados;
  }

  async getStatusAtendimento(code) {
    const query = 'SELECT * FROM "confirmacaowhatsapp" WHERE "idconversa" = $1';

    const dados = await new Promise((resolve, reject) => {
      db.query(query, [code], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async postDadosAtendimento(dadosAtendimento, code) {
    const query =
      'INSERT INTO "confirmacaowhatsapp" ( "chave", "indstatus", "idcliente", "mensagem", "contato", "idconversa" ) VALUES ( $1, $2, $3, $4, $5, $6 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosAtendimento.chave,
          dadosAtendimento.indstatus,
          dadosAtendimento.idcliente,
          dadosAtendimento.mensagem,
          dadosAtendimento.contato,
          code,
        ],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro ao listar medico!');
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }

  async postDadosAtendimentoNovoRegistro(dadosAtendimento, status, code) {
    const query =
      'INSERT INTO "confirmacaowhatsapp" ( "chave", "indstatus", "idcliente", "mensagem", "contato", "idconversa" ) VALUES ( $1, $2, $3, $4, $5, $6 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosAtendimento.chave,
          status,
          parseInt(dadosAtendimento.idcliente),
          dadosAtendimento.mensagem,
          dadosAtendimento.contato,
          code,
        ],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro ao listar medico!');
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }

  async updateDadosAtendimento(code, dadosAtendimento) {
    const query =
      'UPDATE "confirmacaowhatsapp" SET "idconversa" = $1 WHERE "contato" = $2 AND "chave" = $3';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [code, dadosAtendimento.contato, dadosAtendimento.chave],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro:' + erro);
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }

  async updateStatusAtendimento(status, code) {
    const query =
      'UPDATE "confirmacaowhatsapp" SET "indstatus" = $1 WHERE "idconversa" = $2';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [status, code], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async getClienteById(code) {
    const query = 'SELECT * FROM "agendawebcliente" WHERE "id" = $1';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [code], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async getClienteByIdCliente(code) {
    const query = 'SELECT * FROM "agendawebcliente" WHERE "idcliente" = $1';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [code], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async insertCliente(dadosCliente) {
    const query =
      'INSERT INTO "agendawebcliente" ( "nome", "idcliente", "nome_schema", "idtelefonewhatsapp", "tokenwhatsapp" ) VALUES ( $1, $2, $3, $4, $5 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosCliente.nome,
          dadosCliente.idcliente,
          dadosCliente.nome_schema,
          dadosCliente.idtelefonewhatsapp,
          dadosCliente.tokenwhatsapp,
        ],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro:' + erro);
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }

  async updateCliente(dadosCliente) {
    const query =
      'UPDATE "agendawebcliente" SET "idtelefonewhatsapp" = $1, "tokenwhatsapp" = $2 WHERE "idcliente" = $3';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosCliente.idtelefonewhatsapp,
          dadosCliente.tokenwhatsapp,
          dadosCliente.idcliente,
        ],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro:' + erro);
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }

  async getIdCliente(code) {
    const query =
      'SELECT "idcliente" FROM "confirmacaowhatsapp" WHERE "idconversa" = $1';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [code], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });

    return dados;
  }
}

module.exports = MessageRepository;
