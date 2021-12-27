const usersRouter = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

usersRouter.get('/', async (req, res, next) => {
  try {
    const listOfUsers = await User.find({});
    res.json(listOfUsers);
  } catch(error){next(error)}
});

usersRouter.post('/', async (req, res, next) => {
  try {
    console.log(req.body);
    const body = req.body;
    const passwordHash = await bcrypt.hash(body.password, 10);

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    });
    const savedUser = await user.save();
    res.status(201).json(savedUser)
  } catch(error) {next(error)}
});

module.exports = usersRouter
