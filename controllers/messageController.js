require('dotenv').config();
const MessageService = require('../services/messageService.js');
const axios = require('axios');

exports.get = async (req, res, next) => {
  const body = await req.body;
  console.log(body);
  const dadosCliente = await new MessageService().getClienteBySchema(
    body.nome_schema,
  );
  if (dadosCliente.rows[0]) {
    const payload = await new MessageService().getAllMessages(
      body,
      dadosCliente.rows[0].id,
    );
    res.status(200).send(payload.rows);
  } else {
    res.sendStatus(400);
  }
};
// Criar ou atualizar cliente no DB
exports.postCliente = async (req, res, next) => {
  try {
    const body = await req.body;
    console.log(body);
    const testandoCliente = await new MessageService().getClienteByIdCliente(
      body.idcliente,
    ); //verificação se o cliente já existe
    if (testandoCliente.rows[0]) {
      if (testandoCliente.rows[0].status === true) {
        //Caso o cliente exista atualizo o tokenwhatsapp e o idtelefonewhatsapp
        const updateCliente = await new MessageService().updateCliente(body);
        res.status(200).send(updateCliente);
      }
    } else {
      //Caso cliente não exista no DB ele será criado.
      const createCliente = await new MessageService().createCliente(body);
      const cliente = await new MessageService().getClienteByIdCliente(
        body.idcliente,
      );
      res.status(200).send(cliente.rows);
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
      body.nome_schema,
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      console.log('Enviando mensagem!');
      await axios({
        method: 'POST',
        url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
        data: {
          messaging_product: 'whatsapp',
          // recipient_type: 'individual',
          to: body.contato,
          type: 'template',
          template: {
            name: 'confirmacao_atendimento',
            language: {
              code: 'pt_BR',
              policy: 'deterministic',
            },
            components: [
              {
                type: 'body',
                parameters: [
                  {
                    type: 'text',
                    text: body.nomepaciente,
                  },
                  {
                    type: 'text',
                    text: dadosCliente.rows[0].nome,
                  },
                  {
                    type: 'text',
                    text: body.data_atendimento,
                  },
                  {
                    type: 'text',
                    text: body.hora_atendimento,
                  },

                  {
                    type: 'text',
                    text: body.localatendimento,
                  },
                  {
                    type: 'text',
                    text: body.medico,
                  },
                ],
              },
            ],
          },
          headers: {
            'Content-Type': 'application/json',
          },
        },
      }).then(async (response) => {
        if (res.status(200)) {
          let id = await response.data.messages[0].id;
          let payload = await new MessageService().createMessage(
            body,
            idCliente,
            id,
          );
        }
      });
    }
    res.sendStatus(200);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

async function verifyStatus(status, idConversa, dadosCliente) {
  const statusDB = await new MessageService().getStatus(idConversa);
  if (status !== null && status === 'c') {
    if (statusDB.rows[0].indstatus === null) {
      const payload = await new MessageService().updateStatus(
        status,
        idConversa,
      );
      return 'Agendamento confirmado, obrigado.';
    } else if (statusDB.rows[0].indstatus === 'd') {
      return `Este agendamento já foi desmarcado anteriormente, impossibilitando assim sua confirmação! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    }
  }
  if (status !== null && status === 'd') {
    if (statusDB.rows[0].indstatus === null) {
      const payload = await new MessageService().updateStatus(
        status,
        idConversa,
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    } else if (statusDB.rows[0].indstatus === 'c') {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        status,
        idConversa,
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    }
  }
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
exports.postWebhook = async (req, res, next) => {
  let body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (req.body.object) {
    if (verificaBody(req)) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from;

      if (req.body.entry[0].changes[0].value.messages[0].button) {
        const status =
          req.body.entry[0].changes[0].value.messages[0].button.payload ===
          'Confirmar'
            ? 'c'
            : 'd';
        const idCliente = await new MessageService().getIdCliente(
          req.body.entry[0].changes[0].value.messages[0].context.id,
        );
        const dadosCliente = idCliente.rows[0]
          ? await new MessageService().getClienteById(
              idCliente.rows[0].idcliente,
            )
          : null;
        const token = dadosCliente
          ? await dadosCliente.rows[0].tokenwhatsapp
          : null;

        if (token !== null) {
          axios({
            method: 'POST',
            url:
              'https://graph.facebook.com/v12.0/' +
              phone_number_id +
              '/messages?access_token=' +
              token,
            data: {
              messaging_product: 'whatsapp',
              to: from,
              text: {
                body: await verifyStatus(
                  status,
                  req.body.entry[0].changes[0].value.messages[0].context.id,
                  dadosCliente,
                ),
              },
            },
            headers: { 'Content-Type': 'application/json' },
          });
        }
      } else {
        const dadosCliente = await new MessageService().getClienteByIdTelefone(
          phone_number_id,
        );
        const token = dadosCliente
          ? await dadosCliente.rows[0].tokenwhatsapp
          : null;
        if (token !== null) {
          axios({
            method: 'POST',
            url:
              'https://graph.facebook.com/v12.0/' +
              phone_number_id +
              '/messages?access_token=' +
              token,
            data: {
              messaging_product: 'whatsapp',
              to: from,
              text: {
                body: 'Não entendi, por favor selecione um dos botões na mensagem acima para confirmar ou desmarcar seu atendimento.',
              },
            },
            headers: { 'Content-Type': 'application/json' },
          });
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
