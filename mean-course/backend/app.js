const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers",
                "Origin, X-Requested-With, Content-Type, Accept");

  res.setHeader("Access-Control-Allow-Methods",
                "GET, POST, PATCH, DELETE, OPTIONS");

  next();
});

app.post('/api/posts',(req, res, next) => {
  const post = req.body;

  console.log(post);

  res.status(201).json({
    message: 'Success'
  });
});

app.use('/api/posts',(req, res, next) => {
  const posts = [
    { id: '0', title: 'Server-Side post - 1', content: "Post coming from the server"},
    { id: '1', title: 'Server-Side post - 2', content: "Post coming from the server"}
  ];

  res.status(200).json({
    message: 'Success',
    posts: posts
  });
});

module.exports = app;
