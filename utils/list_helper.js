const _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  if (blogs.length === 0) return 0;
  return blogs.map(blog => blog.likes).reduce((a, b) => a + b)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return undefined;
  return blogs.find(blog => blog.likes == Math.max(...blogs.map(blog => blog.likes)));
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return undefined;
  const authorsAndBlogs = _.map(_.groupBy(blogs, 'author'), (blogArray, index) =>
  {return {author: index, blogs: blogArray.length }});
  return _.orderBy(authorsAndBlogs, 'blogs', 'desc')[0]
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return undefined;
  const authorsAndLikes = _.map(_.groupBy(blogs, 'author'), (blogArray, index) =>
  {return {
    author: index,
    likes: _.reduce(_.map(blogArray, 'likes'), (sum, res) => sum + res, 0),
  }});
  return _.orderBy(authorsAndLikes, 'likes', 'desc')[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
