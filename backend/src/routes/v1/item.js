const routes = require('express').Router();
const ItemController = require('../../controllers/ItemController');

const autenticarToken = require('../../middlewares/jwt')

routes.get('/', autenticarToken, ItemController.index);
routes.get('/venda/:id', autenticarToken, ItemController.getByVenda);
routes.get('/produto/:id', autenticarToken, ItemController.getByProduto);
routes.get('/:id', autenticarToken, ItemController.show);
routes.post('/', autenticarToken, ItemController.store);
routes.put('/:id', autenticarToken, ItemController.update);
routes.delete('/:id', autenticarToken, ItemController.destroy);
routes.delete('/venda/:id', autenticarToken, ItemController.destroyMany);

module.exports = routes;
