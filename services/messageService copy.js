const MessageRepository = require("../database/repositories/messageRepository - Copia");

class MessageService {
  constructor() {
    this.repository = new MessageRepository();
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

  async createPesquisa(dadosPaciente, dadosAgendamento, idCliente, code) {
    return this.repository.postDadosAtendimentoPesquisa(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      code
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

  async updateCliente(dadosCliente) {
    return this.repository.updateCliente(dadosCliente);
  }

  async getIdCliente(code) {
    return this.repository.getIdCliente(code);
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

  async getServicoCliente(idServico, idCliente) {
    return this.repository.getServicoCliente(idServico, idCliente);
  }

  async updateServicoCliente(servico, idCliente) {
    return this.repository.updateServicoCliente(servico, idCliente);
  }

  async createServicoCliente(servico, idCliente) {
    return this.repository.insertServicoCliente(servico, idCliente);
  }

  async postRegistroCobrado(dadosPaciente, dadosAgendamento, idCliente, code) {
    return this.repository.postRegistroCobrado(
      dadosPaciente,
      dadosAgendamento,
      idCliente,
      code
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

  async novoRegistroPesquisa(dadosAtendimento, code, resposta) {
    return this.repository.postNovoRegistroPesquisa(
      dadosAtendimento,
      code,
      resposta
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
