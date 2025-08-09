const Item = require('../models/Item');

const itemController = {
  async criarItem(req, res) {
    const item = await Item.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Item criado com sucesso',
      data: item
    });
  },

  async listarItens(req, res) {
    const itens = await Item.findAll();
    res.json({ success: true, data: itens });
  },

  async obterItem(req, res) {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Item não encontrado');
    }
    res.json({ success: true, data: item });
  },

  async atualizarItem(req, res) {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Item não encontrado');
    }
    await item.update(req.body);
    res.json({ success: true, message: 'Item atualizado com sucesso', data: item });
  },

  async deletarItem(req, res) {
    const item = await Item.findByPk(req.params.id);
    if (!item) {
      res.status(404);
      throw new Error('Item não encontrado');
    }
    await item.destroy();
    res.json({ success: true, message: 'Item deletado com sucesso' });
  }
};

module.exports = itemController;
