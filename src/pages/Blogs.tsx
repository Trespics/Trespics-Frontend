import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Eye, Heart, Bookmark, MessageCircle, ArrowRight, PenLine, FileText, Calendar } from "lucide-react";
import api from "@/lib/api";
import "./styles/Blogs.css";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  category: string;
  author_name: string;
  author_avatar: string | null;
  views_count: number;
  likes_count: number;
  saves_count: number;
  published_at: string;
}

const Blogs = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { page: String(page), limit: "12", sort: sortBy };
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const response = await api.get("/blogs", { params });
      setBlogs(response.data.blogs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch blogs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("/blogs/categories");
      setCategories(response.data || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchBlogs(); }, [page, selectedCategory, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBlogs();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="blogs-page">
      {/* Hero */}
      <section className="blogs-hero">
        <div className="blogs-hero-container">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="blogs-hero-title">
          <span>  Our Blog</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="blogs-hero-description">
            Insights, tutorials, and updates from the Florante team
          </motion.p>

          {/* Toolbar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="blogs-toolbar">
            <form onSubmit={handleSearch} className="blogs-search-wrapper">
              <Search size={18} className="blogs-search-icon" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="blogs-search-input"
              />
            </form>

            <select value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }} className="blogs-category-select">
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }} className="blogs-sort-select">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Viewed</option>
              <option value="most_liked">Most Liked</option>
            </select>

            <Link to="/blogs/create" className="blogs-write-btn">
              <PenLine size={18} />
              Write Blog
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="blogs-content">
        {loading ? (
          <div className="blogs-loading">
            <div className="blogs-loading-spinner" />
            <p>Loading blogs...</p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="blogs-empty">
            <div className="blogs-empty-icon"><FileText size={64} /></div>
            <h3>No blogs found</h3>
            <p>Be the first to share your story!</p>
            <Link to="/blogs/create" className="blogs-write-btn">
              <PenLine size={18} /> Write a Blog
            </Link>
          </div>
        ) : (
          <>
            <div className="blogs-grid">
              {blogs.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="blog-card"
                >
                  {/* Image */}
                  <div className="blog-card-image-wrapper">
                    {blog.featured_image ? (
                      <img src={blog.featured_image} alt={blog.title} className="blog-card-image" />
                    ) : (
                      <div className="blog-card-placeholder"><FileText size={48} /></div>
                    )}
                    <span className="blog-card-category">{blog.category}</span>
                  </div>

                  {/* Body */}
                  <div className="blog-card-body">
                    <h3 className="blog-card-title">
                      <Link to={`/blogs/${blog.slug}`}>{blog.title}</Link>
                    </h3>
                    <p className="blog-card-excerpt">{blog.excerpt}</p>

                    <div className="blog-card-meta">
                      <div className="blog-card-author">
                        <span className="blog-card-author-avatar">
                          {blog.author_name?.charAt(0).toUpperCase()}
                        </span>
                        {blog.author_name}
                      </div>
                      <span className="blog-card-date">
                        <Calendar size={12} />
                        {formatDate(blog.published_at)}
                      </span>
                    </div>

                    <div className="blog-card-stats">
                      <span className="blog-stat"><Eye size={14} /> {blog.views_count}</span>
                      <span className="blog-stat"><Heart size={14} /> {blog.likes_count}</span>
                      <span className="blog-stat"><Bookmark size={14} /> {blog.saves_count}</span>
                      <span className="blog-stat"><MessageCircle size={14} /> 0</span>
                      <Link to={`/blogs/${blog.slug}`} className="blog-card-read-more">
                        Read More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="blogs-pagination">
                <button className="blogs-pagination-btn" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(Math.max(0, page - 3), page + 2).map((p) => (
                  <button key={p} className={`blogs-pagination-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                ))}
                <button className="blogs-pagination-btn" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Blogs;
