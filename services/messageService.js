const MessageRepository = require('../database/repositories/messageRepository');

class MessageService {
  constructor() {
    this.repository = new MessageRepository();
  }

  async getStatus(code) {
    return this.repository.getStatusAtendimento(code);
  }

  async createMessage(dadosAtendimento, idCliente, code) {
    return this.repository.postDadosAtendimento(
      dadosAtendimento,
      idCliente,
      code,
    );
  }

  async novoRegistro(dadosAtendimento, status, code) {
    return this.repository.postDadosAtendimentoNovoRegistro(
      dadosAtendimento,
      status,
      code,
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

  async getAllMessages(dados, idCliente) {
    return this.repository.getAllMessages(dados, idCliente);
  }
}

module.exports = MessageService;
