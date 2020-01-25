const routes = require('express').Router();
const CategoriaProdutoController = require('../../controllers/CategoriaProdutoController');

routes.get('/', CategoriaProdutoController.index);
routes.get('/todas', CategoriaProdutoController.getAll);
routes.get('/:id', CategoriaProdutoController.show);
routes.post('/', CategoriaProdutoController.store);
routes.put('/:id', CategoriaProdutoController.update);
routes.delete('/:id', CategoriaProdutoController.destroy);

module.exports = routes;
