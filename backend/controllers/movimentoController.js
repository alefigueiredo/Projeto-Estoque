const Movimento = require('../models/Movimento');
const Item = require('../models/Item');
const PostoAtendimento = require('../models/PostoAtendimento');
const Colaborador = require('../models/Colaborador');
const sequelize = require('../config/database');

// Definir associações
Movimento.belongsTo(Item, { foreignKey: 'itemId' });
Movimento.belongsTo(PostoAtendimento, { foreignKey: 'postoId' });
Movimento.belongsTo(Colaborador, { foreignKey: 'colaboradorId' });

module.exports = {
  async criarMovimento(req, res) {
    const { itemId, tipo, quantidade } = req.body;

    const item = await Item.findByPk(itemId);
    if (!item) {
      res.status(404);
      throw new Error('Item não encontrado');
    }

    // Previne estoque negativo
    if (tipo === 'Saída' && item.quantidade < quantidade) {
      res.status(400);
      throw new Error(`Estoque insuficiente. Disponível: ${item.quantidade}`);
    }

    const movimento = await Movimento.create(req.body);

    if (tipo === 'Entrada') {
      item.quantidade += parseInt(quantidade);
    } else {
      item.quantidade -= parseInt(quantidade);
    }
    await item.save();

    res.status(201).json({
      success: true,
      message: 'Movimento registrado com sucesso',
      data: movimento
    });
  },

  async listarMovimentos(req, res) {
    const movimentos = await Movimento.findAll({
      include: [
        { model: Item },
        { model: PostoAtendimento },
        { model: Colaborador }
      ]
    });
    res.json({ success: true, data: movimentos });
  },

  async obterMovimento(req, res) {
    try {
      console.log('Buscando movimento com ID:', req.params.id);
      
      // Verificar se o ID é válido
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'ID inválido' });
      }
      
      // Usar o método findByPk com include para buscar o movimento e suas associações
      const movimento = await Movimento.findByPk(id, {
        include: [
          { model: Item },
          { model: PostoAtendimento },
          { model: Colaborador }
        ]
      });
      
      // Verificar se o movimento existe
      if (!movimento) {
        console.log('Movimento não encontrado com ID:', id);
        return res.status(404).json({ success: false, message: 'Movimento não encontrado' });
      }
      
      console.log('Movimento encontrado e retornado com sucesso');
      res.json({ success: true, data: movimento });
    } catch (error) {
      console.error('Erro ao buscar movimento:', error);
      res.status(500).json({ success: false, message: 'Erro ao buscar movimento', error: error.message });
    }
  },

  async gerarRelatorio(req, res) {
    // Lógica real de relatório a ser implementada depois
    res.json({ success: true, message: 'Relatório gerado com sucesso (placeholder)' });
  }
};
