const express = require("express");
const app = express();
const path = require("path");
const blogRoutes = require("./routes/blogs");
const authorRoutes = require("./routes/authors");
const contactRoutes = require("./routes/contact");
const paymentRoutes = require("./routes/payment");
const connectDb = require("./db/connect");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const auth = require("./middleware/auth");
require("dotenv").config();

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/images", express.static(path.join(__dirname, "images")));

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (apply auth middleware after public routes)
// app.use(auth);
app.use((req, res, next) => {
  console.log(`[Request LOG] ${req.method} ${req.url}`);
  next();
});
app.use("/api/payment", paymentRoutes);
app.use("/api/user", require("./routes/userRoutes"));
// Mount routers
app.use("/api/contact", contactRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/blogs", blogRoutes);

// Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("[Global Error Handler]", err);
  res.status(500).json({ msg: "Internal Server Error", error: err.message, stack: err.stack });
});

const port = 8000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
