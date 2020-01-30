const routes = require('express').Router();
const ParcelaController = require('../../controllers/ParcelaController');

const autenticarToken = require('../../middlewares/jwt')

routes.get('/', autenticarToken, ParcelaController.index);
routes.get('/receber/:id', autenticarToken, ParcelaController.receber);
routes.get('/venda/:venda', autenticarToken, ParcelaController.getByVenda);
routes.get('/:id', autenticarToken, ParcelaController.show);
routes.post('/', autenticarToken, ParcelaController.store);
routes.put('/:id', autenticarToken, ParcelaController.update);
routes.delete('/:id', autenticarToken, ParcelaController.destroy);
routes.delete('/venda/:id', autenticarToken, ParcelaController.destroyMany);

module.exports = routes;
