const express = require('express');

const router = express.Router();
const Cliente = require('../../../models/Cliente.model');


// INDEX
router.get('/', (req, res) => {
  Cliente.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { customer } = req.body;
  const newCliente = new Cliente(customer);
  newCliente.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
router.get('/show/:id', (req, res) => {
  Cliente.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          error: 'Cliente not found',
        });
      } else {
        res.status(200).json(data);
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// UPDATE
router.put('/update/:id', (req, res) => {
  Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  Cliente.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CUSTOM
router.get('/name/:name', (req, res) => {
  // res.send(req.params.name)
  Cliente.find({ "name": { "$regex": req.params.name, "$options": "i" } })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
