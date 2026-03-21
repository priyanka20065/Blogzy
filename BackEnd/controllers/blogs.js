
const Blog = require("../models/BlogSetting");
// Get all blogs created by the current user (public and private)
const getMyBlogs = async (req, res) => {
  try {
    const mongoose = require('mongoose');
    const userId = req.user.id;
    console.log(`[getMyBlogs] userId:`, userId);
    const query = { createdBy: new mongoose.Types.ObjectId(userId) };
    console.log(`[getMyBlogs] Query:`, query);
    const blogs = await Blog.find(query).populate("author");
    console.log(`[getMyBlogs] Found blogs:`, blogs.length);
    res.status(200).json({ blogs });
  } catch (error) {
    console.error(`[getMyBlogs] Error:`, error);
    res.status(500).json({ msg: error.message });
  }
};

const getAllBlogs = async (req, res) => {
  try {
    let userId = null;
    if (req.user) userId = req.user.id;
    // Show public blogs to everyone, and private blogs only to their creator
    const query = [
      { visibility: "public" },
    ];
    if (userId) {
      query.push({ createdBy: userId });
    }
    const blogs = await Blog.find({ $or: query }).populate("author");
    res.status(200).json({ blogs });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getBlog = async (req, res) => {
  try {
    const { id: blogID } = req.params;
    const blog = await Blog.findById(blogID).populate("author");
    if (!blog) {
      return res.status(404).json({ msg: `NO  blog with id : ${blogID}` });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(501).json({ msg: error });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { id: blogID } = req.params;
    const blog = await Blog.findByIdAndDelete(blogID).populate("author");
    if (!blog) {
      return res.status(404).json({ msg: `NO  blog with id : ${blogID}` });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(501).json({ msg: error });
  }
};

const updateBlog = async (req, res) => {
  try {
    const { id: blogID } = req.params;
    const blog = await Blog.findByIdAndUpdate(blogID, req.body, {
      new: true,
      runValidators: true,
    }).populate("author");
    if (!blog) {
      return res.status(404).json({ msg: `NO  blog with id : ${blogID}` });
    }
    res.status(200).json({ blog });
  } catch (error) {
    res.status(501).json({ msg: error });
  }
};

const createBlog = async (req, res) => {
  try {
    const blogData = { ...req.body };

    // If a file was uploaded, use its path
    if (req.file) {
      blogData.image = `/images/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      blogData.image = req.body.imageUrl;
    }


    // Set createdBy to current user as ObjectId
    const mongoose = require('mongoose');
    const userId = req.user.id;
    blogData.createdBy = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    // Authors can choose visibility, normal users always private
    if (req.user.role === "author") {
      blogData.visibility = blogData.visibility === "private" ? "private" : "public";
    } else {
      blogData.visibility = "private";
    }

    let blog = await Blog.create(blogData);
    blog = await blog.populate("author"); // populate full author details
    res.status(201).json({ blog });
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(400).json({ msg: error.message || error });
  }
};


// Add a comment to a blog
const addComment = async (req, res) => {
  try {
    const { id: blogID } = req.params;
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ msg: "Comment text is required." });
    }
    const blog = await Blog.findById(blogID);
    if (!blog) {
      return res.status(404).json({ msg: `No blog with id: ${blogID}` });
    }
    const comment = {
      user: req.user.id,
      text,
      createdAt: new Date(),
    };
    blog.comments.push(comment);
    await blog.save();
    await blog.populate({ path: "comments.user", select: "name image" });
    res.status(201).json({ comments: blog.comments });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  getAllBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  createBlog,
  addComment,
  getMyBlogs,
};
