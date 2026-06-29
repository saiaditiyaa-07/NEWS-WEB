const express = require('express');
const router = express.Router();
const {
  getBlogs,
  getStats,
  getBlogById,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ─── IMPORTANT: Specific static routes MUST come before dynamic /:param routes ───

// Admin-only protected routes (must be before /:id)
router.get('/admin/stats', protect, getStats);

// Public routes
router.get('/', getBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);

// Blog mutation routes (protected)
router.post('/', protect, upload.single('featuredImage'), createBlog);
router.put('/:id', protect, upload.single('featuredImage'), updateBlog);
router.delete('/:id', protect, deleteBlog);

module.exports = router;
