const routes = require('express').Router();

routes.get('/', (req, res) => res.json({ message: 'PATYAPP API' }));

routes.use('/cliente', require('./cliente'));
routes.use('/usuario', require('./usuario'));

module.exports = routes;
