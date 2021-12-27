const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const Blog = require('../models/Blog');
const User = require('../models/User');

const api = supertest(app);


describe("Blog endpoint operations", () => {
  const initialBlogs = [
    {
      title: "The Jerx",
      url: "https://www.thejerx.com/",
      likes: 34
    },
    {
      title: "Vanishing INC blog",
      url: "https://www.vanishingincmagic.com/blog/",
      likes: 12
    }
  ];

  var dummyUser = {};

  beforeEach(async() => {
    await Blog.deleteMany({});
    let passwordHash = await bcrypt.hash('dummyPwd', 10);
    dummyUser = await User.create({
      username: 'dummy',
      passwordHash
    });
    dummyUser.token = jwt.sign({username: 'dummy', id: dummyUser._id}, process.env.SECRET)
    const blogInserts = initialBlogs.map(blog =>
      Blog.create(
        {...blog,
          author: mongoose.Types.ObjectId(dummyUser._id)
        })
    )
    await Promise.all(blogInserts);
  });

  afterEach(async() => {
    await Blog.deleteMany({});
    await User.deleteMany({});
  })

  test('The _id field is substituted by id property in returned JSON', async () => {
    const response = await api.get('/api/blogs');
    expect(response.body[0].id).toBeDefined();
    expect(response.body[0]._id).not.toBeDefined();
    expect(response.body[0].__v).not.toBeDefined();
  });

  test('Insert operations are only allowed to token bearing requests', async () =>{
    const newBlog = {
      title: "Conjuring Archive",
      url: "https://www.conjuringarchive.com/",
      likes: 1
    };
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })

  test('A post request creates a new blog entry', async () => {
    const newBlog = {
      title: "Conjuring Archive",
      url: "https://www.conjuringarchive.com/",
      likes: 1
    };
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${dummyUser.token}`)
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
      url: "https://elcomercio.es"
    };

    const res = await api
    .post('/api/blogs')
    .set('Authorization', `bearer ${dummyUser.token}`)
    .send(newBlog);
    expect(res.body.likes).toBeDefined();
    expect(res.body.likes).toEqual(0);
  })

  test('A post request without title or url fails to pass validation', async () => {
    const newBlog = {
      likes: 5
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${dummyUser.token}`)
      .send(newBlog)
      .expect(400)
  })

  test('A delete call deletes a single blog post', async () => {
    const randomFetch = await Blog.findOne({});
    await api
      .delete(`/api/blogs/${randomFetch._id.toString()}`)
      .set('Authorization', `bearer ${dummyUser.token}`)
      .expect(204);

    const updatedList = await Blog.find({});
    expect(updatedList).toHaveLength(initialBlogs.length - 1);
  })

  test('A put call to increase the likes by one', async () => {
    const randomFetch = await Blog.findOne({});
    await api
      .put(`/api/blogs/${randomFetch._id.toString()}`)
      .send({likes: randomFetch.likes + 1})
      .expect(200)

    const updatedFetch = await Blog.findById(randomFetch._id.toString());
    expect(updatedFetch.likes).toEqual(randomFetch.likes + 1)

  })
});

describe('User endpoint operations', () => {

  beforeEach( async () => {
    await User.deleteMany({})
  });

  afterEach( async () => {
    await User.deleteMany({})
  });

  test("A user without valid password will not pass validation", async () => {
    const badUser = {
      name: "Bad"
    };
    const res = await api.post('/api/users')
      .send(badUser)
      .expect(400)
    expect(res.error).toBeDefined()
  });

  test("A user without valid username will not pass validation", async () => {
    const badUser = {
      name: "Bad",
      password: "982798739723"
    };
    const res = await api.post('/api/users')
      .send(badUser)
      .expect(400)
    expect(res.error).toBeDefined()
  });

  test("A user with a username less than 3 chars long will not pass validation", async () => {
    const badUser = {
      username: "ja",
      name: "Bad",
      password: "982798739723"
    };
    const res = await api.post('/api/users')
      .send(badUser)
      .expect(400)
    expect(res.error).toBeDefined()
  });
});

afterAll(() => {
  mongoose.connection.close()
});
