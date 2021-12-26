const listHelper = require('../utils/list_helper')

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1)
});

const listWithOneBlog = [{
  title: 'One sample',
  likes: 5,
  author: 'A'
}];

const extendedBlogList = [{
  title: 'Two samples first',
  likes: 8,
  author: 'B'
},
{
  title: "Three samples",
  likes: 2,
  author: 'A'
}
].concat(listWithOneBlog);

const emptyList = [];

describe("Total likes", () => {

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
});

describe("Favorite blog", () => {

  test("An array of blogs return the one with more likes", () => {
    const fav = listHelper.favoriteBlog(extendedBlogList);
    expect(fav.title).toEqual('Two samples first');
  });

  test("An empty array returns undefined", () => {
    const fav = listHelper.favoriteBlog(emptyList);
    expect(fav).toBe(undefined);
  })
});

describe("Most blogs", () => {
  test("A has the most blogs (2)", () => {
    const author = listHelper.mostBlogs(extendedBlogList);
    expect(author).toEqual({author: 'A', blogs: 2})
  })
});
