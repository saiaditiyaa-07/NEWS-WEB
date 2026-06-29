const Blog = require('../models/Blog');
const fs = require('fs');
const path = require('path');

// Helper to check and resolve slug uniqueness
const makeUniqueSlug = async (title, currentBlogId = null) => {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (!baseSlug) {
    baseSlug = 'post';
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Find if slug is taken
    const query = { slug };
    if (currentBlogId) {
      query._id = { $ne: currentBlogId };
    }
    const existing = await Blog.findOne(query);
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};

// @desc    Get all blogs (with pagination, search, category filter, status filter)
// @route   GET /api/blogs
// @access  Public (Only shows published blogs unless admin query and authenticated)
const getBlogs = async (req, res, next) => {
  try {
    const { search, category, status, page = 1, limit = 6, admin } = req.query;

    const query = {};

    // Filter by status. Public requests always only show published posts.
    if (admin === 'true') {
      if (status) {
        query.status = status;
      }
    } else {
      query.status = 'published';
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = { $regex: new RegExp('^' + category + '$', 'i') };
    }

    // Search filter (title, description, tags)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination calculations
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skipNum = (pageNum - 1) * limitNum;

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skipNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats (Total, Published, Draft, Latest)
// @route   GET /api/blogs/stats
// @access  Private (Admin only)
const getStats = async (req, res, next) => {
  try {
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ status: 'published' });
    const draftBlogs = await Blog.countDocuments({ status: 'draft' });
    const latestBlog = await Blog.findOne().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      stats: {
        totalBlogs,
        publishedBlogs,
        draftBlogs,
        latestBlog
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by ID
// @route   GET /api/blogs/:id
// @access  Public / Private
const getBlogById = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog by Slug (public view)
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    // Increment view counter
    blog.views = (blog.views || 0) + 1;
    await blog.save();

    // Fetch related blogs (same category, excluding current post)
    const relatedBlogs = await Blog.find({
      category: blog.category,
      slug: { $ne: blog.slug },
      status: 'published'
    })
      .limit(3)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      blog,
      relatedBlogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog post
// @route   POST /api/blogs
// @access  Private (Admin only)
const createBlog = async (req, res, next) => {
  try {
    const { title, description, content, category, author, tags, status } = req.body;

    // Check for uploaded file
    if (!req.file) {
      res.status(400);
      throw new Error('Please upload a featured image');
    }

    // Auto-generate slug
    const slug = await makeUniqueSlug(title);

    // Parse tags if sent as JSON string or comma-separated
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (err) {
        parsedTags = tags.split(',').map(t => t.trim());
      }
    }

    // Save image path relative to server (public access URL format)
    const featuredImage = `/uploads/${req.file.filename}`;

    const blog = await Blog.create({
      title,
      slug,
      description,
      content,
      category,
      author: author || 'Admin',
      featuredImage,
      status: status || 'draft',
      tags: parsedTags
    });

    res.status(201).json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
const updateBlog = async (req, res, next) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    const { title, description, content, category, author, tags, status } = req.body;

    const updateData = {};
    if (description !== undefined) updateData.description = description;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (author !== undefined) updateData.author = author;
    if (status !== undefined) updateData.status = status;

    // Update title and recalculate slug if title changes
    if (title && title !== blog.title) {
      updateData.title = title;
      updateData.slug = await makeUniqueSlug(title, req.params.id);
    }

    // Handle tags update
    if (tags !== undefined) {
      try {
        updateData.tags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (err) {
        updateData.tags = tags.split(',').map(t => t.trim());
      }
    }

    // Handle image update if new file uploaded
    if (req.file) {
      // Try to delete old image from disk to save space
      const oldImagePath = path.join(__dirname, '..', blog.featuredImage);
      if (fs.existsSync(oldImagePath) && blog.featuredImage.startsWith('/uploads/')) {
        try {
          fs.unlinkSync(oldImagePath);
        } catch (err) {
          console.error('Error deleting old featured image:', err);
        }
      }
      updateData.featuredImage = `/uploads/${req.file.filename}`;
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      res.status(404);
      throw new Error('Blog post not found');
    }

    // Delete image file from server folder
    const imagePath = path.join(__dirname, '..', blog.featuredImage);
    if (fs.existsSync(imagePath) && blog.featuredImage.startsWith('/uploads/')) {
      try {
        fs.unlinkSync(imagePath);
      } catch (err) {
        console.error('Error deleting featured image file on delete:', err);
      }
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getStats,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
};
