const db = require('../conexao');

class MessageRepository {
  async getAllMessages(dadosMensagens, idCliente) {
    const query =
      'SELECT id, chave, indstatus, idcliente, data_atendimento, hora_atendimento, nomepaciente, id_local FROM "confirmacaowhatsapp" WHERE "id" > $1 AND "idcliente" = $2 AND indstatus IS NOT null ORDER BY id ASC';
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
  async getAllNotas(dadosMensagens, idCliente) {
    const query =
      'SELECT id, chave, idcliente, nota FROM "pesquisa_satisfacao" WHERE "id" > $1 AND "idcliente" = $2 AND nota IS NOT null ORDER BY id ASC';
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

  async getMessageById(idConversa) {
    const query = 'SELECT * FROM "confirmacaowhatsapp" WHERE "idconversa" = $1';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [idConversa], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });
    return dados;
  }
  async getMessageByIdPesquisa(idConversa) {
    const query = 'SELECT * FROM "enviospesquisa" WHERE "idconversa" = $1';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [idConversa], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });
    return dados;
  }

  async getSolicitacaoContato(id, idCliente) {
    const query =
      'SELECT id, chave, resposta, idcliente, datainclusao  FROM "contatorecaptacao" WHERE "id" > $1 AND "idcliente" = $2 AND "resposta" IS NOT null ORDER BY id ASC';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [id, idCliente], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });
    return dados;
  }

  async getRelatorioEnvio(datas, id) {
    const query =
      'SELECT * FROM "confirmacaowhatsapp" WHERE "idcliente" = $1 AND "datainclusao" BETWEEN $2 AND $3 ORDER BY id DESC';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [id, datas.data_inicial, datas.data_final],
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

  async getRelatorioCobranca(datas, id) {
    const query =
      'SELECT * FROM "envioscobrados" WHERE "idcliente" = $1 AND "datainclusao" BETWEEN $2 AND $3 ORDER BY id DESC';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [id, datas.data_inicial, datas.data_final],
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

  async getRelatorioEnvioUnico(chave, id) {
    const query =
      'SELECT * FROM "confirmacaowhatsapp" WHERE "idcliente" = $1 AND "chave" = $2 ORDER BY id DESC';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [id, chave], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });
    return dados;
  }

  async getRelatorioFalhaUnico(chave, id) {
    const query =
      'SELECT * FROM "enviosfalha" WHERE "idcliente" = $1 AND "chave" = $2 ORDER BY id DESC';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [id, chave], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });
    return dados;
  }

  async getRelatorioFalha(datas, id) {
    const query =
      'SELECT * FROM "enviosfalha" WHERE "idcliente" = $1 AND "datainclusao" BETWEEN $2 AND $3 ORDER BY id DESC';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [id, datas.data_inicial, datas.data_final],
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

  async getRegistroContato(code) {
    const query = 'SELECT * FROM "contatorecaptacao" WHERE "idconversa" = $1';

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
  async getRegistroPesquisa(code) {
    const query = 'SELECT * FROM "enviospesquisa" WHERE "idconversa" = $1';

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

  async getRegistroNota(code) {
    const query = 'SELECT * FROM "pesquisa_satisfacao" WHERE "idconversa" = $1';

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

  async getRegistroCobrado(idCliente, contato) {
    const interval = '24 hours';
    const query =
      'SELECT * FROM envioscobrados WHERE idcliente = $1 AND contato = $2 AND datainclusao >= NOW() - $3::INTERVAL';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [idCliente, contato, interval], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro ao listar Registros!');
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async postRegistroCobrado(dadosPaciente, dadosAgendamento, idCliente, code) {
    const query =
      'INSERT INTO "envioscobrados" ( "chave", "idcliente", "contato", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosAgendamento.agendamento_chave,
          idCliente,
          dadosPaciente.telefone,
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

  async postDadosAtendimento(dadosPaciente, dadosAgendamento, idCliente, code) {
    const query =
      'INSERT INTO "confirmacaowhatsapp" ( "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento", "id_local" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )';
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
          dadosAgendamento.id_local,
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

  async postDadosAtendimentoPesquisa(
    dadosPaciente,
    dadosAgendamento,
    idCliente,
    code,
  ) {
    const query =
      'INSERT INTO "enviospesquisa" ( "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )';
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

  async postDadosAtendimentoFalha(dadosPaciente, dadosAgendamento, idCliente) {
    const query =
      'INSERT INTO "enviosfalha" ( "chave", "idcliente", "contato",  "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosAgendamento.agendamento_chave,
          idCliente,
          dadosPaciente.telefone,
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
      'INSERT INTO "confirmacaowhatsapp" ( "chave", "indstatus", "idcliente", "mensagem", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento", "id_local" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12 )';
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
          dadosAtendimento.id_local,
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

  async postNovoRegistroContato(dadosAtendimento, code, resposta) {
    const query =
      'INSERT INTO "contatorecaptacao" ( "resposta", "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          resposta,
          dadosAtendimento.chave,
          parseInt(dadosAtendimento.idcliente),
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
  async postNovoRegistroNota(dadosAtendimento, code, nota) {
    const query =
      'INSERT INTO "pesquisa_satisfacao" ( "chave", "idcliente", "contato", "idconversa", "nota", "nomepaciente") VALUES ( $1, $2, $3, $4, $5, $6)';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosAtendimento.chave,
          parseInt(dadosAtendimento.idcliente),
          dadosAtendimento.contato,
          code,
          nota,
          dadosAtendimento.nomepaciente,
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
  async postNovoRegistroPesquisa(dadosAtendimento, code, resposta) {
    const query =
      'INSERT INTO "enviospesquisa" ( "resposta", "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          resposta,
          dadosAtendimento.chave,
          parseInt(dadosAtendimento.idcliente),
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

  async updateRegistroContato(resposta, code) {
    const query =
      'UPDATE "contatorecaptacao" SET "resposta" = $1 WHERE "idconversa" = $2';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [resposta, code], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
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
      'UPDATE "agendawebcliente" SET "idtelefonewhatsapp" = $1, "tokenwhatsapp" = $2, "contato" = $3, "nome" = $4 WHERE "nome_schema" = $5';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosCliente.idtelefonewhatsapp,
          dadosCliente.tokenwhatsapp,
          dadosCliente.contato,
          dadosCliente.nome,
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
  async getIdClienteContato(code) {
    const query =
      'SELECT "idcliente" FROM "contatorecaptacao" WHERE "idconversa" = $1';
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

  async getIdClientePesquisa(code) {
    const query =
      'SELECT "idcliente" FROM "enviospesquisa" WHERE "idconversa" = $1';
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
  async getIdClienteNota(code) {
    const query =
      'SELECT "idcliente" FROM "pesquisa_satisfacao" WHERE "idconversa" = $1';
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
