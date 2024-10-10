import express from 'express';
import {
  createBlogPost,
  getAllBlogPosts,
  getSingleBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from '../controllers/blogPostController.js'; 

const router = express.Router();

// Create a new blog post
router.post('/blog', createBlogPost); // Ensure this matches your request

// Get all blog posts
router.get('/blog', getAllBlogPosts); // Ensure this matches your request

// Get a single blog post by ID
router.get('/blog/:id', getSingleBlogPost);

// Update a blog post
router.put('/blog/:id', updateBlogPost); // Removed authentication

// Delete a blog post
router.delete('/blog/:id', deleteBlogPost); // Removed authentication

export default router;
