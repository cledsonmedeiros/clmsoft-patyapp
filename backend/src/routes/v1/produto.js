const routes = require('express').Router();
const ProdutoController = require('../../controllers/ProdutoController');

routes.get('/', ProdutoController.index);
routes.get('/nome/:nome', ProdutoController.getByName);
routes.get('/categoria/:id', ProdutoController.getByCategoria);
routes.get('/:id/quantidade/:operacao/:quantidade', ProdutoController.alterarQuantidade);
routes.get('/:id', ProdutoController.show);
routes.post('/', ProdutoController.store);
routes.put('/:id', ProdutoController.update);
routes.delete('/:id', ProdutoController.destroy);

module.exports = routes;
