const Joi = require('joi');
const Produto = require('../models/ProdutoModel');

module.exports = {
  async index (req, res) {
    const options = {
      sort: {
        nome: 'asc',
      },
      populate: 'categoria',
      page: Number(req.query.page),
      limit: Number(req.query.limit),
    };
    try {
      const produtos = await Produto.paginate({}, options);
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
  async getByName (req, res) {
    try {
      const produtos = await Produto.find({ nome: { "$regex": req.params.nome, $options: "i" }, quantidade: { $gt: 0 }, }).sort({ nome: 'asc' });
      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  async alterarQuantidade (req, res) {
    const produtoID = req.params.id;
    const produtoOperacao = req.params.operacao;
    const produtoQuantidade = Number(req.params.quantidade);

    try {
      const produto = await Produto.findById({
        _id: produtoID,
      });
      if (!produto) {
        return res.status(404).json({
          error: 'Produto não encontrado',
        });
      } else {

        let novaQtd = 0;
        if (produtoOperacao === 'mais') {
          novaQtd = produto.quantidade + produtoQuantidade
        } else {
          novaQtd = produto.quantidade - produtoQuantidade
        }

        if (novaQtd < 0) {
          return res.status(404).json({
            error: 'Produto não pode ter quantidade negativa',
          });
        } else {
          try {
            const produto = await Produto.findByIdAndUpdate(produtoID, { quantidade: novaQtd }, {
              new: true,
            });
            await produto.save();
            return res.status(201).json(produto);
          } catch (error) {
            return res.status(400).json(error);
          }
        }
      }
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async getByCategoria (req, res) {
    try {
      const produtos = await Produto.find({ categoria: req.params.id }).sort({ nome: 'asc' });
      return res.status(200).json(produtos);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
