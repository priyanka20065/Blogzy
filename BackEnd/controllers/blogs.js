const Blog = require("../models/BlogSetting");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author");
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
    }

    let blog = await Blog.create(blogData);
    blog = await blog.populate("author"); // populate full author details
    res.status(201).json({ blog });
  } catch (error) {
    console.error("Create Blog Error:", error);
    res.status(400).json({ msg: error.message || error });
  }
};

module.exports = {
  getAllBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  createBlog,
};
