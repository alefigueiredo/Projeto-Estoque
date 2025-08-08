const express = require('express');
const router = express.Router();
const movimentoController = require('../controllers/movimentoController');

router.post('/', movimentoController.criarMovimento);
router.get('/', movimentoController.listarMovimentos);
router.get('/:id', movimentoController.obterMovimento);
router.get('/relatorio', movimentoController.gerarRelatorio);

module.exports = router;