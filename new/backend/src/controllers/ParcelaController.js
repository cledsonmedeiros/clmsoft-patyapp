const Joi = require('joi');
const Parcela = require('../models/ParcelaModel');

module.exports = {
  async index (req, res) {
    try {
      const parcelas = await Parcela.find({}).sort({ createdAt: 'asc' });
      return res.status(200).json(parcelas);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store (req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
      venda: Joi.string().required(),
      data: Joi.string().required(),
      valor: Joi.number().required(),
      isPaga: Joi.boolean().required(),
    });

    Joi.validate(data, schema, { abortEarly: false }, async (err, value) => {
      if (err) {
        return res.status(400).json(err);
      }
      try {
        const parcela = await Parcela.create(req.body);
        return res.status(201).send(parcela);
      } catch (error) {
        return res.status(400).json(error);
      }
    });
  },
  async show (req, res) {
    try {
      const parcela = await Parcela.findById({
        _id: req.params.id,
      });
      if (!parcela) {
        return res.status(404).json({
          error: 'Parcela não encontrada',
        });
      }
      return res.json(parcela);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async update (req, res) {
    try {
      const parcela = await Parcela.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await parcela.save();
      return res.status(201).json(parcela);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy (req, res) {
    try {
      const parcela = await Parcela.findById(req.params.id);
      if (!parcela) {
        return res.status(404).send({
          error: 'Parcela não encontrada',
        });
      }
      await parcela.remove();
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async receber (req, res) {
    try {
      const parcela = await Parcela.findByIdAndUpdate(req.params.id, { isPaga: true }, {
        new: true,
      });
      await parcela.save();
      return res.status(201).json(parcela);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async getByVenda (req, res) {
    try {
      const parcelas = await Parcela.find({ venda: req.params.venda }).sort({ createdAt: 'asc' });
      return res.status(200).json(parcelas);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
};
