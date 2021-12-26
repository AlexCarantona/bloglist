const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const Blog = require('../models/Blog');
const initialBlogs = [
  {
    title: "The Jerx",
    author: "Andy Jerx",
    url: "https://www.thejerx.com/",
    likes: 34
  },
  {
    title: "Vanishing INC blog",
    author: "Andy Gladwin",
    url: "https://www.vanishingincmagic.com/blog/"
  }
];

beforeEach(async() => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
})

test('There are two blogs listed', async() => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(2)
});

afterAll(() => {
  mongoose.connection.close()
});
