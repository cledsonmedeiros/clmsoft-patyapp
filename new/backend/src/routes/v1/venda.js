const routes = require('express').Router();
const VendaController = require('../../controllers/VendaController');

routes.get('/', VendaController.index);
routes.get('/:id', VendaController.show);
routes.post('/', VendaController.store);
routes.put('/:id', VendaController.update);
routes.delete('/:id', VendaController.destroy);

module.exports = routes;
