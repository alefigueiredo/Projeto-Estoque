const PostoAtendimento = require('../models/PostoAtendimento');

module.exports = {
  async criarPosto(req, res) {
    try {
      const posto = await PostoAtendimento.create(req.body);
      res.status(201).json(posto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listarPostos(req, res) {
    try {
      const postos = await PostoAtendimento.findAll();
      res.json(postos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obterPosto(req, res) {
    try {
      const posto = await PostoAtendimento.findByPk(req.params.id);
      if (!posto) {
        return res.status(404).json({ error: 'Posto não encontrado' });
      }
      res.json(posto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async atualizarPosto(req, res) {
    try {
      const [updated] = await PostoAtendimento.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedPosto = await PostoAtendimento.findByPk(req.params.id);
        return res.json(updatedPosto);
      }
      throw new Error('Posto não encontrado');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletarPosto(req, res) {
    try {
      const deleted = await PostoAtendimento.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        return res.json({ message: 'Posto deletado com sucesso' });
      }
      throw new Error('Posto não encontrado');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};