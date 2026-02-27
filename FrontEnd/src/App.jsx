import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./nav";
import Footer from "./footer";
import WriteBlog from "./writeBlog";
import Home from "./home";
import Blogs from "./blogs";
import BlogDetails from "./blogDetail";
import AuthorDetail from "./authorDetail";
import Authors from "./authors";
import Bookmarks from "./bookmarks";
import Contact from "./contact";
import Login from "./login";
import Signup from "./signup";
import ProtectedRoute from "./protectedRoute";
import Profile from "./profile";
import { ThemeProvider } from "./themeContext";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Home />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs"
            element={
              <ProtectedRoute>
                <Navbar />
                <Blogs />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/blogs/:category"
            element={
              <ProtectedRoute>
                <Navbar />
                <Blogs />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/author/:name"
            element={
              <ProtectedRoute>
                <Navbar />
                <Blogs />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blogs/detail/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <BlogDetails />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <Navbar />
                <Bookmarks />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/authors"
            element={
              <ProtectedRoute>
                <Navbar />
                <Authors />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Navbar />
                <Contact />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/write"
            element={
              <ProtectedRoute>
                <Navbar />
                <WriteBlog />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/author/:id"
            element={
              <ProtectedRoute>
                <Navbar />
                <AuthorDetail />
                <Footer />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Navbar />
                <Profile />
                <Footer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;