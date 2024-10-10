import BlogPost from '../models/BlogPost.js';

// Create a new blog post
export const createBlogPost = async (req, res) => {
  const { title, category, content, imageURL } = req.body;

  try {
    const newPost = new BlogPost({
      title,
      category,
      content,
      imageURL,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all blog posts
export const getAllBlogPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().populate( 'title'); // If you don't need `createdBy`, remove it.
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single blog post by ID
export const getSingleBlogPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await BlogPost.findById(id).populate( 'title');

    if (!post) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a blog post
export const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const { title, category, content, imageURL } = req.body;

  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { title, category, content, imageURL },
      { new: true } // Return the updated document
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a blog post
export const deleteBlogPost = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPost = await BlogPost.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
