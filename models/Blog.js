const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A title is needed.']
  },
  author: String,
  url: String,
  likes: {
    type: Number,
    default: 0
  }
});

blogSchema.set('toJSON', {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id
  }
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog
