const Joi = require('joi');
const Cliente = require('../models/ClienteModel');

module.exports = {
  async index (req, res) {
    const options = {
      sort: {
        nome: 'asc',
      },
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    };
    try {
      const clientes = await Cliente.paginate({}, options);
      return res.status(200).json(clientes);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store (req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
      nome: Joi.string().min(2).required(),
      telefone: Joi.string().min(14).max(16),
      endereco: Joi.string(),
      cpf: Joi.string().min(14).max(14),
    });

    Joi.validate(data, schema, { abortEarly: false }, async (err, value) => {
      if (err) {
        return res.status(400).json(err);
      }
      try {
        const cliente = await Cliente.create(req.body);
        return res.status(201).send(cliente);
      } catch (error) {
        return res.status(400).json(error);
      }
    });
  },
  async show (req, res) {
    try {
      const cliente = await Cliente.findById({
        _id: req.params.id,
      });
      if (!cliente) {
        return res.status(404).json({
          error: 'Cliente não encontrado',
        });
      }
      return res.json(cliente);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async update (req, res) {
    try {
      const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await cliente.save();
      return res.status(201).json(cliente);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy (req, res) {
    try {
      const cliente = await Cliente.findById(req.params.id);
      if (!cliente) {
        return res.status(404).send({
          error: 'Cliente não encontrado',
        });
      }
      await cliente.remove();
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
