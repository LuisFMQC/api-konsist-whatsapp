require('dotenv').config();
const MessageService = require('../services/messageService.js');
const axios = require('axios');
const { criaJwt } = require('../auth/verificaJWT.js');
const crypto = require('crypto');

// const secretKey = Buffer.from(crypto.randomBytes(32));
const secretKey = 'J#v8Lw$u2xRn*G@5FhQyD9p!sZm@K#o7';
// const iv = crypto.randomBytes(16);
const iv = 'A9b#4fGh2PqL7sR1';

async function enviaMensagem(
  idTelefone,
  token,
  idCliente,
  body,
  agendamento,
  dadosCliente,
  res,
) {
  const [ano, mes, dia] = agendamento.agendamento_data.split('-');
  const data = dia + '/' + mes + '/' + ano;
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: body.telefone,
        type: 'template',
        template: {
          name: (await agendamento.agendamento_preparo)
            ? 'confirmacao_preparo_backup'
            : 'confirmacao_agendamento_backup',
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
                  text: body.paciente,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: 'text',
                  text: data,
                },
                {
                  type: 'text',
                  text: agendamento.agendamento_hora,
                },

                {
                  type: 'text',
                  text:
                    agendamento.empresa_unidade +
                    ' - ' +
                    agendamento.empresa_endereco +
                    (agendamento.empresa_complemento ? ' ' : '') +
                    agendamento.empresa_complemento,
                },
                {
                  type: 'text',
                  text: agendamento.agendamento_medico,
                },
                agendamento.agendamento_preparo
                  ? {
                      type: 'text',
                      text: agendamento.agendamento_preparo
                        .replace(/\n+/g, ' ')
                        .replace(/\t+/g, ' ')
                        .replace(/ +/g, ' '),
                    }
                  : '',
                agendamento.empresa_link
                  ? {
                      type: 'text',
                      text:
                        agendamento.empresa_link != ''
                          ? 'Localização: ' + agendamento.empresa_link
                          : ' ',
                    }
                  : {
                      type: 'text',
                      text: ' ',
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
          agendamento,
          idCliente,
          id,
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone,
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            agendamento,
            idCliente,
            1,
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      agendamento,
      idCliente,
    );
    console.log('Error: ' + e + '/ Telefone: ' + body.telefone);
  }
}

async function enviaMensagemPesquisa(
  idTelefone,
  token,
  idCliente,
  body,
  agendamento,
  dadosCliente,
  res,
) {
  const [ano, mes, dia] = agendamento.agendamento_data.split('-');
  const data = dia + '/' + mes + '/' + ano;
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: body.telefone,
        type: 'template',
        template: {
          name: 'pesquisa_de_satisfacao',
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
                  text: body.paciente,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: 'text',
                  text: data,
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
        let payload = await new MessageService().createPesquisa(
          body,
          agendamento,
          idCliente,
          id,
          null,
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone,
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            agendamento,
            idCliente,
            6,
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      agendamento,
      idCliente,
    );
    console.log('Error: ' + e + '/ Telefone: ' + body.telefone);
  }
}

async function enviaMensagemToken(
  idTelefone,
  token,
  idCliente,
  body,
  agendamento,
  dadosCliente,
  res,
) {
  const [ano, mes, dia] = agendamento.agendamento_data.split('-');
  const data = dia + '/' + mes + '/' + ano;
  const parametroOriginal = JSON.stringify({
    chave: agendamento.agendamento_chave,
    idcliente: dadosCliente.rows[0].id,
  });
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(secretKey),
    iv,
  );
  let parametroCriptografado = cipher.update(
    parametroOriginal,
    'utf8',
    'base64',
  );
  parametroCriptografado += cipher.final('base64');
  let url = `https://token.konsist.com.br/?param=${encodeURIComponent(
    parametroCriptografado,
  )}`;
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: body.telefone,
        type: 'template',
        template: {
          name: 'aviso_token_backup',
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
                  text: agendamento.responsavel
                    ? agendamento.responsavel
                    : '---',
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: 'text',
                  text: body.paciente,
                },
                {
                  type: 'text',
                  text: data,
                },
                {
                  type: 'text',
                  text: agendamento.senha_autorizacao
                    ? agendamento.senha_autorizacao
                    : '---',
                },
                {
                  type: 'text',
                  text: url,
                  // agendamento.agendamento_chave +
                  // '&idcliente=' +
                  // dadosCliente.rows[0].id,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].contato,
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
        let payload = await new MessageService().createEnvioToken(
          body,
          agendamento,
          idCliente,
          id,
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone,
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            agendamento,
            idCliente,
            3,
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      agendamento,
      idCliente,
    );
    console.log('Error Envio Token: ' + e + '/ Telefone: ' + body.telefone);
  }
}

async function enviaMensagemRecaptacao(
  idTelefone,
  token,
  idCliente,
  body,
  dadosCliente,
  res,
) {
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: body.telefone,
        type: 'template',
        template: {
          name: 'recaptacao_paciente_backup',
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
                  text: body.paciente,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].contato,
                },
                {
                  type: 'text',
                  text: body.slogan ? body.slogan : ' ',
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].nome,
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
        let payload = await new MessageService().createEnvioRecaptacao(
          body,
          idCliente,
          id,
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone,
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            null,
            idCliente,
            5,
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      null,
      idCliente,
    );
    console.log(
      'Error Envio Recaptação: ' + e + '/ Telefone: ' + body.telefone,
    );
  }
}
async function enviaMensagemAvulsa(
  idTelefone,
  token,
  idCliente,
  body,
  dadosCliente,
  res,
) {
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: body.telefone,
        type: 'template',
        template: {
          name: 'teste_avulso',
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
                  text: body.paciente,
                },
                {
                  type: 'text',
                  text: body.mensagem
                    .replace(/\n+/g, ' ')
                    .replace(/\t+/g, ' ')
                    .replace(/ +/g, ' '),
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].contato,
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
        let payload = await new MessageService().createEnvioAvulso(
          body,
          idCliente,
          id,
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone,
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            null,
            idCliente,
            7,
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      null,
      idCliente,
    );
    console.log('Error Envio Avulsa: ' + e + '/ Telefone: ' + body.telefone);
  }
}
async function enviaMensagemAniversario(
  idTelefone,
  token,
  idCliente,
  body,
  dadosCliente,
  res,
) {
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: body.telefone,
        type: 'template',
        template: {
          name: 'aniversario_paciente',
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
                  text: body.paciente,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].nome,
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
        let payload = await new MessageService().createEnvioAniversario(
          body,
          idCliente,
          id,
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone,
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            null,
            idCliente,
            4,
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      null,
      idCliente,
    );
    console.log(
      'Error Envio Aniversário: ' + e + '/ Telefone: ' + body.telefone,
    );
  }
}

async function enviaMensagemBloqueio(
  idTelefone,
  token,
  idCliente,
  body,
  agendamento,
  dadosCliente,
  res,
) {
  const [ano, mes, dia] = agendamento.agendamento_data.split('-');
  const data = dia + '/' + mes + '/' + ano;
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${idTelefone}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: body.telefone,
        type: 'template',
        template: {
          name: 'aviso_bloqueio',
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
                  text: body.paciente,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].nome,
                },
                {
                  type: 'text',
                  text: agendamento.agendamento_medico,
                },
                {
                  type: 'text',
                  text: data,
                },
                {
                  type: 'text',
                  text: agendamento.agendamento_hora,
                },
                {
                  type: 'text',
                  text: dadosCliente.rows[0].contato,
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
        let payload = await new MessageService().createAvisoBloqueio(
          body,
          agendamento,
          idCliente,
          id,
        );

        const consultaRegistroCobrado =
          await new MessageService().getRegistroCobrado(
            idCliente,
            body.telefone,
          );
        if (!consultaRegistroCobrado.rows[0]) {
          await new MessageService().postRegistroCobrado(
            body,
            agendamento,
            idCliente,
            2,
          );
        }
      }
    });
  } catch (e) {
    let payload = await new MessageService().createMessageFalha(
      body,
      agendamento,
      idCliente,
    );
    console.log('Error Bloqueio: ' + e + '/ Telefone: ' + body.telefone);
  }
}

const respostasAceitas = {
  async c(statusDB, idConversa, dadosCliente) {
    if (statusDB.rows[0].indstatus === null && !statusDB.rows[1]) {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        'C',
        idConversa,
      );
      return 'Agendamento confirmado, obrigado.';
    } else if (statusDB.rows[1].indstatus === 'D') {
      return `Este agendamento já foi desmarcado anteriormente, impossibilitando assim sua confirmação! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    }
  },
  async d(statusDB, idConversa, dadosCliente) {
    if (statusDB.rows[0].indstatus === null) {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        'D',
        idConversa,
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    } else if (statusDB.rows[0].indstatus === 'C') {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        'D',
        idConversa,
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    } else if (statusDB.rows[0].indstatus === 'C') {
      const payload = await new MessageService().novoRegistro(
        statusDB.rows[0],
        'D',
        idConversa,
      );
      return `Agendamento desmarcado! Caso deseje remarcar o atendimento, favor entrar em contato conosco no ${dadosCliente.rows[0].contato}.`;
    }
  },

  async s(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroContato(
      idConversa,
    );
    await new MessageService().novoRegistroContato(
      dadosContato.rows[0],
      idConversa,
      resposta,
    );
    return 'A clínica entrará em contato com você em breve para realizar a remarcação do seu agendamento. Muito obrigado e tenha um ótimo dia!';
  },

  async n(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroContato(
      idConversa,
    );
    await new MessageService().novoRegistroContato(
      dadosContato.rows[0],
      idConversa,
      resposta,
    );
    return 'Muito obrigado pela resposta e tenha um ótimo dia!';
  },

  async rp(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroPesquisa(
      idConversa,
    );
    await new MessageService().novoRegistroPesquisa(
      dadosContato.rows[0],
      idConversa,
      resposta,
    );
    return;
  },

  async nr(resposta, idConversa) {
    const dadosContato = await new MessageService().getRegistroPesquisa(
      idConversa,
    );
    await new MessageService().novoRegistroPesquisa(
      dadosContato.rows[0],
      idConversa,
      resposta,
    );
    return 'Muito obrigado pela resposta e tenha um ótimo dia!';
  },

  async 1(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      '1',
    );
    return 'Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!';
  },

  async 2(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroPesquisa(
      idConversa,
    );
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      '2',
    );
    return 'Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!';
  },

  async 3(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      '3',
    );
    return 'Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!';
  },

  async 4(resposta, idConversa) {
    const dadosNota = await new MessageService().getRegistroNota(idConversa);
    await new MessageService().novoRegistroNota(
      dadosNota.rows[0],
      idConversa,
      '4',
    );
    return 'Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!';
  },

  async 5(resposta, idConversa) {
    const dadosPesquisa = await new MessageService().getRegistroPesquisa(
      idConversa,
    );
    await new MessageService().novoRegistroPesquisa(
      dadosPesquisa.rows[0],
      idConversa,
      resposta,
    );

    return 'Obrigado por responder nossa pesquisa, sua opinião é muito importante para nós! Tenha um excelente dia!';
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

async function proximaPergunta(idConversa) {
  const proximaPergunta = await new MessageService().getProximaPegunta(
    idConversa,
  );
  return proximaPergunta;
}

async function mensagemFinal(resposta, idCliente, idMensagem) {
  const mensagemFinal = await new MessageService().getMensagemFinal(
    resposta,
    idCliente,
  );

  const dadosPergunta = await new MessageService().getRegistroPesquisa(
    idMensagem,
  );
  await new MessageService().novoRegistroPesquisa(
    dadosPergunta.rows[0],
    idMensagem,
    resposta,
    dadosPergunta.rows[0].idpergunta,
  );
  return mensagemFinal;
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
      method: 'POST',
      url:
        'https://graph.facebook.com/v12.0/' +
        num +
        '/messages?access_token=' +
        token,
      data: {
        messaging_product: 'whatsapp',
        to: para,
        text: {
          body: await verifica,
        },
      },
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.log(e.message);
  }
}

async function enviaPergunta(num, token, para, idMensagem, res) {
  try {
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${num}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        to: para,
        type: 'template',
        template: {
          name: 'pergunta_contato',
          language: {
            code: 'pt_BR',
            policy: 'deterministic',
          },
        },
        headers: {
          'Content-Type': 'application/json',
        },
      },
    }).then(async (response) => {
      if (res.status(200)) {
        let id = await response.data.messages[0].id;
        let payload = await new MessageService().getMessageById(idMensagem);
        let contato = await new MessageService().novoRegistroContato(
          payload.rows[0],
          id,
          null,
        );
      }
    });
  } catch (e) {
    console.log(e.message);
  }
}
async function enviaPesquisa(num, token, para, idMensagem, res, resposta) {
  try {
    const proximaMensagem = await proximaPergunta(idMensagem);
    const payload = await new MessageService().getRegistroPesquisa(idMensagem);
    await new MessageService().novoRegistroPesquisa(
      payload.rows[0],
      idMensagem,
      resposta,
      payload.rows[0].idpergunta,
    );
    await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v15.0/${num}/messages?access_token=${token}`,
      data: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: para,
        type: 'interactive',
        interactive: {
          type: 'list',
          header: {
            type: 'text',
            text: 'Pesquisa de Satisfação',
          },
          body: {
            text: proximaMensagem.pergunta,
          },

          action: {
            button: 'Dar nota',
            sections: [
              {
                title: 'Selecione uma nota:',
                rows: [
                  {
                    id: '1',
                    title: 'Péssimo',
                    description: '1',
                  },
                  {
                    id: '2',
                    title: 'Ruim',
                    description: '2',
                  },
                  {
                    id: '3',
                    title: 'Bom',
                    description: '3',
                  },
                  {
                    id: '4',
                    title: 'Ótimo',
                    description: '4',
                  },
                  {
                    id: '5',
                    title: 'Excelente',
                    description: '5',
                  },
                ],
              },
            ],
          },
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(async (response) => {
      if (res.status(200)) {
        const id = await response.data.messages[0].id;
        const paload = await new MessageService().novoRegistroPesquisa(
          payload.rows[0],
          id,
          null,
          proximaMensagem.id,
        );
      }
    });
  } catch (e) {
    console.log('Erro no envio da pesquisa: ' + e.message);
  }
}

async function verificaData(nomeSchema, idServico) {
  const servico = await new MessageService().getClienteServicoUnico(
    nomeSchema,
    idServico,
  );
  const dataFinal = await servico.rows[0].data_fim;
  const dataAtual = new Date();
  if (dataFinal >= dataAtual || dataFinal === null) {
    return true;
  } else {
    return false;
  }
}
exports.get = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema,
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getAllMessages(
        body,
        dadosCliente.rows[0].id,
      );
      const payloadTrat = payload.rows.map((registro) => {
        if (registro.id_local === null) registro.id_local = '';
        return registro;
      });
      res.status(200).send(payloadTrat);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.getAllTokens = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema,
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getAllTokens(
        body,
        dadosCliente.rows[0].id,
      );
      const payloadTrat = payload.rows.map((registro) => {
        if (registro.id_local === null) registro.id_local = '';
        return registro;
      });
      res.status(200).send(payloadTrat);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.getTokenAgendamento = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getClienteBySchema(
      body.nome_schema,
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getTokenAgendamento(
        body,
        dadosCliente.rows[0].id,
      );
      const payloadTrat = payload.rows.map((registro) => {
        if (registro.id_local === null) registro.id_local = '';
        return registro;
      });
      res.status(200).send(payloadTrat);
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.getToken = async (req, res, next) => {
  try {
    const body = await req.body;
    const dadosCliente = await new MessageService().getTokenKonsist(
      body.id,
      body.nome_schema,
    );
    if (dadosCliente.rows[0]) {
      res.status(200).send(criaJwt(body.id, body.nome_schema, 'Sucesso'));
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
      body.nome_schema,
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getAllNotas(
        body,
        dadosCliente.rows[0].id,
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
exports.getContatosRecusados = async (req, res, next) => {
  try {
    const body = await req.body;
    const payload = await new MessageService().getContatosRecusados(
      body.id,
      body.nome_schema,
    );
    res.status(200).send(payload.rows);
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
      body.nome_schema,
    );
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getSolicitacaoContato(
        body.id,
        dadosCliente.rows[0].id,
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
      body.nome_schema,
    );
    body.data_inicial ? (body.data_inicial += ' 00:00:00') : '';
    body.data_final ? (body.data_final += ' 23:59:59') : '';
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioCobranca(
        body,
        dadosCliente.rows[0].id,
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = '';
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
      body.nome_schema,
    );
    body.data_inicial ? (body.data_inicial += ' 00:00:00') : '';
    body.data_final ? (body.data_final += ' 23:59:59') : '';
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioEnvio(
        body,
        dadosCliente.rows[0].id,
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = '';
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
      body.nome_schema,
    );
    body.data_inicial ? (body.data_inicial += ' 00:00:00') : '';
    body.data_final ? (body.data_final += ' 23:59:59') : '';
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioEnvioUnico(
        body.chave,
        dadosCliente.rows[0].id,
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = '';
          }
        }
      });
      if (payload.rows.length > 0) res.status(201).send(payload.rows);
      else res.status(200).send('Nenhum agendamento encontrato!');
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
      body.nome_schema,
    );
    body.data_inicial ? (body.data_inicial += ' 00:00:00') : '';
    body.data_final ? (body.data_final += ' 23:59:59') : '';
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioFalhaUnico(
        body.chave,
        dadosCliente.rows[0].id,
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = '';
          }
        }
      });
      if (payload.rows.length > 0) res.status(201).send(payload.rows);
      else res.status(200).send('Nenhum agendamento encontrato!');
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
      body.nome_schema,
    );
    body.data_inicial ? (body.data_inicial += ' 00:00:00') : '';
    body.data_final ? (body.data_final += ' 23:59:59') : '';
    if (dadosCliente.rows[0]) {
      const payload = await new MessageService().getRelatorioFalha(
        body,
        dadosCliente.rows[0].id,
      );
      payload.rows.map((data) => {
        for (let prop in data) {
          if (data[prop] === null) {
            data[prop] = '';
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

exports.getServicos = async (req, res, next) => {
  try {
    const servicos = await new MessageService().getServicos();
    res.status(200).send(
      servicos.rows.map((servico) => {
        return servico;
      }),
    );
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.getClienteServico = async (req, res, next) => {
  try {
    const body = req.body;
    const dadosClienteServico = await new MessageService().getClienteServico(
      body.nome_schema,
    );
    if (dadosClienteServico.rows[0]) {
      const dataCliente = {
        nome: await dadosClienteServico.rows[0].nome,
        nome_schema: await dadosClienteServico.rows[0].nome_schema,
        idtelefonewhatsapp: await dadosClienteServico.rows[0]
          .idtelefonewhatsapp,
        tokenwhatsapp: await dadosClienteServico.rows[0].tokenwhatsapp,
        contato: await dadosClienteServico.rows[0].contato,
        endereco_publico_agendaweb: await dadosClienteServico.rows[0]
          .endereco_publico_agendaweb,
        id_cliente: await dadosClienteServico.rows[0].id_cliente,
        servicos: [],
      };
      dataCliente.servicos = await dadosClienteServico.rows.map((servico) => {
        return {
          id_servico: servico.id_servico,
          data_inicio: servico.data_inicio,
          data_fim: servico.data_fim,
          token: servico.token,
        };
      });
      res.status(200).send(dataCliente);
    } else {
      res.status(400).send('Cliente não encontrado.');
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.getClientePerguntas = async (req, res, next) => {
  try {
    const body = req.body;
    const dadosClientePergunta = await new MessageService().getClientePergunta(
      body.nome_schema,
    );
    const dadosClienteMensagem = await new MessageService().getClienteMensagem(
      body.nome_schema,
    );
    if (dadosClientePergunta.rows[0]) {
      const dataCliente = {
        nome: await dadosClientePergunta.rows[0].nome,
        nome_schema: await dadosClientePergunta.rows[0].nome_schema,
        idtelefonewhatsapp: await dadosClientePergunta.rows[0]
          .idtelefonewhatsapp,
        tokenwhatsapp: await dadosClientePergunta.rows[0].tokenwhatsapp,
        contato: await dadosClientePergunta.rows[0].contato,
        endereco_publico_agendaweb: await dadosClientePergunta.rows[0]
          .endereco_publico_agendaweb,
        id_cliente: await dadosClientePergunta.rows[0].id_cliente,
        perguntas: [],
        mensagens: [],
      };
      dataCliente.perguntas = await dadosClientePergunta.rows.map(
        (pergunta) => {
          return {
            id_pergunta: pergunta.id_pergunta,
            pergunta: pergunta.pergunta,
            ordem: pergunta.ordem,
            ativo: pergunta.ativo,
          };
        },
      );
      dataCliente.mensagens = await dadosClienteMensagem.rows.map(
        (mensagem) => {
          return {
            nota: mensagem.nota,
            mensagem: mensagem.mensagem,
          };
        },
      );
      res.status(200).send(dataCliente);
    } else {
      res.status(400).send('Cliente não encontrado.');
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.getEnviosCobradosTodos = async (req, res, next) => {
  try {
    const body = req.body;
    const clientes = await new MessageService().getEnviosCobradosTodos(
      body.data_inicio,
      body.data_fim,
    );
    res.status(200).send(
      clientes.rows.map((data) => {
        return data;
      }),
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
    res.status(200).send('Serviço criado com sucesso.');
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
    let token_documento;
    let token_agendaweb;
    let token_link;
    let token_integracao;
    let mensagemJson;
    let resSend = {
      resposta: mensagemJson,
      // token_documento: token_documento,
      // token_agendaweb: token_agendaweb,
      // token_link: token_link,
      // token_integracao: token_integracao,
    };

    async function getToken(schema, id, servico) {
      const response = await axios({
        method: 'GET',
        url: 'https://apikonsist.ngrok.io/gettoken/' + schema,
      });
      if (response.status === 200) {
        const { token } = await response.data;
        const payload = await new MessageService().updateClienteServico(
          servico,
          token,
          id,
        );
        return token;
      }
    }
    async function getTokenDocs(schema, id, servico) {
      const response = await axios({
        method: 'GET',
        url: 'http://18.230.75.177:1415/gettoken/' + schema,
      });
      if (response.status === 200) {
        const { token } = await response.data;
        const payload = await new MessageService().updateClienteServico(
          servico,
          token,
          id,
        );
        return token;
      }
    }
    const verificaWpp = await body.servicos.map((servico) => {
      if (servico.id === '1' || servico.id === 1) return true;
    });
    if (await verificaWpp.includes(true)) {
      if (!body.tokenwhatsapp || !body.idtelefonewhatsapp) {
        res
          .status(405)
          .send(
            'Serviço de whatsapp enviado na requisição, tokenwhatsapp ou idtelefone whatsapp não preenchido',
          );
      } else {
        const { id, mensagem } = await new MessageService().createCliente(
          body,
          body.servicos,
        );

        const servicos = await Promise.all(
          body.servicos.map(async (servico) => {
            if (servico.id === '2' || servico.id === 2) {
              const token = await getToken(body.nome_schema, id, servico);
              return { id: servico.id, token_link: token };
            }
            if (servico.id === '3' || servico.id === 3) {
              const token = await getToken(body.nome_schema, id, servico);
              return { id: servico.id, token_integracao: token };
            }
            if (servico.id === '4' || servico.id === 4) {
              const token = await getToken(body.nome_schema, id, servico);
              return { id: servico.id, token_agendaweb: token };
            }
            if (servico.id === '6' || servico.id === 6) {
              const token = await getTokenDocs(body.nome_schema, id, servico);
              return { id: servico.id, token_documento: token };
            }
            if (servico.id === '1') {
              const { token_whatsapp } = criaJwt(id, body.nome_schema);
              const payload = await new MessageService().updateClienteServico(
                servico,
                token_whatsapp,
                id,
              );
            }
            return servico;
          }),
        );

        const dadosClienteServico =
          await new MessageService().getClienteServico(body.nome_schema);
        if (dadosClienteServico.rows[0]) {
          const dataCliente = {
            nome: await dadosClienteServico.rows[0].nome,
            nome_schema: await dadosClienteServico.rows[0].nome_schema,
            idtelefonewhatsapp: await dadosClienteServico.rows[0]
              .idtelefonewhatsapp,
            tokenwhatsapp: await dadosClienteServico.rows[0].tokenwhatsapp,
            contato: await dadosClienteServico.rows[0].contato,
            endereco_publico_agendaweb: await dadosClienteServico.rows[0]
              .endereco_publico_agendaweb,
            id_cliente: await dadosClienteServico.rows[0].id_cliente,
            servicos: [],
          };
          dataCliente.servicos = await dadosClienteServico.rows.map(
            (servico) => {
              return {
                id_servico: servico.id_servico,
                data_inicio: servico.data_inicio,
                data_fim: servico.data_fim,
                token: servico.token,
              };
            },
          );
          res.status(200).send(dataCliente);
        }
      }
    } else {
      const { id, mensagem } = await new MessageService().createCliente(
        body,
        body.servicos,
      );

      const servicos = await Promise.all(
        body.servicos.map(async (servico) => {
          if (servico.id === '2' || servico.id === 2) {
            const token = await getToken(body.nome_schema, id, servico);
            return { id: servico.id, token_link: token };
          }
          if (servico.id === '3' || servico.id === 3) {
            const token = await getToken(body.nome_schema, id, servico);
            return { id: servico.id, token_integracao: token };
          }
          if (servico.id === '4' || servico.id === 4) {
            const token = await getToken(body.nome_schema, id, servico);
            return { id: servico.id, token_agendaweb: token };
          }
          if (servico.id === '6' || servico.id === 6) {
            const token = await getTokenDocs(body.nome_schema, id, servico);
            return { id: servico.id, token_documento: token };
          }
          return servico;
        }),
      );

      const dadosClienteServico = await new MessageService().getClienteServico(
        body.nome_schema,
      );
      if (dadosClienteServico.rows[0]) {
        const dataCliente = {
          nome: await dadosClienteServico.rows[0].nome,
          nome_schema: await dadosClienteServico.rows[0].nome_schema,
          idtelefonewhatsapp: await dadosClienteServico.rows[0]
            .idtelefonewhatsapp,
          tokenwhatsapp: await dadosClienteServico.rows[0].tokenwhatsapp,
          contato: await dadosClienteServico.rows[0].contato,
          endereco_publico_agendaweb: await dadosClienteServico.rows[0]
            .endereco_publico_agendaweb,
          id_cliente: await dadosClienteServico.rows[0].id_cliente,
          servicos: [],
        };
        dataCliente.servicos = await dadosClienteServico.rows.map((servico) => {
          return {
            id_servico: servico.id_servico,
            data_inicio: servico.data_inicio,
            data_fim: servico.data_fim,
            token: servico.token,
          };
        });
        res.status(200).send(dataCliente);
      }
    }
  } catch (error) {
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.postPerguntaCliente = async (req, res, next) => {
  try {
    const body = await req.body;
    const perguntas = await body[0].perguntas;
    const nomeSchema = await body[0].nome_schema;

    const payload = await new MessageService().createPerguntaCliente(
      nomeSchema,
      perguntas,
    );
    await res.status(201).send(payload);
  } catch (e) {
    res.status(400).send('Erro ao cadastrar perguntas: ' + e);
  }
};
exports.postMensagemFinal = async (req, res, next) => {
  try {
    const body = await req.body;
    const mensagens = await body[0].mensagens;
    const nomeSchema = await body[0].nome_schema;

    const payload = await new MessageService().createMensagemFinal(
      nomeSchema,
      mensagens,
    );
    await res.status(201).send(payload);
  } catch (e) {
    res.status(400).send('Erro ao cadastrar Mensagens: ' + e);
  }
};

//Recebimento dos dados do atendimento e envio da mensagem para o paciente
exports.postMessage = async (req, res, next) => {
  try {
    let body = await req.body;
    if (await verificaData(body[0].nome_schema, 1)) {
      let dadosCliente = await new MessageService().getClienteBySchema(
        Array.isArray(body) ? body[0].nome_schema : body.nome_schema,
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
              res,
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
                            res,
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
    } else {
      res.status(401).send({
        message:
          'Cliente com serviço já encerrado. Verificar data fim do serviço no cadastro do cliente.',
      });
    }
  } catch (error) {
    console.log('Erro no Envio da mensagem de confirmação!');
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
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema,
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
            res,
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
                          res,
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
    console.log('Erro no Aviso de Bloqueio!');
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
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema,
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
            res,
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
                    res,
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
    console.log('Erro no PostPesquisa!');
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.postEnvioAvulso = async (req, res, next) => {
  try {
    let body = await req.body;
    let dadosCliente = await new MessageService().getClienteBySchema(
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema,
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      if (!Array.isArray(body)) {
        body.agendamento.map(async (agendamento) => {
          await enviaMensagemAvulsa(
            idTelefone,
            token,
            idCliente,
            body,
            agendamento,
            dadosCliente,
            res,
          );
        });
      } else {
        try {
          body.forEach(async (data, i) => {
            try {
              setTimeout(async () => {
                try {
                  await enviaMensagemAvulsa(
                    idTelefone,
                    token,
                    idCliente,
                    data,
                    dadosCliente,
                    res,
                  );
                } catch (e) {
                  console.log(e);
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
    console.log('Erro no Post do Token!');
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.postEnvioToken = async (req, res, next) => {
  try {
    let body = await req.body;
    let dadosCliente = await new MessageService().getClienteBySchema(
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema,
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      if (!Array.isArray(body)) {
        body.agendamento.map(async (agendamento) => {
          await enviaMensagemToken(
            idTelefone,
            token,
            idCliente,
            body,
            agendamento,
            dadosCliente,
            res,
          );
        });
      } else {
        try {
          body.forEach(async (data, i) => {
            try {
              setTimeout(async () => {
                try {
                  await enviaMensagemToken(
                    idTelefone,
                    token,
                    idCliente,
                    data,
                    data.agendamento[0],
                    dadosCliente,
                    res,
                  );
                } catch (e) {
                  console.log(e);
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
    console.log('Erro no Post do Token!');
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};
exports.postEnvioAniversario = async (req, res, next) => {
  try {
    let body = await req.body;
    let dadosCliente = await new MessageService().getClienteBySchema(
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema,
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      if (!Array.isArray(body)) {
        body.agendamento.map(async (agendamento) => {
          await enviaMensagemAniversario(
            idTelefone,
            token,
            idCliente,
            body,
            dadosCliente,
            res,
          );
        });
      } else {
        try {
          body.forEach(async (data, i) => {
            try {
              setTimeout(async () => {
                try {
                  await enviaMensagemAniversario(
                    idTelefone,
                    token,
                    idCliente,
                    data,
                    dadosCliente,
                    res,
                  );
                } catch (e) {
                  console.log(e);
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
    console.log('Erro no Post do Aniversario!');
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.postEnvioRecaptacao = async (req, res, next) => {
  try {
    let body = await req.body;
    let dadosCliente = await new MessageService().getClienteBySchema(
      Array.isArray(body) ? body[0].nome_schema : body.nome_schema,
    );
    let token = await dadosCliente.rows[0].tokenwhatsapp;
    let idTelefone = await dadosCliente.rows[0].idtelefonewhatsapp;
    let idCliente = await dadosCliente.rows[0].id;
    if (res.status(200)) {
      if (!Array.isArray(body)) {
        body.agendamento.map(async (agendamento) => {
          await enviaMensagemRecaptacao(
            idTelefone,
            token,
            idCliente,
            body,
            dadosCliente,
            res,
          );
        });
      } else {
        try {
          body.forEach(async (data, i) => {
            try {
              setTimeout(async () => {
                try {
                  await enviaMensagemRecaptacao(
                    idTelefone,
                    token,
                    idCliente,
                    data,
                    dadosCliente,
                    res,
                  );
                } catch (e) {
                  console.log(e);
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
    console.log('Erro no Post da Recaptacao');
    res.status(400).send({
      message: error.message,
    });
    next(error);
  }
};

exports.postRegistroToken = async (req, res, next) => {
  try {
    const body = req.body;
    const param = decodeURIComponent(body.param);
    // const decipher = crypto.createDecipheriv(
    //   "aes-256-cbc",
    //   Buffer.from(secretKey),
    //   Buffer.from(iv, "base64")
    // );
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      secretKey,
      iv,
      'base64',
    );
    let parametroDecifrado = decipher.update(param, 'base64', 'utf8');
    parametroDecifrado += decipher.final('utf8');
    const getToken = JSON.parse(parametroDecifrado);
    const registroData = await new MessageService().getEnvioToken(getToken);
    if (registroData.rows && registroData.rows[0]) {
      const novoRegistro = await new MessageService().createNovoEnvioToken(
        registroData.rows[0],
        body.token,
      );
      res.status(201).send('Registro criado');
    } else {
      res
        .status(401)
        .send('Nenhum registro encontrado para essa chave e cliente');
    }
  } catch (error) {
    console.log('Erro no Registro do novo token!');
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
              'Confirmar' ||
            body.entry[0].changes[0].value.messages[0].button.payload ===
              'Desmarcar'
          ) {
            const status =
              (await body.entry[0].changes[0].value.messages[0].button
                .payload) === 'Confirmar'
                ? 'c'
                : 'd';
            const idCliente = await new MessageService().getIdCliente(
              body.entry[0].changes[0].value.messages[0].context.id,
            );
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente,
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
                  dadosCliente,
                ),
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
              'Sim' ||
            body.entry[0].changes[0].value.messages[0].button.payload === 'Não'
          ) {
            const resposta =
              (await body.entry[0].changes[0].value.messages[0].button
                .payload) === 'Sim'
                ? 's'
                : 'n';
            const idCliente = await new MessageService().getIdClienteContato(
              body.entry[0].changes[0].value.messages[0].context.id,
            );
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente,
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
                  req.body.entry[0].changes[0].value.messages[0].context.id,
                ),
              );
            }
          } else if (
            body.entry[0].changes[0].value.messages[0].button.payload ===
              'Responder pesquisa' ||
            body.entry[0].changes[0].value.messages[0].button.payload ===
              'Não responder'
          ) {
            const resposta =
              (await body.entry[0].changes[0].value.messages[0].button
                .payload) === 'Responder pesquisa'
                ? 'rp'
                : 'nr';
            console.log(resposta);
            const idCliente = await new MessageService().getIdClientePesquisa(
              body.entry[0].changes[0].value.messages[0].context.id,
            );
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente,
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
                  req.body.entry[0].changes[0].value.messages[0].context.id,
                ),
              );
              if (resposta === 'rp') {
                enviaPesquisa(
                  phone_number_id,
                  token,
                  from,
                  req.body.entry[0].changes[0].value.messages[0].context.id,
                  res,
                  null,
                );
              }
            }
          } else if (
            body.entry[0].changes[0].value.messages[0].button.payload ===
            'Parar de receber'
          ) {
            // console.log(JSON.stringify(body, null, 2));
            let idCliente = await new MessageService().getIdClienteAvulso(
              body.entry[0].changes[0].value.messages[0].context.id,
            );
            // console.log(await idCliente);
            if (idCliente.rowCount === 0) {
              idCliente = await new MessageService().getIdClienteRecaptacao(
                body.entry[0].changes[0].value.messages[0].context.id,
              );
              if (idCliente.rowCount === 0) {
                idCliente = await new MessageService().getIdClienteAniversarios(
                  body.entry[0].changes[0].value.messages[0].context.id,
                );
              }
            }
            const dadosCliente = (await idCliente.rows[0])
              ? await new MessageService().getClienteById(
                  idCliente.rows[0].idcliente,
                )
              : null;
            const token =
              (await dadosCliente) !== null &&
              (await dadosCliente.rowCount) !== 0
                ? await dadosCliente.rows[0].tokenwhatsapp
                : null;
            if (token) {
              if (
                await new MessageService().insertContatoRecusado(
                  from,
                  await idCliente.rows[0].idcliente,
                )
              ) {
                enviaResposta(
                  phone_number_id,
                  token,
                  from,
                  'Obrigado por responder, não se preocupe, a partir de hoje você não receberá mais mensagens de caráter de marketing da ' +
                    dadosCliente.rows[0].nome +
                    '. Tenha um excelente dia.',
                );
              }

              // const payload = await new MessageService().insertContatoRecusado(
              //   from,
              //   await idCliente.rows[0].idcliente
              // );
            }
          }
        } else if (body.entry[0].changes[0].value.messages[0].interactive) {
          if (
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === '1' ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === '2' ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === '3' ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === '4' ||
            body.entry[0].changes[0].value.messages[0].interactive.list_reply
              .id === '5'
          ) {
            const resposta = await body.entry[0].changes[0].value.messages[0]
              .interactive.list_reply.id;
            const dadosPesquisa =
              await new MessageService().getRegistroPesquisa(
                body.entry[0].changes[0].value.messages[0].context.id,
              );
            const dadosCliente = (await dadosPesquisa.rows[0])
              ? await new MessageService().getClienteById(
                  dadosPesquisa.rows[0].idcliente,
                )
              : null;
            const idCliente = (await dadosCliente)
              ? dadosPesquisa.rows[0].idcliente
              : null;
            const token =
              (await dadosCliente) !== null &&
              (await dadosCliente.rowCount) !== 0
                ? await dadosCliente.rows[0].tokenwhatsapp
                : null;
            if (token) {
              if (
                await proximaPergunta(
                  body.entry[0].changes[0].value.messages[0].context.id,
                )
              ) {
                enviaPesquisa(
                  phone_number_id,
                  token,
                  from,
                  req.body.entry[0].changes[0].value.messages[0].context.id,
                  res,
                  resposta,
                );
              } else {
                enviaResposta(
                  phone_number_id,
                  token,
                  from,
                  mensagemFinal(
                    resposta,
                    idCliente,
                    req.body.entry[0].changes[0].value.messages[0].context.id,
                  ),
                );
              }
            }
          }
        } else {
          const dadosCliente =
            await new MessageService().getClienteByIdTelefone(phone_number_id);
          const token = dadosCliente
            ? await dadosCliente.rows[0].tokenwhatsapp
            : null;
          const mensagem =
            'Não entendi, por favor siga as instruções da mensagem anterior.';
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
  const challenge = req.query['hub.challenge'];
  const verify_token = req.query['hub.verify_token'];

  if (verify_token === process.env.VERIFY_TOKEN) {
    return res.status(200).send(challenge); // Just the challenge
  }
  return res.status(400).send({ message: 'Bad request!' });
};
