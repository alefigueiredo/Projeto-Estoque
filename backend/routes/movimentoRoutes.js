const express = require('express');
const router = express.Router();
const movimentoController = require('../controllers/movimentoController');
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Rotas para gerenciamento de Movimentos de Estoque
 * Base: /api/movimentos
 */

// Colocar rota fixa ANTES da rota com :id para evitar conflitos
router.get('/relatorio', asyncHandler(movimentoController.gerarRelatorio));

router.post('/', asyncHandler(movimentoController.criarMovimento));
router.get('/', asyncHandler(movimentoController.listarMovimentos));
router.get('/:id', asyncHandler(movimentoController.obterMovimento));

module.exports = router;
