require('dotenv/config');
const routes = require('express').Router();
const UsuarioController = require('../../controllers/UsuarioController');

const autenticarToken = require('../../middlewares/jwt')

routes.get('/', autenticarToken, UsuarioController.index);
routes.get('/:id', autenticarToken, UsuarioController.show);
routes.post('/', UsuarioController.store);
routes.put('/:id', autenticarToken, UsuarioController.update);
routes.delete('/:id', autenticarToken, UsuarioController.destroy);
routes.post('/login', UsuarioController.login);

module.exports = routes;
