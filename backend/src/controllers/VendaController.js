const Joi = require('joi');
const Venda = require('../models/VendaModel');

module.exports = {
  async index (req, res) {
    const options = {
      sort: {
        createdAt: 'desc',
      },
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      populate: [
        {
          path: 'cliente',
          select: 'nome',
        },
        {
          path: 'vendedor',
          select: 'nome',
        },
      ],
    };
    try {
      const vendas = await Venda.paginate({}, options);
      return res.status(200).json(vendas);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store (req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
      data: Joi.string().required(),
      isPrazo: Joi.boolean().required(),
      isConcluida: Joi.boolean().required(),
      cliente: Joi.string().allow(null),
      vendedor: Joi.string().required(),
      total: Joi.number().required(),
    });

    Joi.validate(data, schema, { abortEarly: false }, async (err, value) => {
      if (err) {
        return res.status(400).json(err);
      }
      try {
        const venda = await Venda.create(req.body);
        return res.status(201).send(venda);
      } catch (error) {
        return res.status(400).json(error);
      }
    });
  },
  async show (req, res) {
    try {
      const venda = await Venda.findById({
        _id: req.params.id,
      });
      if (!venda) {
        return res.status(404).json({
          error: 'Venda não encontrada',
        });
      }
      return res.json(venda);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async update (req, res) {
    try {
      const venda = await Venda.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await venda.save();
      return res.status(201).json(venda);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy (req, res) {
    try {
      const venda = await Venda.findById(req.params.id);
      if (!venda) {
        return res.status(404).send({
          error: 'Venda não encontrada',
        });
      }
      await venda.remove();
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async getByCliente (req, res) {
    try {
      const vendas = await Venda.find({ cliente: req.params.id }).sort({ createdAt: 'desc' });
      return res.status(200).json(vendas);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  async getByUsuario (req, res) {
    try {
      const vendas = await Venda.find({ vendedor: req.params.id }).sort({ createdAt: 'desc' });
      return res.status(200).json(vendas);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
