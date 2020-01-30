const express = require('express');

const router = express.Router();
const User = require('../../../models/User.model');

// RETURN ALL USERS
router.get('/', (req, res) => {
  User.find({})
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// CREATE USER
router.post('/', (req, res) => {
  const { user } = req.body;
  const newUser = new User(user);
  newUser.save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

module.exports = router;
