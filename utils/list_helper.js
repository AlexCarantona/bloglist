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
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
