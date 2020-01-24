const Joi = require('joi');
const CategoriaProduto = require('../models/CategoriaProdutoModel');

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
      const categorias = await CategoriaProduto.paginate({}, options);
      return res.status(200).json(categorias);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store (req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
      nome: Joi.string().required(),
    });

    Joi.validate(data, schema, { abortEarly: false }, async (err, value) => {
      if (err) {
        return res.status(400).json(err);
      }
      try {
        const categoria = await CategoriaProduto.create(req.body);
        return res.status(201).send(categoria);
      } catch (error) {
        return res.status(400).json(error);
      }
    });
  },
  async show (req, res) {
    try {
      const categoria = await CategoriaProduto.findById({
        _id: req.params.id,
      });
      if (!categoria) {
        return res.status(404).json({
          error: 'Categoria de produto não encontrada',
        });
      }
      return res.json(categoria);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async update (req, res) {
    try {
      const categoria = await CategoriaProduto.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await categoria.save();
      return res.status(201).json(categoria);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy (req, res) {
    try {
      const categoria = await CategoriaProduto.findById(req.params.id);
      if (!categoria) {
        return res.status(404).send({
          error: 'Categoria de produto não encontrada',
        });
      }
      await categoria.remove();
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
