const express = require("express");
const router = express.Router();
const Post = require("../../../models/Post.model");

router.get('/', (req, res) => {
  Post.find({})
  .then( data => {
    res.status(200).json(data)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

router.post('/' , (req, res) => {
  const { post } = req.body;
  const newPost = new Post(post)
  newPost.save()
  .then( data => {
    res.status(200).json(data)
  })
  .catch(err => {
    res.status(400).json(err)
  })
});

module.exports = router;
