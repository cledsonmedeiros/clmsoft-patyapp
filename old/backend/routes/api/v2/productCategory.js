const express = require('express');

const router = express.Router();
const ProdutoCategoria = require('../../../models/ProdutoCategoria.model');

// INDEX
router.get('/', (req, res) => {
  ProdutoCategoria.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { productcategory } = req.body;
  const newProdutoCategoria = new ProdutoCategoria(productcategory);
  newProdutoCategoria.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// READ
router.get('/show/:id', (req, res) => {
  ProdutoCategoria.findById(req.params.id)
    .then((data) => {
      if (!data) {
        res.status(404).json({
          error: 'Product category not found',
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
  ProdutoCategoria.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  ProdutoCategoria.findByIdAndDelete(req.params.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
