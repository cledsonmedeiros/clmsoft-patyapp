const routes = require('express').Router();

routes.get('/', (req, res) => res.json({ message: 'PatyApp API V1' }));

routes.use('/cliente', require('./cliente'));
routes.use('/usuario', require('./usuario'));
routes.use('/categoria', require('./categoria'));
routes.use('/produto', require('./produto'));
routes.use('/venda', require('./venda'));

module.exports = routes;
