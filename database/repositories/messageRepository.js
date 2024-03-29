const db = require('../conexao');

class MessageRepository {
  async getTokenKonsist(id, schema) {
    const query =
      'SELECT * FROM "cliente" WHERE "id" = $1 AND "nome_schema" = $2';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [id, schema], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });
    return dados;
  }
  async getAllMessages(dadosMensagens, idCliente) {
    const query =
      'SELECT id, chave, indstatus, idcliente, data_atendimento, hora_atendimento, nomepaciente, id_local, medico FROM "confirmacaowhatsapp" WHERE "id" > $1 AND "idcliente" = $2 AND indstatus IS NOT null ORDER BY id ASC';
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
  async getAllTokens(dadosMensagens, idCliente) {
    const query =
      'SELECT id, chave, idcliente, data_atendimento, hora_atendimento, nomepaciente, id_local, medico, token_agendamento FROM "enviostoken" WHERE "id" > $1 AND "idcliente" = $2 AND token_agendamento IS NOT null ORDER BY id ASC';
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
  async getTokenAgendamento(dadosMensagens, idCliente) {
    const query =
      'SELECT id, chave, idcliente, data_atendimento, hora_atendimento, nomepaciente, id_local, medico, token_agendamento FROM "enviostoken" WHERE "chave" = $1 AND "idcliente" = $2 AND token_agendamento IS NOT null ORDER BY id DESC LIMIT 1';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [dadosMensagens.chave, idCliente], (erro, result) => {
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
      "SELECT e.*, c.pergunta, c.ordem, c.id_pergunta FROM enviospesquisa AS e JOIN cliente_pergunta AS c ON e.idpergunta = c.id WHERE e.id > $1 AND e.idcliente = $2 AND e.resposta IS NOT null AND e.resposta != 'rp' AND e.resposta != 'nr' ORDER BY e.id ASC;";
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
  async getAllContatosRecusados(idContatoRecusado, nomeSchema) {
    const query =
      'SELECT a.id, a.contato, a.datainclusao FROM contato_recusado AS a JOIN cliente AS c ON a.id_cliente = c.id WHERE a.id > $1 AND c.nome_schema = $2 ORDER BY a.id ASC;';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [idContatoRecusado, nomeSchema], (erro, result) => {
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
    const query =
      'SELECT * FROM "enviospesquisa" WHERE "idconversa" = $1 ORDER BY id DESC LIMIT 1';

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

  async getServicoCliente(idServico, idCliente) {
    const query =
      'SELECT * FROM cliente_servico WHERE id_servico = $1 AND id_cliente = $2';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [idServico, idCliente], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro ao listar Registros!');
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async postRegistroCobrado(dadosPaciente, dadosAgendamento, idCliente, tipo) {
    const query =
      'INSERT INTO "envioscobrados" ( "chave", "idcliente", "contato", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento", "tipo" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosAgendamento ? dadosAgendamento.agendamento_chave : null,
          idCliente,
          dadosPaciente.telefone,
          dadosAgendamento ? dadosAgendamento.agendamento_data : null,
          dadosAgendamento ? dadosAgendamento.agendamento_hora : null,
          dadosPaciente.paciente,
          dadosAgendamento ? dadosAgendamento.agendamento_medico : null,
          dadosAgendamento ? dadosAgendamento.empresa_unidade : null,
          tipo,
        ],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro ao cadastrar registro cobrado!');
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }
  async insertContatoRecusado(contato, idCliente) {
    const client = await db.connect();
    try {
      const queryInsert =
        'INSERT INTO "contato_recusado" ( "id_cliente", "contato" ) VALUES ( $1, $2 )';

      const querySelect =
        'SELECT * FROM contato_recusado WHERE id_cliente = $1 AND contato = $2';

      await client.query('BEGIN');

      const existeRegistro = await client.query(querySelect, [
        idCliente,
        contato,
      ]);

      if (existeRegistro.rowCount !== 0) {
        await client.query('COMMIT');
        return false;
      }
      const criaRegistro = await client.query(queryInsert, [
        idCliente,
        contato,
      ]);
      await client.query('COMMIT');
      return true;
    } catch (e) {
      console.log(e);
      await client.query('ROLLBACK');
    } finally {
      client.release();
    }
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

  async postDadosAvisoBloqueio(
    dadosPaciente,
    dadosAgendamento,
    idCliente,
    code,
  ) {
    const query =
      'INSERT INTO "avisobloqueio" ( "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9 )';
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
  async postDadosEnvioAniversario(dadosPaciente, idCliente, code) {
    const query =
      'INSERT INTO "enviosaniversarios" ( "idcliente", "contato", "idconversa", "nomepaciente" ) VALUES ( $1, $2, $3, $4)';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [idCliente, dadosPaciente.telefone, code, dadosPaciente.paciente],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro ao Cadastrar Mensagem de aniversário!');
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }
  async postDadosEnvioRecaptacao(dadosPaciente, idCliente, code) {
    const query =
      'INSERT INTO "enviosrecaptacao" ( "idcliente", "contato", "idconversa", "nomepaciente" ) VALUES ( $1, $2, $3, $4)';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [idCliente, dadosPaciente.telefone, code, dadosPaciente.paciente],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro ao Cadastrar Mensagem de aniversário!');
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }
  async postDadosEnvioAvulso(dadosPaciente, idCliente, code) {
    const query =
      'INSERT INTO "envios_avulsos" ( "idcliente", "contato", "idconversa","mensagem", "nomepaciente" ) VALUES ( $1, $2, $3, $4, $5)';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          idCliente,
          dadosPaciente.telefone,
          code,
          dadosPaciente.mensagem,
          dadosPaciente.paciente,
        ],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro ao Cadastrar Mensagem de aniversário!');
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }
  async postDadosEnvioRecaptacao(dadosPaciente, idCliente, code) {
    const query =
      'INSERT INTO "enviosrecaptacao" ( "idcliente", "contato", "idconversa", "nomepaciente" ) VALUES ( $1, $2, $3, $4)';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [idCliente, dadosPaciente.telefone, code, dadosPaciente.paciente],
        (erro, result) => {
          if (erro) {
            console.log(erro);
            return reject('Erro ao Cadastrar Mensagem de aniversário!');
          }
          return resolve(result);
        },
      );
    });

    return dados;
  }
  async postDadosEnvioToken(dadosPaciente, dadosAgendamento, idCliente, code) {
    const query =
      'INSERT INTO "enviostoken" ( "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento", "id_local" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10 )';
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
  async postNovoRegistroEnvioToken(dadosToken, token) {
    const query =
      'INSERT INTO "enviostoken" ( "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento", "id_local", "token_agendamento" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [
          dadosToken.chave,
          dadosToken.idcliente,
          dadosToken.contato,
          dadosToken.idconversa,
          dadosToken.data_atendimento,
          dadosToken.hora_atendimento,
          dadosToken.nomepaciente,
          dadosToken.medico,
          dadosToken.localatendimento,
          dadosToken.id_local,
          token,
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
    idPergunta,
  ) {
    const query =
      'INSERT INTO "enviospesquisa" ( "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento", "id_local", "idpergunta" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11 )';
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
          idPergunta,
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
          dadosAgendamento ? dadosAgendamento.agendamento_chave : null,
          idCliente,
          dadosPaciente.telefone,
          dadosAgendamento ? dadosAgendamento.agendamento_data : null,
          dadosAgendamento ? dadosAgendamento.agendamento_hora : null,
          dadosPaciente.paciente,
          dadosAgendamento ? dadosAgendamento.agendamento_medico : null,
          dadosAgendamento ? dadosAgendamento.empresa_unidade : null,
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
  async postNovoRegistroPesquisa(dadosAtendimento, code, resposta, idPergunta) {
    const query =
      'INSERT INTO "enviospesquisa" ( "resposta", "chave", "idcliente", "contato", "idconversa", "data_atendimento", "hora_atendimento", "nomepaciente", "medico", "localatendimento", "id_local", "idpergunta" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
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
          dadosAtendimento.id_local,
          idPergunta,
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

  async updateServicoCliente(servico, idCliente) {
    const query =
      'UPDATE "cliente_servico" SET "data_inicio" = $1, "data_fim" = $2 WHERE "id_cliente" = $3 AND "id_servico" = $4';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [servico.data_inicio, servico.data_fim, idCliente, servico.id],
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
    const query = 'SELECT * FROM "cliente" WHERE "id" = $1';
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
  async getEnvioToken(dadosToken) {
    const query =
      'SELECT * FROM "enviostoken" WHERE "idcliente" = $1 AND "chave" = $2 ORDER BY id ASC';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [dadosToken.idcliente, dadosToken.chave],
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

  async getClienteByIdTelefone(code) {
    const query = 'SELECT * FROM "cliente" WHERE "idtelefonewhatsapp" = $1';
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
    const query = 'SELECT * FROM "cliente" WHERE "nome_schema" = $1';
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
    const query = 'SELECT * FROM "cliente" WHERE "idcliente" = $1';
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
  async getClienteServico(code) {
    const query =
      'SELECT * FROM cliente AS a JOIN cliente_servico AS c ON a.id = c.id_cliente WHERE a.nome_schema = $1';
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
  async getClientePergunta(code) {
    const query =
      'SELECT * FROM cliente AS a JOIN cliente_pergunta AS c ON a.id = c.id_cliente WHERE a.nome_schema = $1';
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
  async getClienteMensagem(code) {
    const query =
      'SELECT * FROM cliente AS a JOIN mensagemfinal AS c ON a.id = c.id_cliente WHERE a.nome_schema = $1';
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
  async getClientePerguntaUnica(code) {
    const query =
      'SELECT * FROM cliente AS a JOIN cliente_pergunta AS c ON a.id = c.id_cliente WHERE a.nome_schema = $1 AND c.id = $2';
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
  async getClienteServicoUnico(nomeSchema, idServico) {
    const query =
      'SELECT * FROM cliente AS a JOIN cliente_servico AS c ON a.id = c.id_cliente WHERE a.nome_schema = $1 AND c.id_servico = $2';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [nomeSchema, idServico], (erro, result) => {
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
      'INSERT INTO "cliente" ( "nome", "idcliente", "nome_schema", "idtelefonewhatsapp", "tokenwhatsapp", "contato" ) VALUES ( $1, $2, $3, $4, $5, $6 ) RETURNING id';
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
  async insertServico(descricao) {
    const query = 'INSERT INTO "servico" ( "descricao" ) VALUES ( $1 )';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [descricao], (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async updateCliente(dadosCliente) {
    const query =
      'UPDATE "cliente" SET "idtelefonewhatsapp" = $1, "tokenwhatsapp" = $2, "contato" = $3, "nome" = $4 WHERE "nome_schema" = $5';
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
  async updateClienteServico(servico, token, id) {
    const query =
      'UPDATE "cliente_servico" SET "data_inicio" = $1, "data_fim" = $2, "token" = $3 WHERE "id_cliente" = $4 AND "id_servico" = $5';
    const dados = await new Promise((resolve, reject) => {
      db.query(
        query,
        [servico.data_inicio, servico.data_fim, token, id, servico.id],
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
  async getIdClienteAvulsa(code) {
    const query =
      'SELECT "idcliente" FROM "envios_avulsos" WHERE "idconversa" = $1';
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
  async getIdClienteAniversarios(code) {
    const query =
      'SELECT "idcliente" FROM "enviosaniversarios" WHERE "idconversa" = $1';
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
  async getIdClienteRecaptacao(code) {
    const query =
      'SELECT "idcliente" FROM "enviosrecaptacao" WHERE "idconversa" = $1';
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

  async getServicos() {
    const query = 'SELECT * FROM servico';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, (erro, result) => {
        if (erro) {
          console.log(erro);
          return reject('Erro:' + erro);
        }
        return resolve(result);
      });
    });

    return dados;
  }

  async insertClienteNovo(dadosCliente, servicos) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const queryVerificaCliente =
        'SELECT * FROM "cliente" WHERE "nome_schema" = $1';
      const queryVerificaServico =
        'SELECT * FROM cliente_servico WHERE id_servico = $1 AND id_cliente = $2';
      const queryClienteCriar =
        'INSERT INTO "cliente" ( "nome", "idcliente", "nome_schema", "idtelefonewhatsapp", "tokenwhatsapp", "contato", "endereco_publico_agendaweb", "api_endereco" ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING id';
      const queryClienteAtualizar =
        'UPDATE "cliente" SET "idtelefonewhatsapp" = $1, "tokenwhatsapp" = $2, "contato" = $3, "nome" = $4, "endereco_publico_agendaweb" = $5, "api_endereco" = $6 WHERE "nome_schema" = $7 RETURNING id';

      const queryServicoCriar =
        'INSERT INTO "cliente_servico" ( "id_servico", "id_cliente", "data_inicio", "data_fim", "limite_usuario" ) VALUES ( $1, $2, $3, $4, $5 )';
      const queryServicoAtualizar =
        'UPDATE "cliente_servico" SET "data_inicio" = $1, "data_fim" = $2, "limite_usuario" = $3 WHERE "id_cliente" = $4 AND "id_servico" = $5';

      const clienteCadastrado = await client.query(queryVerificaCliente, [
        dadosCliente.nome_schema,
      ]);
      let id;
      let mensagem;
      if (clienteCadastrado.rows[0]) {
        mensagem = 'Cliente atualizado com sucesso.';
        const clienteAntigo = await client.query(queryClienteAtualizar, [
          dadosCliente.idtelefonewhatsapp,
          dadosCliente.tokenwhatsapp,
          dadosCliente.contato,
          dadosCliente.nome,
          dadosCliente.endereco_publico_agendaweb,
          dadosCliente.endereco_publico_agendaweb,
          dadosCliente.nome_schema,
        ]);
        id = clienteAntigo.rows[0].id;
      } else {
        mensagem = 'Cliente cadastrado com sucesso.';
        const novoCliente = await client.query(queryClienteCriar, [
          dadosCliente.nome,
          dadosCliente.idcliente,
          dadosCliente.nome_schema,
          dadosCliente.idtelefonewhatsapp,
          dadosCliente.tokenwhatsapp,
          dadosCliente.contato,
          dadosCliente.endereco_publico_agendaweb,
          dadosCliente.endereco_publico_agendaweb,
        ]);
        id = novoCliente.rows[0].id;
      }

      for (const servico of servicos) {
        const servicoCadastrado = await client.query(queryVerificaServico, [
          servico.id,
          clienteCadastrado.rows[0] ? clienteCadastrado.rows[0].id : null,
        ]);
        if (servicoCadastrado.rows[0]) {
          await client.query(queryServicoAtualizar, [
            servico.data_inicio,
            servico.data_fim,
            servico.limite_usuario ? servico.limite_usuario : 0,
            clienteCadastrado.rows[0].id,
            servico.id,
          ]);
        } else {
          await client.query(queryServicoCriar, [
            servico.id,
            id,
            servico.data_inicio,
            servico.data_fim,
            servico.limite_usuario ? servico.limite_usuario : 0,
          ]);
        }
      }

      await client.query('COMMIT');

      return {
        id: id,
        mensagem: mensagem,
      };
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Erro na transação:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async insertPerguntaCliente(nomeSchema, perguntas) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const queryVerificaCliente =
        'SELECT * FROM "cliente" WHERE "nome_schema" = $1';
      const queryVerificaPergunta =
        'SELECT * FROM cliente_pergunta WHERE id_pergunta = $1 AND id_cliente = $2';
      const queryPerguntaCriar =
        'INSERT INTO "cliente_pergunta" ( "id_pergunta", "id_cliente", "pergunta", "ordem", "ativo") VALUES ( $1, $2, $3, $4, $5 )';
      const queryPerguntaAtualizar =
        'UPDATE "cliente_pergunta" SET "pergunta" = $1, "ordem" = $2, "ativo" = $3 WHERE "id_cliente" = $4 AND "id_pergunta" = $5';

      const clienteCadastrado = await client.query(queryVerificaCliente, [
        nomeSchema,
      ]);
      let id;
      let mensagem;
      id = (await clienteCadastrado.rows[0])
        ? clienteCadastrado.rows[0].id
        : null;

      for (const pergunta of perguntas) {
        const perguntaCadastrada = await client.query(queryVerificaPergunta, [
          pergunta.id,
          id,
        ]);
        if (perguntaCadastrada.rows[0]) {
          await client.query(queryPerguntaAtualizar, [
            pergunta.pergunta,
            pergunta.ordem,
            pergunta.ativo,
            id,
            pergunta.id,
          ]);
          mensagem = 'Perguntas atualizadas com sucesso!';
        } else {
          await client.query(queryPerguntaCriar, [
            pergunta.id,
            id,
            pergunta.pergunta,
            pergunta.ordem,
            pergunta.ativo,
          ]);
          mensagem = 'Perguntas cadastradas com sucesso!';
        }
      }
      await client.query('COMMIT');
      return mensagem;
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Erro na transação:', e);
      throw e;
    } finally {
      client.release();
    }
  }
  async insertMensagemFinalCliente(nomeSchema, mensagens) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const queryVerificaCliente =
        'SELECT * FROM "cliente" WHERE "nome_schema" = $1';
      const queryVerificaMensagem =
        'SELECT * FROM mensagemfinal WHERE nota = $1 AND id_cliente = $2';
      const queryMensagemCriar =
        'INSERT INTO "mensagemfinal" ( "id_cliente", "mensagem", "nota") VALUES ( $1, $2, $3 )';
      const queryMensagemAtualizar =
        'UPDATE "mensagemfinal" SET "mensagem" = $1 WHERE "id_cliente" = $2 AND "nota" = $3';

      const clienteCadastrado = await client.query(queryVerificaCliente, [
        nomeSchema,
      ]);
      let id;
      let mensagemFinal;
      id = (await clienteCadastrado.rows[0])
        ? clienteCadastrado.rows[0].id
        : null;

      for (const mensagem of mensagens) {
        const mensagemCadastrada = await client.query(queryVerificaMensagem, [
          mensagem.nota,
          id,
        ]);
        if (mensagemCadastrada.rows[0]) {
          await client.query(queryMensagemAtualizar, [
            mensagem.mensagem,
            id,
            mensagem.nota,
          ]);
          mensagemFinal = 'Mensagens atualizadas com sucesso!';
        } else {
          await client.query(queryMensagemCriar, [
            id,
            mensagem.mensagem,
            mensagem.nota,
          ]);
          mensagemFinal = 'Mensagens cadastradas com sucesso!';
        }
      }
      await client.query('COMMIT');
      return mensagemFinal;
    } catch (e) {
      await client.query('ROLLBACK');
      console.error('Erro na transação:', e);
      throw e;
    } finally {
      client.release();
    }
  }

  async getProximaPergunta(idConversa) {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      const queryVerificaResposta =
        'SELECT * FROM enviospesquisa WHERE idconversa = $1';
      const queryVerificaPerguntaAtualComId =
        'SELECT * FROM cliente_pergunta WHERE id = $1 AND ativo = true';
      const queryVerificaProximaPerguntaSemId =
        'SELECT * FROM cliente_pergunta WHERE id_cliente = $1 AND ativo = true ORDER BY ordem ASC LIMIT 1';
      const queryProximaPergunta =
        'SELECT * FROM cliente_pergunta WHERE ordem = $1';

      const respostaAtual = await client.query(queryVerificaResposta, [
        idConversa,
      ]);
      let id;

      if (respostaAtual.rows[0].idpergunta === null) {
        const proximaPergunta = await client.query(
          queryVerificaProximaPerguntaSemId,
          [respostaAtual.rows[0].idcliente],
        );
        client.query('COMMIT');
        return proximaPergunta.rows[0];
      } else {
        const perguntaAtual = await client.query(
          queryVerificaPerguntaAtualComId,
          [respostaAtual.rows[0].idpergunta],
        );
        const ordem = (await perguntaAtual.rows[0].ordem) + 1;
        const proximaPergunta = await client.query(queryProximaPergunta, [
          ordem,
        ]);

        client.query('COMMIT');

        return proximaPergunta.rows[0];
      }
    } catch (e) {
      client.query('ROLLBACK');
      console.error('Erro na transação:', e);
      throw e;
    } finally {
      client.release();
    }
  }
  async getMensagemFinal(resposta, idCliente) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');

      const queryGetResposta =
        'SELECT * FROM mensagemfinal WHERE id_cliente = $1 AND nota = $2';

      const mensagemFinal = await client.query(queryGetResposta, [
        idCliente,
        resposta,
      ]);

      client.query('COMMIT');

      return mensagemFinal.rows[0].mensagem;
    } catch (e) {
      client.query('ROLLBACK');
      console.error('Erro na transação:', e);
      throw e;
    } finally {
      client.release();
    }
  }
  async getEnviosCobradosTodos(data_inicio, data_fim) {
    const dataFimTrat = data_fim + ' 23:59:59';
    const query =
      'SELECT c.nome_schema AS schema, c.idcliente AS cnpj, c.nome AS nome_cliente,  COUNT(*) AS total FROM envioscobrados AS e INNER JOIN cliente AS c ON CAST(e.idcliente AS integer) = c.id WHERE e.datainclusao BETWEEN $1 AND $2 GROUP BY e.idcliente, c.nome, c.idcliente, c.nome_schema ORDER BY nome_cliente ASC';
    const dados = await new Promise((resolve, reject) => {
      db.query(query, [data_inicio, dataFimTrat], (erro, result) => {
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
