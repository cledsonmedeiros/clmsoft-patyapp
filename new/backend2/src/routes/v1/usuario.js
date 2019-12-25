const routes = require('express').Router();
const UsuarioController = require('../../controllers/UsuarioController');

routes.get('/', UsuarioController.index);
routes.get('/:id', UsuarioController.show);
routes.post('/', UsuarioController.store);
routes.put('/:id', UsuarioController.update);
routes.delete('/:id', UsuarioController.destroy);
routes.post('/login', UsuarioController.login);

module.exports = routes;
