const express = require('express');
const router = express.Router();
const colaboradorController = require('../controllers/colaboradorController');

router.post('/', colaboradorController.criarColaborador);
router.get('/', colaboradorController.listarColaboradores);
router.get('/:id', colaboradorController.obterColaborador);
router.put('/:id', colaboradorController.atualizarColaborador);
router.delete('/:id', colaboradorController.deletarColaborador);

module.exports = router;