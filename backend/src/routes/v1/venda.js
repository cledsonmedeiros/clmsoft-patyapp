const routes = require('express').Router();
const VendaController = require('../../controllers/VendaController');

const autenticarToken = require('../../middlewares/jwt')

routes.get('/', autenticarToken, VendaController.index);
routes.get('/hoje/dinheiro', autenticarToken, VendaController.getByHojeDinheiro);
routes.get('/hoje/promissoria', autenticarToken, VendaController.getByHojePromissoria);
routes.get('/:id', autenticarToken, VendaController.show);
routes.get('/cliente/:id', autenticarToken, VendaController.getByCliente);
routes.get('/usuario/:id', autenticarToken, VendaController.getByUsuario);
routes.post('/', autenticarToken, VendaController.store);
routes.put('/:id', autenticarToken, VendaController.update);
routes.delete('/:id', autenticarToken, VendaController.destroy);

module.exports = routes;
