import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Upload, Eye, EyeOff, X, LogIn } from "lucide-react";
import api from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import "./styles/BlogCreate.css";

const CATEGORIES = ["General", "Technology", "Design", "Business", "Tutorial", "News", "Opinion", "Case Study"];

const BlogCreate = () => {
  const navigate = useNavigate();
  const [showPreview, setShowPreview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "", content: "", excerpt: "", category: "General",
    featured_image: "", video_url: "", tags: [] as string[],
    author_name: "", author_email: "",
  });
  const [tagInput, setTagInput] = useState("");

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const tag = tagInput.trim().replace(",", "");
      if (tag && !form.tags.includes(tag)) {
        setForm({ ...form, tags: [...form.tags, tag] });
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t) => t !== tag) });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/upload", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.url) {
        setForm({ ...form, featured_image: res.data.url });
        setImagePreview(res.data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (publish: boolean) => {
    if (!form.title.trim() || !form.content.trim() || !form.author_name.trim()) {
      alert("Title, content, and author name are required.");
      return;
    }
    setSubmitting(true);
    try {
      const blogData = {
        ...form,
        is_published: publish,
        slug: generateSlug(form.title),
      };
      await api.post("/blogs", blogData);
      alert("Blog submitted for approval!");
      navigate("/blogs");
    } catch (err) {
      console.error("Blog submission failed", err);
      alert("Failed to submit blog. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderPreview = (content: string) => {
    return content
      .replace(/### (.+)/g, "<h3>$1</h3>")
      .replace(/## (.+)/g, "<h2>$1</h2>")
      .replace(/# (.+)/g, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <div className="blog-create-page">
      <div className="blog-create-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="blog-create-header">
          <h1>Write a Blog</h1>
          <p>Share your knowledge and ideas with the community. Anyone can write!</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="blog-create-form">
          {/* Author Info */}
          <div className="blog-form-row">
            <div className="blog-form-group">
              <label className="required">Your Name</label>
              <input name="author_name" value={form.author_name} onChange={handleChange} placeholder="John Doe" className="blog-form-input" required />
            </div>
            <div className="blog-form-group">
              <label>Your Email (optional)</label>
              <input name="author_email" value={form.author_email} onChange={handleChange} placeholder="john@example.com" className="blog-form-input" />
            </div>
          </div>

          {/* Title */}
          <div className="blog-form-group">
            <label className="required">Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Enter your blog title" className="blog-form-input" required />
            {form.title && (
              <p className="blog-slug-preview">Slug: <span>/blogs/{generateSlug(form.title)}</span></p>
            )}
          </div>

          {/* Category & Video */}
          <div className="blog-form-row">
            <div className="blog-form-group">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="blog-form-select">
                {CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
              </select>
            </div>
            <div className="blog-form-group">
              <label>Video URL (optional)</label>
              <input name="video_url" value={form.video_url} onChange={handleChange} placeholder="https://youtube.com/embed/..." className="blog-form-input" />
            </div>
          </div>

          {/* Featured Image */}
          <div className="blog-form-group">
            <label>Featured Image</label>
            <div className="blog-image-upload">
              <div className="blog-upload-box">
                <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                <div className="blog-upload-box-label">
                  <Upload size={24} />
                  <span>{uploading ? "Uploading..." : "Click to upload"}</span>
                </div>
              </div>
              {imagePreview && <img src={imagePreview} alt="Preview" className="blog-image-preview" />}
            </div>
          </div>

          {/* Excerpt */}
          <div className="blog-form-group">
            <label>Excerpt (optional)</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} placeholder="Brief summary of your blog (auto-generated if left empty)" className="blog-form-textarea" rows={3} />
          </div>

          {/* Content */}
          <div className="blog-form-group">
            <label className="required">Content</label>
            <div className="blog-content-toolbar">
              <button type="button" className={`blog-toolbar-btn ${!showPreview ? "active" : ""}`} onClick={() => setShowPreview(false)}>
                <EyeOff size={14} /> Write
              </button>
              <button type="button" className={`blog-toolbar-btn ${showPreview ? "active" : ""}`} onClick={() => setShowPreview(true)}>
                <Eye size={14} /> Preview
              </button>
            </div>
            {showPreview ? (
              <div className="blog-content-preview" dangerouslySetInnerHTML={{ __html: renderPreview(form.content) || "<p style='color:#666'>Nothing to preview yet...</p>" }} />
            ) : (
              <textarea name="content" value={form.content} onChange={handleChange} placeholder="Write your blog content here...&#10;&#10;Supports markdown: # Heading, **bold**, *italic*, `code`" className="blog-form-textarea content-area" />
            )}
            <p className="blog-form-help">Supports basic markdown: # Heading, ## Subheading, **bold**, *italic*, `code`</p>
          </div>

          {/* Tags */}
          <div className="blog-form-group">
            <label>Tags</label>
            <div className="blog-tags-input-wrapper">
              {form.tags.map((tag) => (
                <span key={tag} className="blog-tag-chip">
                  #{tag} <button type="button" className="blog-tag-remove" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleAddTag} placeholder="Type a tag and press Enter" className="blog-tags-text-input" />
            </div>
          </div>

          {/* Actions */}
          <div className="blog-form-actions">
            <button type="button" className="blog-btn-draft" onClick={() => handleSubmit(false)} disabled={submitting}>
              Save as Draft
            </button>
            <button type="button" className="blog-btn-publish" onClick={() => handleSubmit(true)} disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BlogCreate;
