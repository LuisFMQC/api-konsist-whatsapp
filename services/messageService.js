const MessageRepository = require("../database/repositories/messageRepository");

class MessageService {
  constructor() {
    this.repository = new MessageRepository();
  }

  async getProximaPegunta(idConversa) {
    return this.repository.getProximaPergunta(idConversa);
  }
  async getMensagemFinal(resposta, idCliente) {
    return this.repository.getMensagemFinal(resposta, idCliente);
  }
  async getTokenKonsist(id, schema) {
    return this.repository.getTokenKonsist(id, schema);
  }

  async getStatus(code) {
    return this.repository.getStatusAtendimento(code);
  }

  async createMessage(dadosPaciente, dadosAgendamento, idCliente, code) {
    return this.repository.postDadosAtendimento(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      code
    );
  }

  async createAvisoBloqueio(dadosPaciente, dadosAgendamento, idCliente, code) {
    return this.repository.postDadosAvisoBloqueio(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      code
    );
  }
  async createEnvioToken(dadosPaciente, dadosAgendamento, idCliente, code) {
    return this.repository.postDadosEnvioToken(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      code
    );
  }
  async createEnvioRecaptacao(
    dadosPaciente,
    dadosAgendamento,
    idCliente,
    code
  ) {
    return this.repository.postDadosEnvioRecaptacao(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      code
    );
  }
  async createEnvioAvulso(dadosPaciente, idCliente, code) {
    return this.repository.postDadosEnvioAvulso(dadosPaciente, idCliente, code);
  }
  async createEnvioAniversario(dadosPaciente, idCliente, code) {
    return this.repository.postDadosEnvioAniversario(
      dadosPaciente,
      idCliente,
      code
    );
  }
  async createNovoEnvioToken(dados, token) {
    return this.repository.postNovoRegistroEnvioToken(dados, token);
  }

  async createPesquisa(
    dadosPaciente,
    dadosAgendamento,
    idCliente,
    code,
    idPergunta
  ) {
    return this.repository.postDadosAtendimentoPesquisa(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      code,
      idPergunta
    );
  }

  async createMessageFalha(dadosPaciente, dadosAgendamento, idCliente) {
    return this.repository.postDadosAtendimentoFalha(
      dadosPaciente,
      dadosAgendamento,
      idCliente
    );
  }

  async novoRegistro(dadosAtendimento, status, code) {
    return this.repository.postDadosAtendimentoNovoRegistro(
      dadosAtendimento,
      status,
      code
    );
  }

  async updateMessage(code, dadosAtendimento) {
    return this.repository.updateDadosAtendimento(code, dadosAtendimento);
  }

  async updateStatus(status, code) {
    return this.repository.updateStatusAtendimento(status, code);
  }

  async getClienteById(code) {
    return this.repository.getClienteById(code);
  }

  async getEnvioToken(dados) {
    return this.repository.getEnvioToken(dados);
  }

  async getClienteByIdTelefone(code) {
    return this.repository.getClienteByIdTelefone(code);
  }

  async getClienteBySchema(schema) {
    return this.repository.getClienteBySchema(schema);
  }

  async getClienteByIdCliente(code) {
    return this.repository.getClienteByIdCliente(code);
  }

  async createCliente(dadosCliente, servicos) {
    return this.repository.insertClienteNovo(dadosCliente, servicos);
  }
  async createPerguntaCliente(nomeSchema, perguntas) {
    return this.repository.insertPerguntaCliente(nomeSchema, perguntas);
  }
  async createMensagemFinal(nomeSchema, perguntas) {
    return this.repository.insertMensagemFinalCliente(nomeSchema, perguntas);
  }
  async getClienteServicoUnico(nomeSchema, idServico) {
    return this.repository.getClienteServicoUnico(nomeSchema, idServico);
  }

  async updateCliente(dadosCliente) {
    return this.repository.updateCliente(dadosCliente);
  }
  async updateClienteServico(servico, token, id) {
    return this.repository.updateClienteServico(servico, token, id);
  }

  async getIdCliente(code) {
    return this.repository.getIdCliente(code);
  }

  async getServicos() {
    return this.repository.getServicos();
  }

  async getIdClienteContato(code) {
    return this.repository.getIdClienteContato(code);
  }

  async getIdClientePesquisa(code) {
    return this.repository.getIdClientePesquisa(code);
  }

  async getIdClienteNota(code) {
    return this.repository.getIdClienteNota(code);
  }

  async getAllMessages(dados, idCliente) {
    return this.repository.getAllMessages(dados, idCliente);
  }
  async getAllTokens(dados, idCliente) {
    return this.repository.getAllTokens(dados, idCliente);
  }
  async getTokenAgendamento(dados, idCliente) {
    return this.repository.getTokenAgendamento(dados, idCliente);
  }

  async getAllNotas(dados, idCliente) {
    return this.repository.getAllNotas(dados, idCliente);
  }

  async getSolicitacaoContato(id, idCliente) {
    return this.repository.getSolicitacaoContato(id, idCliente);
  }

  async getRelatorioCobranca(datas, id) {
    return this.repository.getRelatorioCobranca(datas, id);
  }

  async getRelatorioEnvio(datas, id) {
    return this.repository.getRelatorioEnvio(datas, id);
  }

  async getRelatorioEnvioUnico(chave, id) {
    return this.repository.getRelatorioEnvioUnico(chave, id);
  }

  async getRelatorioFalha(datas, id) {
    return this.repository.getRelatorioFalha(datas, id);
  }

  async getRelatorioFalhaUnico(chave, id) {
    return this.repository.getRelatorioFalhaUnico(chave, id);
  }

  async getRegistroCobrado(idCliente, contato) {
    return this.repository.getRegistroCobrado(idCliente, contato);
  }

  async getClienteServico(idCliente) {
    return this.repository.getClienteServico(idCliente);
  }
  async getClientePergunta(idCliente) {
    return this.repository.getClientePergunta(idCliente);
  }
  async getClienteMensagem(idCliente) {
    return this.repository.getClienteMensagem(idCliente);
  }

  async getEnviosCobradosTodos(data_inicio, data_fim) {
    return this.repository.getEnviosCobradosTodos(data_inicio, data_fim);
  }

  async insertServico(descricao) {
    return this.repository.insertServico(descricao);
  }

  async updateServicoCliente(servico, idCliente) {
    return this.repository.updateServicoCliente(servico, idCliente);
  }

  async createServicoCliente(servico, idCliente) {
    return this.repository.insertServicoCliente(servico, idCliente);
  }

  async postRegistroCobrado(dadosPaciente, dadosAgendamento, idCliente, tipo) {
    return this.repository.postRegistroCobrado(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      tipo
    );
  }

  async getMessageById(idConversa) {
    return this.repository.getMessageById(idConversa);
  }

  async getMessageByIdPesquisa(idConversa) {
    return this.repository.getMessageByIdPesquisa(idConversa);
  }

  async getRegistroContato(idConversa) {
    return this.repository.getRegistroContato(idConversa);
  }

  async getRegistroPesquisa(idConversa) {
    return this.repository.getRegistroPesquisa(idConversa);
  }

  async getRegistroNota(idConversa) {
    return this.repository.getRegistroNota(idConversa);
  }

  async novoRegistroContato(dadosAtendimento, code, resposta) {
    return this.repository.postNovoRegistroContato(
      dadosAtendimento,
      code,
      resposta
    );
  }

  async novoRegistroPesquisa(dadosAtendimento, code, resposta, idPergunta) {
    return this.repository.postNovoRegistroPesquisa(
      dadosAtendimento,
      code,
      resposta,
      idPergunta
    );
  }

  async novoRegistroNota(dadosAtendimento, code, resposta) {
    return this.repository.postNovoRegistroNota(
      dadosAtendimento,
      code,
      resposta
    );
  }

  async atualizaRegistroContato(resposta, code) {
    return this.repository.updateRegistroContato(resposta, code);
  }
}

module.exports = MessageService;
