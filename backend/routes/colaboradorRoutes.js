const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaboradorController');
const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Rotas para gerenciamento de Colaboradores
 * Base: /api/colaboradores
 */
router.post('/', asyncHandler(colaboradorController.criarColaborador));
router.get('/', asyncHandler(colaboradorController.listarColaboradores));
router.get('/:id', asyncHandler(colaboradorController.obterColaborador));
router.put('/:id', asyncHandler(colaboradorController.atualizarColaborador));
router.delete('/:id', asyncHandler(colaboradorController.deletarColaborador));

module.exports = router;
