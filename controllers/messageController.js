require('dotenv').config();
const MessageService = require('../services/messageService.js');
const axios = require('axios');

exports.get = async (req, res, next) => {
  const body = req.body;
  const payload = await new MessageService().getAllMessages(body);
  res.status(200).send(payload.rows);
};
// Criar ou atualizar cliente no DB
exports.postCliente = async (req, res, next) => {
  try {
    const body = req.body;
    const testandoCliente = await new MessageService().getClienteByIdCliente(
      body.idcliente,
    ); //verificação se o cliente já existe
    if (testandoCliente.rows[0].status === true) {
      //Caso o cliente exista atualizo o tokenwhatsapp e o idtelefonewhatsapp
      const updateCliente = await new MessageService().updateCliente(body);
      res.status(200).send(updateCliente);
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
    let dadosCliente = await new MessageService().getClienteById(
      body.idcliente,
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
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
                    text: 'Luis Fernando',
                  },
                  {
                    type: 'text',
                    text: '16/12/2022',
                  },
                  {
                    type: 'text',
                    text: '14:15',
                  },
                  {
                    type: 'text',
                    text: 'Teste da Silva',
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
          let payload = await new MessageService().createMessage(body, id);
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

function replyToClient(reply) {
  if (reply === 'Confirmar') return 'Agendamento confirmado!';
  if (reply === 'Desmarcar')
    return 'Agendamento desmarcardo, entre em contato conosco no xxxx-xxxx para agendar novamente caso deseje.';
}

async function verifyStatus(status, idConversa) {
  if (status !== null && status === 'c') {
    const statusDB = await new MessageService().getStatus(idConversa);
    if (statusDB.rows[0].indstatus === 'a') {
      const payload = await new MessageService().updateStatus(
        status,
        idConversa,
      );
      return 'Agendamento confirmado, obrigado.';
    } else if (statusDB.rows[0].indstatus === 'd') {
      return 'Este agendamento já foi desmarcado anteriormente, impossibilitando assim sua confirmação! Caso deseje remarcar o atendimento, favor entrar em contato conosco no XXXX-XXXX';
    }
  }
  if (status !== null && status === 'd') {
    const statusDB = await new MessageService().getStatus(idConversa);
    if (statusDB.rows[0].indstatus === 'a') {
      const payload = await new MessageService().updateStatus(
        status,
        idConversa,
      );
      return 'Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no XXXX-XXXX';
    } else if (statusDB.rows[0].indstatus === 'c') {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        status,
        idConversa,
      );
      return 'Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no XXXX-XXXX';
    }
  }
}
exports.postWebhook = async (req, res, next) => {
  let body = req.body;

  console.log(JSON.stringify(body, null, 2));

  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {
      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from;

      if (req.body.entry[0].changes[0].value.messages[0].button) {
        const msg_body =
          req.body.entry[0].changes[0].value.messages[0].button.payload;

        if (msg_body === 'Confirmar' || msg_body === 'Desmarcar') {
          const resposta = msg_body === 'Confirmar' ? 'c' : 'd';
          const idConversa = await req.body.entry[0].changes[0].value
            .messages[0].context.id;
          const idCliente = await new MessageService().getIdCliente(idConversa);
          const dadosCliente = idCliente.rows[0]
            ? await new MessageService().getClienteById(
                idCliente.rows[0].idcliente,
              )
            : null;
          const token = dadosCliente
            ? await dadosCliente.rows[0].tokenwhatsapp
            : null;

          if (token !== null) {
            console.log('Enviando mensagem');
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
                  body: await verifyStatus(resposta, idConversa),
                },
              },
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
      }
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
};
