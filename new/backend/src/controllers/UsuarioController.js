const Joi = require('joi');
const Usuario = require('../models/UsuarioModel');

module.exports = {
  async index (req, res) {
    try {
      const usuarios = await Usuario.find({});
      return res.status(200).json(usuarios);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
  store (req, res, next) {
    const data = req.body;
    const schema = Joi.object().keys({
      nome: Joi.string().min(1).required(),
      usuario: Joi.string().min(1).required(),
      senha: Joi.string().min(1).required(),
    });

    Joi.validate(data, schema, async (err, value) => {
      if (err) {
        return res.status(400).json(err);
      }
      try {
        const usuario = await Usuario.create(req.body);
        return res.status(201).send(usuario);
      } catch (error) {
        return res.status(400).json(error);
      }
    });
  },
  async show (req, res) {
    try {
      const usuario = await Usuario.findById({
        _id: req.params.id,
      });
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado',
        });
      }
      return res.json(usuario);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async update (req, res) {
    try {
      const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      await usuario.save();
      return res.status(201).json(usuario);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async destroy (req, res) {
    try {
      const usuario = await Usuario.findById(req.params.id);
      if (!usuario) {
        return res.status(404).send({
          error: 'Usuário não encontrado',
        });
      }
      await usuario.remove();
      return res.status(200).send();
    } catch (error) {
      return res.status(400).json(error);
    }
  },
  async login (req, res) {
    try {
      const usuario = await Usuario.findOne({
        ...req.body,
      });
      if (!usuario) {
        return res.status(404).json({
          error: 'Usuário não encontrado',
        });
      }
      return res.json(usuario);
    } catch (error) {
      return res.status(400).json(error);
    }
  },
};
