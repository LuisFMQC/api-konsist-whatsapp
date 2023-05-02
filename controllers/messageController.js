require("dotenv").config();
const MessageService = require("../services/messageService.js");
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
          name: "confirmacao_atendimento",
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
                    agendamento.empresa_endereco,
                },
                {
                  type: "text",
                  text: agendamento.agendamento_medico,
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
        let payload = await new MessageService().createMessage(
          body,
          agendamento,
          idCliente,
          id
        );
      }
    });
  } catch (e) {
    console.log(
      "Error: O número de telefone " + body.telefone + " é inválido."
    );
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
    }
  },
};

async function verifyStatus(status, idConversa, dadosCliente) {
  const statusDB = await new MessageService().getStatus(idConversa);
  const respostaAut = respostasAceitas[status];
  return respostaAut(statusDB, idConversa, dadosCliente);
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
  axios({
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
  }
};
// Criar ou atualizar cliente no DB
exports.postCliente = async (req, res, next) => {
  try {
    const body = await req.body;
    const testandoCliente = await new MessageService().getClienteBySchema(
      body.nome_schema
    );
    const id = testandoCliente.rows[0].id;
    const schema = testandoCliente.rows[0].nome_schema;
    //verificação se o cliente já existe
    if (testandoCliente.rows[0]) {
      //Caso o cliente exista atualizo o tokenwhatsapp e o idtelefonewhatsapp
      const updateCliente = await new MessageService().updateCliente(body);
      res
        .status(200)
        .send(criaJwt(id, schema, "Cliente atualizado com sucesso."));
      // }
    } else {
      //Caso cliente não exista no DB ele será criado.
      const createCliente = await new MessageService().createCliente(body);
      const cliente = await new MessageService().getClienteBySchema(
        body.nome_schema
      );
      res
        .status(200)
        .send(
          criaJwt(
            cliente.rows[0].id,
            cliente.rows[0].nome_schema,
            "Cliente criado com sucesso."
          )
        );
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
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
        body.forEach(async (data) => {
          data.agendamento.map(async (agendamento) => {
            await enviaMensagem(
              idTelefone,
              token,
              idCliente,
              data,
              agendamento,
              dadosCliente,
              res
            );
          });
        });
      }
      // await enviaMensagem(
      //   idTelefone,
      //   token,
      //   idCliente,
      //   body,
      //   dadosCliente,
      //   res
      // );
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

exports.postWebhook = async (req, res, next) => {
  let body = req.body;

  // console.log(JSON.stringify(body, null, 2));

  if (req.body.object) {
    if (verificaBody(req)) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from;

      if (req.body.entry[0].changes[0].value.messages[0].button) {
        const status =
          req.body.entry[0].changes[0].value.messages[0].button.payload ===
          "Confirmar"
            ? "c"
            : "d";
        const idCliente = await new MessageService().getIdCliente(
          req.body.entry[0].changes[0].value.messages[0].context.id
        );
        const dadosCliente = idCliente.rows[0]
          ? await new MessageService().getClienteById(
              idCliente.rows[0].idcliente
            )
          : null;
        const token =
          dadosCliente !== null && dadosCliente.rowCount !== 0
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
        }
      } else {
        const dadosCliente = await new MessageService().getClienteByIdTelefone(
          phone_number_id
        );
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
    res.sendStatus(200);
  } else {
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
