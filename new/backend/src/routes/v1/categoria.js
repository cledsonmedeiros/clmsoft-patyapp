const routes = require('express').Router();
const CategoriaController = require('../../controllers/CategoriaController');

routes.get('/', CategoriaController.index);
routes.get('/todas', CategoriaController.getAll);
routes.get('/:id', CategoriaController.show);
routes.post('/', CategoriaController.store);
routes.put('/:id', CategoriaController.update);
routes.delete('/:id', CategoriaController.destroy);

module.exports = routes;
