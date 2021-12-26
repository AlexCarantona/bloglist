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

test('The _id field is substituted by id property in returned JSON', async () => {
  const response = await api.get('/api/blogs');
  expect(response.body[0].id).toBeDefined();
  expect(response.body[0]._id).not.toBeDefined();
  expect(response.body[0].__v).not.toBeDefined();
});

test('A post request creates a new blog entry', async () => {
  const newBlog = {
    title: "Conjuring Archive",
    author: "Denis Behr",
    url: "https://www.conjuringarchive.com/",
    likes: 1
  };
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(titles).toContain("Conjuring Archive");
});

test('A post request without likes field defaults to 0', async () => {
  const newBlog = {
    title: "El Comercio",
    author: "VV.AA.",
    url: "https://elcomercio.es"
  };

  const res = await api.post('/api/blogs').send(newBlog);
  expect(res.body.likes).toBeDefined();
  expect(res.body.likes).toEqual(0);
})

test('A post request without title or url fails to pass validation', async () => {
  const newBlog = {
    author: "Me",
    likes: 5
  };

  await api.post('/api/blogs')
    .send(newBlog)
    .expect(400)
})

test('A delete call deletes a single blog post', async () => {
  const randomFetch = await Blog.findOne({});
  await api.delete(`/api/blogs/${randomFetch._id.toString()}`)
    .expect(204);

  const updatedList = await Blog.find({});
  expect(updatedList).toHaveLength(initialBlogs.length - 1);
})

test('A put call to increase the likes by one', async () => {
  const randomFetch = await Blog.findOne({});
  console.log(randomFetch);
  await api.put(`/api/blogs/${randomFetch._id.toString()}`)
    .send({likes: randomFetch.likes + 1})
    .expect(200)

  const updatedFetch = await Blog.findById(randomFetch._id.toString());
  expect(updatedFetch.likes).toEqual(randomFetch.likes + 1)

})

afterAll(() => {
  mongoose.connection.close()
});
