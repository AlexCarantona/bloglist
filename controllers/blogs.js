const blogsRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const mongoose = require('mongoose');

blogsRouter.get('/', async (req, res, next) => {
  try {
    const listOfBlogs = await Blog.find({})
      .populate('author', {username: 1, name: 1});
    res.json(listOfBlogs);
  } catch(error){next(error)}
});

blogsRouter.post('/', async (req, res, next) => {
  try {
    const randomUser = await User.findOne({});

    const blog = new Blog({
      ...req.body,
      author: mongoose.Types.ObjectId(randomUser.id)
    });
    const savedBlog = await blog.save();

    await User.findByIdAndUpdate(randomUser.id,
      {
        blogs: randomUser.blogs.concat(mongoose.Types.ObjectId(savedBlog))
      });
    res.status(201).json(savedBlog)
  } catch(error) {next(error)}
});

blogsRouter.delete('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const delBlog = await Blog.findByIdAndDelete(id);
    res.status(204).end()
  } catch(error) {next(error)}
});

blogsRouter.put('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const newContent = req.body;
    const upBlog = await Blog.findByIdAndUpdate(id, newContent);
    res.json(upBlog)
  } catch(error) {next(error)}
});

module.exports = blogsRouter
