const blogsRouter = require('express').Router();
const Blog = require('../models/Blog');
const User = require('../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (req, res) => {
  const listOfBlogs = await Blog.find({})
    .populate('author', {username: 1, name: 1});
  res.json(listOfBlogs);
});

const getTokenFrom = request => {
  const authorization = request.get('authorization');
  if (authorization && authorization.toLowerCase().startsWith('bearer')){
    return authorization.substring(7)
  }
  return null
}

blogsRouter.post('/', async (req, res) => {
  const body = req.body;
  const token = getTokenFrom(req);
  const decodedToken = jwt.verify(token, process.env.SECRET);
  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: 'you need a token to do this'})
  }

  const author = await User.findById(decodedToken.id);

  const blog = new Blog({
    ...body,
    author: mongoose.Types.ObjectId(author.id)
  });
  const savedBlog = await blog.save();

  await User.findByIdAndUpdate(author.id,
    {
      blogs: author.blogs.concat(mongoose.Types.ObjectId(savedBlog))
    });
  res.status(201).json(savedBlog)
});

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const delBlog = await Blog.findByIdAndDelete(id);
  res.status(204).end()
});

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id;
  const newContent = req.body;
  const upBlog = await Blog.findByIdAndUpdate(id, newContent);
  res.json(upBlog)
});

module.exports = blogsRouter
