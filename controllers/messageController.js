require('dotenv').config();
const MessageService = require('../services/messageService.js');
const axios = require('axios');
// const token = process.env.WHATSAPP_TOKEN;

exports.get = async (req, res, next) => {
  const body = req.body;
  const payload = await new MessageService().getAllMessages(body);
  res.status(200).send(payload.rows);
};

exports.postCliente = async (req, res, next) => {
  try {
    const body = req.body;
    const testandoCliente = await new MessageService().getClienteByIdCliente(
      body.idcliente,
    );
    if (testandoCliente.rows[0].status === true) {
      const updateCliente = await new MessageService().updateCliente(body);
      res.status(200).send(updateCliente);
    } else {
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

exports.postMessage = async (req, res, next) => {
  try {
    const body = req.body;
    const dadosCliente = await new MessageService().getClienteById(
      body.idcliente,
    );
    const token = await dadosCliente.rows[0].tokenwhatsapp;
    const idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    if (res.status(200)) {
      axios({
        method: 'POST',
        url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
        data: {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
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
        try {
          const id = await response.data.messages[0].id;
          const payload = await new MessageService().createMessage(body, id);
          // const data = await new MessageService().updateMessage(id, body);
          res.status(200).send(payload);
        } catch (error) {
          res.status(400).send({
            message: error.message,
          });
        }
      });
    }
    // res.sendStatus(200);
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
  }
};

function ReplyToClient(reply) {
  if (reply === 'Confirmar') return 'Agendamento confirmado!';
  if (reply === 'Desmarcar')
    return 'Agendamento desmarcardo, entre em contato conosco no xxxx-xxxx para agendar novamente caso deseje.';
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
          const payload = await new MessageService().updateStatus(
            resposta,
            idConversa,
          );
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
                  body: ReplyToClient(msg_body),
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
