const blogsRouter = require('express').Router();
const Blog = require('../models/Blog');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const listOfBlogs = await Blog.find({});
    res.json(listOfBlogs);
  } catch(error){next(error)}
});

blogsRouter.post('/', (req, res, next) => {
  const blog = new Blog(req.body)

  blog
    .save()
    .then(result => {
      res.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter
