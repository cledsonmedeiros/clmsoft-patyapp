const express = require('express');

const router = express.Router();
const axios = require('axios');
const ItemVenda = require('../../../models/ItemVenda.model');

// INDEX
router.get('/', (req, res) => {
  ItemVenda.find({})
    .populate({
      path: 'product',
      model: 'Produto',
      populate: {
        path: 'owner',
        model: 'ProdutoDono',
      },
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE
router.post('/', (req, res) => {
  const { sellItem } = req.body;
  const newItemVenda = new ItemVenda(sellItem);
  newItemVenda.save()
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    })
    .finally(() => {
      axios.get(`http://localhost:15000/api/v2/products/decreaseamount/${sellItem.product}/${sellItem.amount}`);
    });
});

// DELETE
router.delete('/delete/:id', (req, res) => {
  ItemVenda.findByIdAndDelete(req.params.id)
    .populate('product')
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CUSTOM
router.get('/owner/:id', (req, res) => {
  const { id } = req.params;
  ItemVenda.find({})
    .populate({
      path: 'product',
      model: 'Produto',
      populate: {
        path: 'owner',
        model: 'ProdutoDono',
      },
    })
    .then((data) => {
      products = [];
      data.forEach((element) => {
        if (String(element.product.owner._id).trim() === String(id).trim()) {
          products.push(element);
        }
      });
      res.status(200).json(products);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

router.get('/sell/:id', (req, res) => {
  const { id } = req.params;
  ItemVenda.find({ sell: id })
    // .populate({
    //   path: 'product',
    //   model: 'Produto',
    //   populate: {
    //     path: 'owner',
    //     model: 'ProdutoDono',
    //   },
    // })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
