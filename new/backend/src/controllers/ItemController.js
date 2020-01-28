const Joi = require('joi');
const Item = require('../models/ItemModel');

module.exports = {
  async index (req, res) {
    try {
      const itens = await Item.find({}).sort({ createdAt: 'asc' }).populate('venda').populate('produto');
      return res.status(200).json(itens);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store (req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
      produto: Joi.string().required(),
      venda: Joi.string().required(),
      quantidade: Joi.number().required(),
      preco: Joi.number().required(),
    });

    Joi.validate(data, schema, { abortEarly: false }, async (err, value) => {
      if (err) {
        return res.status(400).json(err);
      }
      try {
        const item = await Item.create(req.body);
        return res.status(201).send(item);
      } catch (error) {
        return res.status(400).json(error);
      }
    });
  },
  async show (req, res) {
    try {
      const item = await Item.findById({
        _id: req.params.id,
      });
      if (!item) {
        return res.status(404).json({
          error: 'Item de venda não encontrado',
        });
      }
      return res.json(item);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async update (req, res) {
    try {
      const item = await Item.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await item.save();
      return res.status(201).json(item);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy (req, res) {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) {
        return res.status(404).send({
          error: 'Item de venda não encontrado',
        });
      }
      await item.remove();
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroyMany (req, res) {
    try {
      await Item.deleteMany({venda: req.params.id});
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async getByVenda (req, res) {
    try {
      const itens = await Item.find({ venda: req.params.venda }).sort({ createdAt: 'asc' }).populate('produto');
      return res.status(200).json(itens);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
