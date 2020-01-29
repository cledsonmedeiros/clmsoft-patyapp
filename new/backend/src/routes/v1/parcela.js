const routes = require('express').Router();
const ParcelaController = require('../../controllers/ParcelaController');

routes.get('/', ParcelaController.index);
routes.get('/receber/:id', ParcelaController.receber);
routes.get('/venda/:venda', ParcelaController.getByVenda);
routes.get('/:id', ParcelaController.show);
routes.post('/', ParcelaController.store);
routes.put('/:id', ParcelaController.update);
routes.delete('/:id', ParcelaController.destroy);
routes.delete('/venda/:id', ParcelaController.destroyMany);

module.exports = routes;
