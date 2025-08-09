const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');

// Middleware para capturar erros async
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Rotas para gerenciamento de Itens
 * Base: /api/itens
 */
router.post('/', asyncHandler(itemController.criarItem));
router.get('/', asyncHandler(itemController.listarItens));
router.get('/:id', asyncHandler(itemController.obterItem));
router.put('/:id', asyncHandler(itemController.atualizarItem));
router.delete('/:id', asyncHandler(itemController.deletarItem));

module.exports = router;
