const blogsRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const mongoose = require('mongoose');

blogsRouter.get('/', async (req, res) => {
  const listOfBlogs = await Blog.find({})
    .populate('author', {username: 1, name: 1});
  res.json(listOfBlogs);
});

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  if (!req.token || !req.user.id) {
    return res.status(401).json({ error: 'you need a token to do this'})
  }

  const blog = new Blog({
    ...body,
    author: mongoose.Types.ObjectId(req.user.id)
  });
  const savedBlog = await blog.save();

  await User.updateOne(
    {_id : mongoose.Types.ObjectId(req.user.id)},
    {
      $push : {blogs: mongoose.Types.ObjectId(savedBlog)}
    });
  res.status(201).json(savedBlog)
});

blogsRouter.delete('/:id', async (req, res) => {
  const blogId = req.params.id;

  if (!req.token || !req.user.id) {
    return res.status(401).json({ error: 'you need a token to do this'})
  }

  const blogAuthor = await Blog.findById(blogId);
  if (blogAuthor.author.toString() !== req.user.id) {
    return res.status(401).json({ error: 'only authors can delete their blogs'})
  };

  const delBlog = await Blog.findByIdAndDelete(blogId);
  res.status(204).end()
});

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const newContent = req.body;
  const upBlog = await Blog.findByIdAndUpdate(id, newContent);
  res.json(upBlog)
});

module.exports = blogsRouter
