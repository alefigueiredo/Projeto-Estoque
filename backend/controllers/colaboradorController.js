const Colaborador = require('../models/Colaborador');

module.exports = {
  async criarColaborador(req, res) {
    try {
      const colaborador = await Colaborador.create(req.body);
      res.status(201).json(colaborador);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listarColaboradores(req, res) {
    try {
      const colaboradores = await Colaborador.findAll();
      res.json(colaboradores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obterColaborador(req, res) {
    try {
      const colaborador = await Colaborador.findByPk(req.params.id);
      if (!colaborador) {
        return res.status(404).json({ error: 'Colaborador não encontrado' });
      }
      res.json(colaborador);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async atualizarColaborador(req, res) {
    try {
      const [updated] = await Colaborador.update(req.body, {
        where: { id: req.params.id }
      });
      if (updated) {
        const updatedColaborador = await Colaborador.findByPk(req.params.id);
        return res.json(updatedColaborador);
      }
      throw new Error('Colaborador não encontrado');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async deletarColaborador(req, res) {
    try {
      const deleted = await Colaborador.destroy({
        where: { id: req.params.id }
      });
      if (deleted) {
        return res.json({ message: 'Colaborador deletado com sucesso' });
      }
      throw new Error('Colaborador não encontrado');
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};