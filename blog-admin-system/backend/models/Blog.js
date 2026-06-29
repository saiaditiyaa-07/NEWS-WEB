const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'Please add a slug'],
      unique: true,
      trim: true,
      lowercase: true
    },
    description: {
      type: String,
      required: [true, 'Please add a short description'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'Please add blog content']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Please specify an author'],
      default: 'Admin'
    },
    featuredImage: {
      type: String,
      required: [true, 'Please add a featured image path']
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft'
    },
    tags: {
      type: [String],
      default: []
    },
    views: {
      type: Number,
      default: 0
    },
    readingTime: {
      type: Number, // Estimated reading time in minutes
      default: 1
    }
  },
  {
    timestamps: true
  }
);

// Calculate estimated reading time before saving
BlogSchema.pre('save', function (next) {
  if (this.isModified('content')) {
    const wordsPerMinute = 200;
    // Strip HTML/RichText tags to count text words
    const cleanText = this.content.replace(/<[^>]*>/g, '');
    const wordCount = cleanText.split(/\s+/).filter(word => word.length > 0).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
  next();
});

module.exports = mongoose.model('Blog', BlogSchema);
