const Colaborador = require('../models/Colaborador');

module.exports = {
  async criarColaborador(req, res) {
    const colaborador = await Colaborador.create(req.body);
    res.status(201).json({ success: true, message: 'Colaborador criado com sucesso', data: colaborador });
  },

  async listarColaboradores(req, res) {
    const colaboradores = await Colaborador.findAll();
    res.json({ success: true, data: colaboradores });
  },

  async obterColaborador(req, res) {
    const colaborador = await Colaborador.findByPk(req.params.id);
    if (!colaborador) {
      res.status(404);
      throw new Error('Colaborador não encontrado');
    }
    res.json({ success: true, data: colaborador });
  },

  async atualizarColaborador(req, res) {
    const colaborador = await Colaborador.findByPk(req.params.id);
    if (!colaborador) {
      res.status(404);
      throw new Error('Colaborador não encontrado');
    }
    await colaborador.update(req.body);
    res.json({ success: true, message: 'Colaborador atualizado com sucesso', data: colaborador });
  },

  async deletarColaborador(req, res) {
    const colaborador = await Colaborador.findByPk(req.params.id);
    if (!colaborador) {
      res.status(404);
      throw new Error('Colaborador não encontrado');
    }
    await colaborador.destroy();
    res.json({ success: true, message: 'Colaborador deletado com sucesso' });
  }
};
