const Item = require('../models/Item');

const itemController = {
    async criarItem(req, res) {
        try {
            const item = await Item.create(req.body);
            res.status(201).json(item);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    async listarItens(req, res) {
        try {
            const itens = await Item.findAll();
            res.json(itens);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async obterItem(req, res) {
        try {
            const item = await Item.findByPk(req.params.id);
            if (!item) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            res.json(item);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async atualizarItem(req, res) {
        try {
            const [updated] = await Item.update(req.body, {
                where: { id: req.params.id }
            });
            if (updated) {
                const updatedItem = await Item.findByPk(req.params.id);
                return res.json(updatedItem);
            }
            throw new Error('Item não encontrado');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    async deletarItem(req, res) {
        try {
            const deleted = await Item.destroy({
                where: { id: req.params.id }
            });
            if (deleted) {
                return res.json({ message: 'Item deletado com sucesso' });
            }
            throw new Error('Item não encontrado');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = itemController;