const blogsRouter = require('express').Router();
const Blog = require('../models/Blog');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const listOfBlogs = await Blog.find({});
    res.json(listOfBlogs);
  } catch(error){next(error)}
});

blogsRouter.post('/', async (req, res, next) => {
  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog)
  } catch(error) {next(error)}
})

module.exports = blogsRouter
