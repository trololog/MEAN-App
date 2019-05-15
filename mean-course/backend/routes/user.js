const express = require("express");
const bcrypt = require("bcrypt");
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash
      });

      user.save()
        .then((result) => {
          res.status(201).json({
            message: 'User created',
            result: result
          });
        })
        .catch((err)=> {
          res.status(500).json({
            error: err
          });
        });
    });
});

router.post("/login", (req, res, next) => {
  let user = new User();
  User.findOne({email: req.body.email})
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Authentication failed'
        });
      }

      user = result;
      return bcrypt.compare(req.body.password,result.password);
    })
    .then(result => {
      if(!result) {
        return res.status(401).json({
          message: 'Authentication failed'
        });
      }

      const token = jwt.sign({email: user.email, userId: user._id}, 'secret_phrase_long_long_long', {expiresIn: '1h'}); //TODO:Change it for prod

      res.status(200)
        .json({
          token: token,
          expiresIn: 3600
        });
    })
    .catch((err) => {
      return res.status(500).json({
        error: err
      });
    });
});


module.exports = router;
