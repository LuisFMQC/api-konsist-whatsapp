const db = require('../conexao');

class MessageRepository {
  async getAllMessages(dadosMensagens, idCliente) {
    const query =
      'SELECT id, chave, indstatus, idcliente FROM "confirmacaowhatsapp" WHERE "id" > $1 AND "idcliente" = $2 ORDER BY id ASC';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [dadosMensagens.id, idCliente], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
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

  async postDadosAtendimento(dadosPaciente, dadosAgendamento, idCliente, code) {
    const query =
      'INSERT INTO "confirmacaowhatsapp" ( "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosAgendamento.agendamento_chave,
          idCliente,
          dadosPaciente.telefone,
          code,
          dadosAgendamento.agendamento_data,
          dadosAgendamento.agendamento_hora,
          dadosPaciente.paciente,
          dadosAgendamento.agendamento_medico,
          dadosAgendamento.empresa_unidade,
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
      'INSERT INTO "confirmacaowhatsapp" ( "chave", "indstatus", "idcliente", "mensagem", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )';
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
          dadosAtendimento.data_atendimento,
          dadosAtendimento.hora_atendimento,
          dadosAtendimento.nomepaciente,
          dadosAtendimento.medico,
          dadosAtendimento.localatendimento,
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

  async getClienteByIdTelefone(code) {
    const query =
      'SELECT * FROM "agendawebcliente" WHERE "idtelefonewhatsapp" = $1';
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

  async getClienteBySchema(schema) {
    const query = 'SELECT * FROM "agendawebcliente" WHERE "nome_schema" = $1';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [schema], (erro, result) => {
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
      'INSERT INTO "agendawebcliente" ( "nome", "idcliente", "nome_schema", "idtelefonewhatsapp", "tokenwhatsapp", "contato" ) VALUES ( $1, $2, $3, $4, $5, $6 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosCliente.nome,
          dadosCliente.idcliente,
          dadosCliente.nome_schema,
          dadosCliente.idtelefonewhatsapp,
          dadosCliente.tokenwhatsapp,
          dadosCliente.contato,
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
      'UPDATE "agendawebcliente" SET "idtelefonewhatsapp" = $1, "tokenwhatsapp" = $2, "contato" = $3 WHERE "nome_schema" = $4';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosCliente.idtelefonewhatsapp,
          dadosCliente.tokenwhatsapp,
          dadosCliente.contato,
          dadosCliente.nome_schema,
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
