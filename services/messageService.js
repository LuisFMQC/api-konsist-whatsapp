const MessageRepository = require("../database/repositories/messageRepository");

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

  async createPesquisa(dadosPaciente, dadosAgendamento, idCliente, code) {
    return this.repository.postDadosPesquisa(
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

  async createCliente(dadosCliente) {
    return this.repository.insertCliente(dadosCliente);
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

  async getAllMessages(dados, idCliente) {
    return this.repository.getAllMessages(dados, idCliente);
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

  async getRegistroContato(idConversa) {
    return this.repository.getRegistroContato(idConversa);
  }

  async getRegistroPesquisa(idConversa) {
    return this.repository.getRegistroPesquisa(idConversa);
  }

  async novoRegistroContato(dadosAtendimento, code, resposta) {
    return this.repository.postNovoRegistroContato(
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
