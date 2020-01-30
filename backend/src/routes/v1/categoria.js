const routes = require('express').Router();
const CategoriaController = require('../../controllers/CategoriaController');

const autenticarToken = require('../../middlewares/jwt')

routes.get('/', autenticarToken, CategoriaController.index);
routes.get('/todas', autenticarToken, CategoriaController.getAll);
routes.get('/:id', autenticarToken, CategoriaController.show);
routes.post('/', autenticarToken, CategoriaController.store);
routes.put('/:id', autenticarToken, CategoriaController.update);
routes.delete('/:id', autenticarToken, CategoriaController.destroy);

module.exports = routes;
