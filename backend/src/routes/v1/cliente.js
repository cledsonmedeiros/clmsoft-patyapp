const routes = require('express').Router();
const ClienteController = require('../../controllers/ClienteController');

const autenticarToken = require('../../middlewares/jwt')

routes.get('/', autenticarToken, ClienteController.index);
routes.get('/todos', autenticarToken, ClienteController.getAll);
routes.get('/nome/:nome', autenticarToken, ClienteController.getByName);
routes.get('/:id', autenticarToken, ClienteController.show);
routes.post('/', autenticarToken, ClienteController.store);
routes.put('/:id', autenticarToken, ClienteController.update);
routes.delete('/:id', autenticarToken, ClienteController.destroy);

module.exports = routes;
