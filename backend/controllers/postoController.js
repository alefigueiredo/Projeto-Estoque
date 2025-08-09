const PostoAtendimento = require('../models/PostoAtendimento');

module.exports = {
  async criarPosto(req, res) {
    const posto = await PostoAtendimento.create(req.body);
    res.status(201).json({ success: true, message: 'Posto criado com sucesso', data: posto });
  },

  async listarPostos(req, res) {
    const postos = await PostoAtendimento.findAll();
    res.json({ success: true, data: postos });
  },

  async obterPosto(req, res) {
    const posto = await PostoAtendimento.findByPk(req.params.id);
    if (!posto) {
      res.status(404);
      throw new Error('Posto não encontrado');
    }
    res.json({ success: true, data: posto });
  },

  async atualizarPosto(req, res) {
    const posto = await PostoAtendimento.findByPk(req.params.id);
    if (!posto) {
      res.status(404);
      throw new Error('Posto não encontrado');
    }
    await posto.update(req.body);
    res.json({ success: true, message: 'Posto atualizado com sucesso', data: posto });
  },

  async deletarPosto(req, res) {
    const posto = await PostoAtendimento.findByPk(req.params.id);
    if (!posto) {
      res.status(404);
      throw new Error('Posto não encontrado');
    }
    await posto.destroy();
    res.json({ success: true, message: 'Posto deletado com sucesso' });
  }
};
