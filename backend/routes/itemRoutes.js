const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Rotas para itens
router.post('/', itemController.criarItem);
router.get('/', itemController.listarItens);
router.get('/:id', itemController.obterItem);
router.put('/:id', itemController.atualizarItem);
router.delete('/:id', itemController.deletarItem);

module.exports = router;