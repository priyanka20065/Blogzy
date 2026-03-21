// update_blog_authors.js
// Usage: node update_blog_authors.js

const mongoose = require('mongoose');
const Blog = require('./models/BlogSetting');
const Author = require('./models/AuthorSetting');
require('dotenv').config();


// Get MongoDB connection string from environment (support MONGODB_URI, MONGO_URL, MONGO_URI)
const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URL || process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MongoDB connection string not found in MONGODB_URI, MONGO_URL, or MONGO_URI');
}

// Define your mapping here: blog heading => author name
const blogToAuthorMap = {
  'Exploring Ancient Artifacts': 'Tony Stark',
  'The Fighting Spirit of Champions': 'The Joker',
  // Add more mappings as needed
};


async function updateBlogAuthors() {
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');

  // 1. Update blogs by mapping (if any)
  for (const [blogHeading, authorName] of Object.entries(blogToAuthorMap)) {
    const author = await Author.findOne({ name: authorName });
    if (!author) {
      console.warn(`Author not found: ${authorName}`);
      continue;
    }
    const blog = await Blog.findOneAndUpdate(
      { heading: blogHeading },
      { $set: { author: author._id } },
      { new: true }
    );
    if (blog) {
      console.log(`Updated blog '${blogHeading}' with author '${authorName}' (${author._id})`);
    } else {
      console.warn(`Blog not found: ${blogHeading}`);
    }
  }

  // 2. Assign all blogs with missing/invalid author to a valid author
  const firstAuthor = await Author.findOne();
  if (!firstAuthor) {
    console.error('No authors found in the database. Cannot assign authors to blogs.');
    await mongoose.disconnect();
    return;
  }

  // Find blogs with missing or invalid author
  const blogs = await Blog.find();
  let updatedCount = 0;
  for (const blog of blogs) {
    let needsUpdate = false;
    if (!blog.author) {
      needsUpdate = true;
    } else {
      // Check if author exists
      const exists = await Author.exists({ _id: blog.author });
      if (!exists) needsUpdate = true;
    }
    if (needsUpdate) {
      blog.author = firstAuthor._id;
      await blog.save();
      updatedCount++;
      console.log(`Assigned default author '${firstAuthor.name}' (${firstAuthor._id}) to blog '${blog.heading}'`);
    }
  }
  if (updatedCount === 0) {
    console.log('All blogs already have valid authors.');
  } else {
    console.log(`Updated ${updatedCount} blogs with default author '${firstAuthor.name}'.`);
  }

  await mongoose.disconnect();
  console.log('Done. Disconnected from MongoDB.');
}

updateBlogAuthors().catch(err => {
  console.error('Error updating blog authors:', err);
  process.exit(1);
});
