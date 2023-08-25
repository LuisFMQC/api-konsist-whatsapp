require("dotenv").config();
const MessageService = require("../services/messageService copy.js");
const axios = require("axios");
const { criaJwt } = require("../auth/verificaJWT.js");

async function enviaMensagem(
  idTelefone,
  token,
  idCliente,
  body,
  agendamento,
  dadosCliente,
  res
) {
  const [ano, mes, dia] = agendamento.agendamento_data.split("-");
  const data = dia + "/" + mes + "/" + ano;
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: "whatsapp",
        to: body.telefone,
        type: "template",
        template: {
          name: (await agendamento.agendamento_preparo)
            ? "confirmacao_preparo"
            : "confirmacao_agendamento",
          language: {
            code: "pt_BR",
            policy: "deterministic",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: body.paciente,
                },
                {
                  type: "text",
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: "text",
                  text: data,
                },
                {
                  type: "text",
                  text: agendamento.agendamento_hora,
                },

                {
                  type: "text",
                  text:
                    agendamento.empresa_unidade +
                    " - " +
                    agendamento.empresa_endereco /* +
                    " - Localização: " +
                    agendamento.empresa_localizacao, */,
                },
                {
                  type: "text",
                  text: agendamento.agendamento_medico,
                },
                agendamento.agendamento_preparo
                  ? {
                      type: "text",
                      text: agendamento.agendamento_preparo
                        .replace(/\n+/g, " ")
                        .replace(/\t+/g, " ")
                        .replace(/ +/g, " "),
                    }
                  : "",
              ],
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    }).then(async (response) => {
      if (res.status(200)) {
        let id = await response.data.messages[0].id;
        let payload = await new MessageService().createMessage(
          body,
          agendamento,
          idCliente,
          id
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            agendamento,
            idCliente,
            id
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      agendamento,
      idCliente
    );
    console.log("Error: " + e + "/ Telefone: " + body.telefone);
  }
}

async function enviaMensagemPesquisa(
  idTelefone,
  token,
  idCliente,
  body,
  agendamento,
  dadosCliente,
  res
) {
  const [ano, mes, dia] = agendamento.agendamento_data.split("-");
  const data = dia + "/" + mes + "/" + ano;
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: "whatsapp",
        to: body.telefone,
        type: "template",
        template: {
          name: "pesquisa_de_satisfacao",
          language: {
            code: "pt_BR",
            policy: "deterministic",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: body.paciente,
                },
                {
                  type: "text",
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: "text",
                  text: data,
                },
              ],
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    }).then(async (response) => {
      if (res.status(200)) {
        let id = await response.data.messages[0].id;
        let payload = await new MessageService().createPesquisa(
          body,
          agendamento,
          idCliente,
          id
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            agendamento,
            idCliente,
            id
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      agendamento,
      idCliente
    );
    console.log("Error: " + e + "/ Telefone: " + body.telefone);
  }
}

async function enviaMensagemBloqueio(
  idTelefone,
  token,
  idCliente,
  body,
  agendamento,
  dadosCliente,
  res
) {
  const [ano, mes, dia] = agendamento.agendamento_data.split("-");
  const data = dia + "/" + mes + "/" + ano;
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: "whatsapp",
        to: body.telefone,
        type: "template",
        template: {
          name: "aviso_bloqueio",
          language: {
            code: "pt_BR",
            policy: "deterministic",
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: body.paciente,
                },
                {
                  type: "text",
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: "text",
                  text: agendamento.agendamento_medico,
                },
                {
                  type: "text",
                  text: data,
                },
                {
                  type: "text",
                  text: agendamento.agendamento_hora,
                },
                {
                  type: "text",
                  text: dadosCliente.rows[0].contato,
                },
              ],
            },
          ],
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    }).then(async (response) => {
      if (res.status(200)) {
        let id = await response.data.messages[0].id;
        let payload = await new MessageService().createAvisoBloqueio(
          body,
          agendamento,
          idCliente,
          id
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            agendamento,
            idCliente,
            id
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      agendamento,
      idCliente
    );
    console.log("Error Bloqueio: " + e + "/ Telefone: " + body.telefone);
  }
}

const respostasAceitas = {
  async c(statusDB, idConversa, dadosCliente) {
    if (statusDB.rows[0].indstatus === null && !statusDB.rows[1]) {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        "C",
        idConversa
      );
      return "Agendamento confirmado, obrigado.";
    } else if (statusDB.rows[1].indstatus === "D") {
      return `Este agendamento já foi desmarcado anteriormente, impossibilitando assim sua confirmação! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    }
  },
  async d(statusDB, idConversa, dadosCliente) {
    if (statusDB.rows[0].indstatus === null) {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        "D",
        idConversa
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    } else if (statusDB.rows[0].indstatus === "C") {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        "D",
        idConversa
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    } else if (statusDB.rows[0].indstatus === "C") {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        "D",
        idConversa
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    }
  },

  async s(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroContato(
      idConversa
    );
    await new MessageService().novoRegistroContato(
      dadosContato.rows[0],
      idConversa,
      resposta
    );
    return "A clínica entrará em contato com você em breve para realizar a remarcação do seu agendamento. Muito obrigado e tenha um ótimo dia!";
  },

  async n(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroContato(
      idConversa
    );
    await new MessageService().novoRegistroContato(
      dadosContato.rows[0],
      idConversa,
      resposta
    );
    return "Muito obrigado pela resposta e tenha um ótimo dia!";
  },

  async rp(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroPesquisa(
      idConversa
    );
    await new MessageService().novoRegistroPesquisa(
      dadosContato.rows[0],
      idConversa,
      resposta
    );
    await new MessageService().novoRegistroNota(
      dadosContato.rows[0],
      idConversa,
      null
    );
    return;
  },

  async nr(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroPesquisa(
      idConversa
    );
    await new MessageService().novoRegistroPesquisa(
      dadosContato.rows[0],
      idConversa,
      resposta
    );
    return "Muito obrigado pela resposta e tenha um ótimo dia!";
  },

  async 1(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      "1"
    );
    return "Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!";
  },

  async 2(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      "2"
    );
    return "Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!";
  },

  async 3(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      "3"
    );
    return "Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!";
  },

  async 4(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      "4"
    );
    return "Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!";
  },

  async 5(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      "5"
    );
    return "Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!";
  },
};

async function verifyStatus(status, idConversa, dadosCliente) {
  const statusDB = await new MessageService().getStatus(idConversa);
  const respostaAut = respostasAceitas[status];
  return respostaAut(statusDB, idConversa, dadosCliente);
}

async function verificaResposta(resposta, idConversa) {
  const respostaAut = respostasAceitas[resposta];
  return respostaAut(resposta, idConversa);
}

function verificaBody(req) {
  if (
    req.body.entry &&
    req.body.entry[0].changes &&
    req.body.entry[0].changes[0] &&
    req.body.entry[0].changes[0].value.messages &&
    req.body.entry[0].changes[0].value.messages[0]
  )
    return true;
  else return false;
}

async function enviaResposta(num, token, para, verifica) {
  try {
    await axios({
      method: "POST",
      url:
        "https://graph.facebook.com/v12.0/" +
        num +
        "/messages?access_token=" +
        token,
      data: {
        messaging_product: "whatsapp",
        to: para,
        text: {
          body: await verifica,
        },
      },
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e.message);
  }
}

async function enviaPergunta(num, token, para, idMensagem, res) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v15.0/${num}/messages?access_token=${token}`,
      data: {
        messaging_product: "whatsapp",
        to: para,
        type: "template",
        template: {
          name: "pergunta_contato",
          language: {
            code: "pt_BR",
            policy: "deterministic",
          },
        },
        headers: {
          "Content-Type": "application/json",
        },
      },
    }).then(async (response) => {
      if (res.status(200)) {
        let id = await response.data.messages[0].id;
        let payload = await new MessageService().getMessageById(idMensagem);
        let contato = await new MessageService().novoRegistroContato(
          payload.rows[0],
          id,
          null
        );
      }
    });
  } catch (e) {
    console.log(e.message);
  }
}
async function enviaPesquisa(num, token, para, idMensagem, res) {
  try {
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v15.0/${num}/messages?access_token=${token}`,
      data: {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: para,
        type: "interactive",
        interactive: {
          type: "list",
          header: {
            type: "text",
            text: "Pesquisa de Satisfação",
          },
          body: {
            text: "Selecione uma nota clicando no botão 'Dar nota' abaixo.",
          },

          action: {
            button: "Dar nota",
            sections: [
              {
                title: "Selecione uma nota:",
                rows: [
                  {
                    id: "1",
                    title: "Péssimo",
                    description: "1",
                  },
                  {
                    id: "2",
                    title: "Ruim",
                    description: "2",
                  },
                  {
                    id: "3",
                    title: "Bom",
                    description: "3",
                  },
                  {
                    id: "4",
                    title: "Ótimo",
                    description: "4",
                  },
                  {
                    id: "5",
                    title: "Excelente",
                    description: "5",
                  },
                ],
              },
            ],
          },
        },
      },
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      if (res.status(200)) {
        let id = await response.data.messages[0].id;
        let payload = await new MessageService().getMessageByIdPesquisa(
          idMensagem
        );
        let contato = await new MessageService().novoRegistroNota(
          payload.rows[0],
          id,
          null
        );
      }
    });
  } catch (e) {
    console.log(e.message);
  }
}

exports.get = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getAllMessages(
        body,
        dadosCliente.rows[0].id
      );
      res.status(200).send(payload.rows);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.getPesquisa = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getAllNotas(
        body,
        dadosCliente.rows[0].id
      );
      res.status(200).send(payload.rows);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.getSolicitacaoContato = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getSolicitacaoContato(
        body.id,
        dadosCliente.rows[0].id
      );
      res.status(200).send(payload.rows);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.getRelatorioCobranca = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    body.data_inicial ? (body.data_inicial += " 00:00:00") : "";
    body.data_final ? (body.data_final += " 23:59:59") : "";
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioCobranca(
        body,
        dadosCliente.rows[0].id
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = "";
          }
        }
      });
      res.status(200).send(payload.rows);
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
    // next(error);
  }
};

exports.getRelatorioEnvio = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    body.data_inicial ? (body.data_inicial += " 00:00:00") : "";
    body.data_final ? (body.data_final += " 23:59:59") : "";
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioEnvio(
        body,
        dadosCliente.rows[0].id
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = "";
          }
        }
      });
      res.status(200).send(payload.rows);
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
    // next(error);
  }
};

exports.getRelatorioEnvioUnico = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    body.data_inicial ? (body.data_inicial += " 00:00:00") : "";
    body.data_final ? (body.data_final += " 23:59:59") : "";
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioEnvioUnico(
        body.chave,
        dadosCliente.rows[0].id
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = "";
          }
        }
      });
      if (payload.rows.length > 0) res.status(201).send(payload.rows);
      else res.status(200).send("Nenhum agendamento encontrato!");
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
    // next(error);
  }
};

exports.getRelatorioFalhaUnico = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    body.data_inicial ? (body.data_inicial += " 00:00:00") : "";
    body.data_final ? (body.data_final += " 23:59:59") : "";
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioFalhaUnico(
        body.chave,
        dadosCliente.rows[0].id
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = "";
          }
        }
      });
      if (payload.rows.length > 0) res.status(201).send(payload.rows);
      else res.status(200).send("Nenhum agendamento encontrato!");
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
    // next(error);
  }
};
exports.getRelatorioFalha = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    body.data_inicial ? (body.data_inicial += " 00:00:00") : "";
    body.data_final ? (body.data_final += " 23:59:59") : "";
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioFalha(
        body,
        dadosCliente.rows[0].id
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = "";
          }
        }
      });
      res.status(200).send(payload.rows);
    }
  } catch (error) {
    res.status(400).send({
      message: error,
    });
    // next(error);
  }
};
// Criar ou atualizar cliente no DB

exports.getClienteServico = async (req, res, next) => {
  try {
    const body = req.body;
    const dadosClienteServico = await new MessageService().getClienteServico(
      body.nome_schema
    );
    res.status(200).send(
      dadosClienteServico.rows.map((servico) => {
        return servico;
      })
    );
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.postServico = async (req, res, next) => {
  try {
    const body = req.body;
    await new MessageService().insertServico(body.descricao);
    res.status(200).send("Serviço criado com sucesso.");
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.postCliente = async (req, res, next) => {
  try {
    const body = await req.body;
    // const testandoCliente = await new MessageService().getClienteBySchema(
    //   body.nome_schema
    // );
    // const id = (await testandoCliente.rows[0])
    //   ? testandoCliente.rows[0].id
    //   : "";
    // const schema = (await testandoCliente.rows[0])
    //   ? testandoCliente.rows[0].nome_schema
    //   : "";
    const { id, mensagem } = await new MessageService().createCliente(
      body,
      body.servicos
    );
    //verificação se o cliente já existe
    // if (id) {
    //   //Caso o cliente exista atualizo o tokenwhatsapp e o idtelefonewhatsapp
    //   const updateCliente = await new MessageService().updateCliente(body);
    //   await body.servicos.map(async (servico) => {
    //     const testandoServico = await new MessageService().getServicoCliente(
    //       servico.id,
    //       id
    //     );
    //     if (testandoServico.rows[0]) {
    //       const novoServico = await new MessageService().updateServicoCliente(
    //         servico,
    //         id
    //       );
    //     } else {
    //       const novoServico = await new MessageService().createServicoCliente(
    //         servico,
    //         id
    //       );
    //       console.log(novoServico);
    //     }
    //   });
    res.status(200).send(criaJwt(id, body.nome_schema, mensagem));
    // }
    // } else {
    //   //Caso cliente não exista no DB ele será criado.
    //   const createCliente = await new MessageService().createCliente(body);
    //   const cliente = await new MessageService().getClienteBySchema(
    //     body.nome_schema
    //   );
    //   await body.servicos.map(async (servico) => {
    //     await new MessageService().createServicoCliente(
    //       servico,
    //       cliente.rows[0].id
    //     );
    //   });
    //   // console.log(await createCliente);
    //   res
    //     .status(200)
    //     .send(
    //       criaJwt(
    //         cliente.rows[0].id,
    //         cliente.rows[0].nome_schema,
    //         "Cliente criado com sucesso."
    //       )
    //     );
    // }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

//Recebimento dos dados do atendimento e envio da mensagem para o paciente
exports.postMessage = async (req, res, next) => {
  try {
    let body = await req.body;
    let dadosCliente = await new MessageService().getClienteBySchema(
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      if (!Array.isArray(body)) {
        body.agendamento.map(async (agendamento) => {
          await enviaMensagem(
            idTelefone,
            token,
            idCliente,
            body,
            agendamento,
            dadosCliente,
            res
          );
        });
      } else {
        try {
          body.forEach(async (data, i) => {
            try {
              setTimeout(async () => {
                try {
                  await data.agendamento.map((agendamento, j) => {
                    setTimeout(async () => {
                      try {
                        await enviaMensagem(
                          idTelefone,
                          token,
                          idCliente,
                          data,
                          agendamento,
                          dadosCliente,
                          res
                        );
                      } catch (e) {
                        console.log(e.message);
                        next(e);
                      }
                    }, i * 1000 + j * 1000);
                  });
                } catch (e) {
                  console.log(error);
                  next(e);
                }
              }, i * 1000);
            } catch (e) {
              console.log(e.message);
            }
          });
        } catch (e) {
          console.log(e.message);
          next(e);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.log("Erro no Envio da mensagem de confirmação!");
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.postAvisoBloqueio = async (req, res, next) => {
  try {
    let body = await req.body;
    let dadosCliente = await new MessageService().getClienteBySchema(
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      if (!Array.isArray(body)) {
        body.agendamento.map(async (agendamento) => {
          await enviaMensagemBloqueio(
            idTelefone,
            token,
            idCliente,
            body,
            agendamento,
            dadosCliente,
            res
          );
        });
      } else {
        try {
          body.forEach(async (data, i) => {
            try {
              setTimeout(async () => {
                try {
                  await data.agendamento.map((agendamento, j) => {
                    setTimeout(async () => {
                      try {
                        await enviaMensagemBloqueio(
                          idTelefone,
                          token,
                          idCliente,
                          data,
                          agendamento,
                          dadosCliente,
                          res
                        );
                      } catch (e) {
                        console.log(e.message);
                        next(e);
                      }
                    }, i * 1000 + j * 1000);
                  });
                } catch (e) {
                  console.log(error);
                  next(e);
                }
              }, i * 1000);
            } catch (e) {
              console.log(e.message);
            }
          });
        } catch (e) {
          console.log(e.message);
          next(e);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.log("Erro no Aviso de Bloqueio!");
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.postPesquisa = async (req, res, next) => {
  try {
    let body = await req.body;
    let dadosCliente = await new MessageService().getClienteBySchema(
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      if (!Array.isArray(body)) {
        body.agendamento.map(async (agendamento) => {
          await enviaMensagemPesquisa(
            idTelefone,
            token,
            idCliente,
            body,
            agendamento,
            dadosCliente,
            res
          );
        });
      } else {
        try {
          body.forEach(async (data, i) => {
            try {
              setTimeout(async () => {
                try {
                  await enviaMensagemPesquisa(
                    idTelefone,
                    token,
                    idCliente,
                    data,
                    data.agendamento[0],
                    dadosCliente,
                    res
                  );
                } catch (e) {
                  console.log(error);
                  next(e);
                }
              }, i * 1000);
            } catch (e) {
              console.log(e.message);
            }
          });
        } catch (e) {
          console.log(e.message);
          next(e);
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    console.log("Erro no PostPesquisa!");
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.postWebhook = async (req, res, next) => {
  try {
    let body = await req.body;

    //console.log(JSON.stringify(body, null, 2));

    if (body.object) {
      if (verificaBody(req)) {
        let phone_number_id = await body.entry[0].changes[0].value.metadata
          .phone_number_id;
        let from = await body.entry[0].changes[0].value.messages[0].from;

        if (body.entry[0].changes[0].value.messages[0].button) {
          if (
            body.entry[0].changes[0].value.messages[0].button.payload ===
              "Confirmar" ||
            body.entry[0].changes[0].value.messages[0].button.payload ===
              "Desmarcar"
          ) {
            const status =
              (await body.entry[0].changes[0].value.messages[0].button
                .payload) === "Confirmar"
                ? "c"
                : "d";
            const idCliente = await new MessageService().getIdCliente(
              body.entry[0].changes[0].value.messages[0].context.id
            );
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente
                )
              : null;
            const token =
              (await dadosCliente) !== null &&
              (await dadosCliente.rowCount) !== 0
                ? await dadosCliente.rows[0].tokenwhatsapp
                : null;

            if (token) {
              enviaResposta(
                phone_number_id,
                token,
                from,
                verifyStatus(
                  status,
                  req.body.entry[0].changes[0].value.messages[0].context.id,
                  dadosCliente
                )
              );
              // if (status === 'd') {
              //   enviaPergunta(
              //     phone_number_id,
              //     token,
              //     from,
              //     req.body.entry[0].changes[0].value.messages[0].context.id,
              //     res,
              //   );
              // }
            }
          } else if (
            body.entry[0].changes[0].value.messages[0].button.payload ===
              "Sim" ||
            body.entry[0].changes[0].value.messages[0].button.payload === "Não"
          ) {
            const resposta =
              (await body.entry[0].changes[0].value.messages[0].button
                .payload) === "Sim"
                ? "s"
                : "n";
            const idCliente = await new MessageService().getIdClienteContato(
              body.entry[0].changes[0].value.messages[0].context.id
            );
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente
                )
              : null;
            const token =
              (await dadosCliente) !== null &&
              (await dadosCliente.rowCount) !== 0
                ? await dadosCliente.rows[0].tokenwhatsapp
                : null;
            if (token) {
              enviaResposta(
                phone_number_id,
                token,
                from,
                verificaResposta(
                  resposta,
                  req.body.entry[0].changes[0].value.messages[0].context.id
                )
              );
            }
          } else if (
            body.entry[0].changes[0].value.messages[0].button.payload ===
              "Responder pesquisa" ||
            body.entry[0].changes[0].value.messages[0].button.payload ===
              "Não responder"
          ) {
            const resposta =
              (await body.entry[0].changes[0].value.messages[0].button
                .payload) === "Responder pesquisa"
                ? "rp"
                : "nr";
            console.log(resposta);
            const idCliente = await new MessageService().getIdClientePesquisa(
              body.entry[0].changes[0].value.messages[0].context.id
            );
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente
                )
              : null;
            const token =
              (await dadosCliente) !== null &&
              (await dadosCliente.rowCount) !== 0
                ? await dadosCliente.rows[0].tokenwhatsapp
                : null;
            if (token) {
              enviaResposta(
                phone_number_id,
                token,
                from,
                verificaResposta(
                  resposta,
                  req.body.entry[0].changes[0].value.messages[0].context.id
                )
              );
              if (resposta === "rp") {
                enviaPesquisa(
                  phone_number_id,
                  token,
                  from,
                  req.body.entry[0].changes[0].value.messages[0].context.id,
                  res
                );
              }
            }
          }
        } else if (body.entry[0].changes[0].value.messages[0].interactive) {
          if (
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "1" ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "2" ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "3" ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "4" ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === "5"
          ) {
            const resposta = await body.entry[0].changes[0].value.messages[0]
              .interactive.list_reply.id;
            const idCliente = await new MessageService().getIdClienteNota(
              body.entry[0].changes[0].value.messages[0].context.id
            );
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente
                )
              : null;
            const token =
              (await dadosCliente) !== null &&
              (await dadosCliente.rowCount) !== 0
                ? await dadosCliente.rows[0].tokenwhatsapp
                : null;
            if (token) {
              enviaResposta(
                phone_number_id,
                token,
                from,
                verificaResposta(
                  resposta,
                  req.body.entry[0].changes[0].value.messages[0].context.id
                )
              );
            }
          }
        } else {
          const dadosCliente =
            await new MessageService().getClienteByIdTelefone(phone_number_id);
          const token = dadosCliente
            ? await dadosCliente.rows[0].tokenwhatsapp
            : null;
          const mensagem =
            "Não entendi, por favor selecione um dos botões na mensagem acima para confirmar ou desmarcar seu atendimento.";
          if (token) {
            enviaResposta(phone_number_id, token, from, mensagem);
          }
        }
      }
    }
    res.sendStatus(200);
  } catch (e) {
    //console.log("Error na resposta: " + e.message);
    // next(e);
    res.sendStatus(404);
  }
};

exports.getwebhook = async (req, res) => {
  const challenge = req.query["hub.challenge"];
  const verify_token = req.query["hub.verify_token"];

  if (verify_token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge); // Just the challenge
  }
  return res.status(400).send({ message: "Bad request!" });
};
