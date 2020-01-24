const Joi = require('joi');
const Produto = require('../models/ProdutoModel');

module.exports = {
  async index (req, res) {
    const { page = 1, limit = 5 } = req.query;
    const options = {
      sort: {
        nome: 'asc',
      },
      populate: 'categoria',
    };
    try {
      const produtos = await Produto.paginate({}, options, { page, limit });
      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store (req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
      nome: Joi.string().required(),
      quantidade: Joi.number().required(),
      categoria: Joi.string().required(),
      preco_compra: Joi.number().required(),
      preco_revenda: Joi.number().required(),
    });

    Joi.validate(data, schema, { abortEarly: false }, async (err, value) => {
      if (err) {
        return res.status(400).json(err);
      }
      try {
        const produto = await Produto.create(req.body);
        return res.status(201).send(produto);
      } catch (error) {
        return res.status(400).json(error);
      }
    });
  },
  async show (req, res) {
    try {
      const produto = await Produto.findById({
        _id: req.params.id,
      }).populate('categoria');
      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado',
        });
      }
      return res.json(produto);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async update (req, res) {
    try {
      const produto = await Produto.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await produto.save();
      return res.status(201).json(produto);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy (req, res) {
    try {
      const produto = await Produto.findById(req.params.id);
      if (!produto) {
        return res.status(404).send({
          error: 'Produto não encontrado',
        });
      }
      await produto.remove();
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
