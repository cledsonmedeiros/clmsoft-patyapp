const routes = require('express').Router();
const ClienteController = require('../../controllers/ClienteController');

routes.get('/', ClienteController.index);
routes.get('/todos', ClienteController.getAll);
routes.get('/nome/:nome', ClienteController.getByName);
routes.get('/:id', ClienteController.show);
routes.post('/', ClienteController.store);
routes.put('/:id', ClienteController.update);
routes.delete('/:id', ClienteController.destroy);

module.exports = routes;
