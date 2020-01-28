const routes = require('express').Router();
const ItemController = require('../../controllers/ItemController');

routes.get('/', ItemController.index);
routes.get('/venda/:venda', ItemController.getByVenda);
routes.get('/:id', ItemController.show);
routes.post('/', ItemController.store);
routes.put('/:id', ItemController.update);
routes.delete('/:id', ItemController.destroy);
routes.delete('/venda/:id', ItemController.destroyMany);

module.exports = routes;
