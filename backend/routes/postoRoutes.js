const express = require('express');
const router = express.Router();
const postoController = require('../controllers/postoController');

router.post('/', postoController.criarPosto);
router.get('/', postoController.listarPostos);
router.get('/:id', postoController.obterPosto);
router.put('/:id', postoController.atualizarPosto);
router.delete('/:id', postoController.deletarPosto);

module.exports = router;