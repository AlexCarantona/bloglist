const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A title is needed.']
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  author: String,
  url: {
    type: String,
    required: [true, 'A url is needed.']
  },
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
