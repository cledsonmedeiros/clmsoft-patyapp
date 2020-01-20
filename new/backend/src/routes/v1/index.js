const routes = require('express').Router();

routes.get('/', (req, res) => res.json({ message: 'PatyApp API V1' }));

routes.use('/cliente', require('./cliente'));
routes.use('/usuario', require('./usuario'));

module.exports = routes;
