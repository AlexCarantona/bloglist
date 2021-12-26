const listHelper = require('../utils/list_helper')

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1)
});

describe("Total likes", () => {
  const listWithOneBlog = [{
    title: 'One sample',
    likes: 5
  }];

  const extendedBlogList = [{
    title: 'Two samples first',
    likes: 8
  },
  {
    title: "Three samples",
    likes: 2
  }
  ].concat(listWithOneBlog);

  const emptyList = [];

  test("An empty list returns zero", () => {
    const total = listHelper.totalLikes(emptyList)
    expect(total).toBe(0)
  });
  test("In a one element list, the total likes equal those of the element", () => {
    const total = listHelper.totalLikes(listWithOneBlog);
    expect(total).toBe(5)
  });
  test("In a list with several elements, the total likes are a sum", () => {
    const total = listHelper.totalLikes(extendedBlogList);
    expect(total).toBe(15)
  });


})
