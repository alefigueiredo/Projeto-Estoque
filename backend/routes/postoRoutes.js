const express = require('express');
const router = express.Router();
const postoController = require('../controllers/postoController');
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Rotas para gerenciamento de Postos de Atendimento
 * Base: /api/postos
 */
router.post('/', asyncHandler(postoController.criarPosto));
router.get('/', asyncHandler(postoController.listarPostos));
router.get('/:id', asyncHandler(postoController.obterPosto));
router.put('/:id', asyncHandler(postoController.atualizarPosto));
router.delete('/:id', asyncHandler(postoController.deletarPosto));

module.exports = router;
