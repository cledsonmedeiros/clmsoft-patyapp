const routes = require('express').Router();
const ProdutoController = require('../../controllers/ProdutoController');

const autenticarToken = require('../../middlewares/jwt')

routes.get('/', autenticarToken, ProdutoController.index);
routes.get('/nome/:nome', autenticarToken, ProdutoController.getByName);
routes.get('/categoria/:id', autenticarToken, ProdutoController.getByCategoria);
routes.get('/:id/quantidade/:operacao/:quantidade', autenticarToken, ProdutoController.alterarQuantidade);
routes.get('/:id', autenticarToken, ProdutoController.show);
routes.post('/', autenticarToken, ProdutoController.store);
routes.put('/:id', autenticarToken, ProdutoController.update);
routes.delete('/:id', autenticarToken, ProdutoController.destroy);

module.exports = routes;
