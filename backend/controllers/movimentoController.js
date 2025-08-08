const Movimento = require('../models/Movimento');
const Item = require('../models/Item');
const PostoAtendimento = require('../models/PostoAtendimento');
const Colaborador = require('../models/Colaborador');

module.exports = {
  async criarMovimento(req, res) {
    try {
      const movimento = await Movimento.create(req.body);
      
      // Atualizar estoque
      const item = await Item.findByPk(req.body.itemId);
      if (req.body.tipo === 'Entrada') {
        item.quantidade += parseInt(req.body.quantidade);
      } else {
        item.quantidade -= parseInt(req.body.quantidade);
      }
      await item.save();
      
      res.status(201).json(movimento);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async listarMovimentos(req, res) {
    try {
      const movimentos = await Movimento.findAll({
        include: [
          { model: Item },
          { model: PostoAtendimento },
          { model: Colaborador }
        ]
      });
      res.json(movimentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async obterMovimento(req, res) {
    try {
      const movimento = await Movimento.findByPk(req.params.id, {
        include: [
          { model: Item },
          { model: PostoAtendimento },
          { model: Colaborador }
        ]
      });
      if (!movimento) {
        return res.status(404).json({ error: 'Movimento não encontrado' });
      }
      res.json(movimento);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async gerarRelatorio(req, res) {
    try {
      // Implemente sua lógica de relatório aqui
      res.json({ message: 'Relatório gerado com sucesso' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};