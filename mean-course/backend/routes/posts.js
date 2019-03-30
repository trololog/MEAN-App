const Post = require('../models/post');
const express = require("express");
const multer = require('multer');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = null;

    if(!isValid)
      error = new Error('Invalid mime type');

    cb(error, "backend/images")
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null,  name.concat('-',Date.now(),'.',ext));
  }
});

router.post('',multer({storage: storage}).single("image"),(req, res, next) => {
  const url = req.protocol.concat('://', req.get("host"));
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url.concat('/images/', req.file.filename)
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Success',
      post: {
        title:createdPost.title,
        content: createdPost.content,
        imagePath: createdPost.imagePath,
        id: createdPost._id
      }
    });
  });
});

router.put('/:id', (req, res, next) => {
  console.log('put');
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then(result=> {
     console.log(result);
      res.status(200).json({message: 'Update successful!'});
    });
});

router.get('',(req, res, next) => {
  Post.find()
    .then(documents => {
      res.status(200).json({
        message: 'Success',
        posts: documents
      });
    });
});

router.get('/:id',(req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if(post) {
      res.status(200).json(post);
    } else
      res.status(400).json({ message: 'Post not found'});
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result=> console.log(result));

    res.status(200).json({ message: 'Post Deleted!'});
});

module.exports = router;
