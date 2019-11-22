const routes = require('express').Router();

routes.get('/', (req, res) => res.json({ message: 'PATYAPP API' }));

routes.use('/clientes', require('./clientes'));

module.exports = routes;
