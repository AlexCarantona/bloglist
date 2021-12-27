const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res) => {
  const listOfUsers = await User.find({}).populate('blogs', {title: 1, url: 1});
  res.json(listOfUsers);
});

usersRouter.post('/', async (req, res) => {

  const body = req.body;
  if (!body.password || body.password.length <= 3) {
    return res.status(400).send({error: 'invalid password'})
  };
  const passwordHash = await bcrypt.hash(body.password, 10);

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash
  });
  const savedUser = await user.save();
  res.status(201).json(savedUser)
});

module.exports = usersRouter
