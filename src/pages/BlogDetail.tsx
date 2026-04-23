import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Heart, Bookmark, MessageCircle, Share2, Copy, ChevronRight, ArrowLeft, Calendar } from "lucide-react";
import api from "@/lib/api";
import { supabase } from "@/lib/supabaseClient";
import "./styles/BlogDetail.css";

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  video_url: string | null;
  category: string;
  tags: string[];
  author_name: string;
  author_avatar: string | null;
  views_count: number;
  likes_count: number;
  saves_count: number;
  published_at: string;
}

interface Comment {
  id: string;
  user_name: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
  replies: Comment[];
}

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setCurrentUser(data.user);
    });
  }, []);

  useEffect(() => {
    if (!slug) return;
    const fetchBlog = async () => {
      setLoading(true);
      try {
        // Prevent duplicate view counts on refresh
        const viewedKey = `blog_viewed_${slug}`;
        const alreadyViewed = sessionStorage.getItem(viewedKey);

        const response = await api.get(`/blogs/${slug}`);
        setBlog(response.data);

        if (!alreadyViewed) {
          sessionStorage.setItem(viewedKey, "true");
        }

        // Fetch comments
        if (response.data?.id) {
          const commentsRes = await api.get(`/blogs/${response.data.id}/comments`);
          setComments(commentsRes.data || []);
        }

        // Fetch related blogs
        const relatedRes = await api.get("/blogs", {
          params: { category: response.data.category, limit: "4" },
        });
        setRelatedBlogs(
          (relatedRes.data.blogs || []).filter((b: Blog) => b.slug !== slug).slice(0, 3)
        );
      } catch (err: any) {
        if (err.response?.status === 404) setNotFound(true);
        console.error("Failed to fetch blog", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleLike = async () => {
    if (!blog || !currentUser) return;
    try {
      const res = await api.post(`/blogs/${blog.id}/like`, { user_id: currentUser.id });
      setLiked(res.data.liked);
      setBlog((prev) =>
        prev ? { ...prev, likes_count: prev.likes_count + (res.data.liked ? 1 : -1) } : prev
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  const handleSave = async () => {
    if (!blog || !currentUser) return;
    try {
      const res = await api.post(`/blogs/${blog.id}/save`, { user_id: currentUser.id });
      setSaved(res.data.saved);
      setBlog((prev) =>
        prev ? { ...prev, saves_count: prev.saves_count + (res.data.saved ? 1 : -1) } : prev
      );
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blog || !commentText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/blogs/${blog.id}/comment`, {
        user_id: currentUser?.id || null,
        user_name: currentUser?.email?.split("@")[0] || "Guest",
        content: commentText.trim(),
      });
      setCommentText("");
      const commentsRes = await api.get(`/blogs/${blog.id}/comments`);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!blog || !replyText.trim()) return;
    setSubmitting(true);
    try {
      await api.post(`/blogs/${blog.id}/reply`, {
        parent_comment_id: parentId,
        user_id: currentUser?.id || null,
        user_name: currentUser?.email?.split("@")[0] || "Guest",
        content: replyText.trim(),
      });
      setReplyText("");
      setReplyTo(null);
      const commentsRes = await api.get(`/blogs/${blog.id}/comments`);
      setComments(commentsRes.data || []);
    } catch (err) {
      console.error("Reply failed", err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(blog?.title || "")}`, "_blank");
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  // Simple markdown-to-HTML renderer
  const renderContent = (content: string) => {
    let html = content
      .replace(/### (.+)/g, "<h3>$1</h3>")
      .replace(/## (.+)/g, "<h2>$1</h2>")
      .replace(/# (.+)/g, "<h1>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br/>");
    return html;
  };

  if (loading) {
    return (
      <div className="blog-detail-page">
        <div className="blog-detail-loading">
          <div className="blog-detail-spinner" />
          <p>Loading blog...</p>
        </div>
      </div>
    );
  }

  if (notFound || !blog) {
    return (
      <div className="blog-detail-page">
        <div className="blog-not-found">
          <h2>Blog not found</h2>
          <p>The blog you're looking for doesn't exist or has been removed.</p>
          <Link to="/blogs">← Back to Blogs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="blog-detail-breadcrumb">
          <Link to="/">Home</Link> <ChevronRight size={14} />
          <Link to="/blogs">Blogs</Link> <ChevronRight size={14} />
          <span>{blog.title}</span>
        </motion.div>

        {/* Header */}
        <motion.header initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="blog-detail-header">
          <span className="blog-detail-category">{blog.category}</span>
          <h1 className="blog-detail-title">{blog.title}</h1>
          <div className="blog-detail-meta">
            <div className="blog-detail-author">
              <span className="blog-detail-author-avatar">
                {blog.author_name?.charAt(0).toUpperCase()}
              </span>
              <div className="blog-detail-author-info">
                <span className="blog-detail-author-name">{blog.author_name}</span>
                <span className="blog-detail-author-date">{formatDate(blog.published_at)}</span>
              </div>
            </div>
            <span className="blog-detail-stat"><Eye size={14} /> {blog.views_count} views</span>
            <span className="blog-detail-stat"><Heart size={14} /> {blog.likes_count} likes</span>
            <span className="blog-detail-stat"><Bookmark size={14} /> {blog.saves_count} saves</span>
          </div>
        </motion.header>

        {/* Featured Image */}
        {blog.featured_image && (
          <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }} src={blog.featured_image} alt={blog.title} className="blog-detail-image" />
        )}

        {/* Video */}
        {blog.video_url && (
          <iframe src={blog.video_url} title={blog.title} className="blog-detail-video" allowFullScreen />
        )}

        {/* Content */}
        <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="blog-detail-content"
          dangerouslySetInnerHTML={{ __html: renderContent(blog.content) }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="blog-detail-tags">
            {blog.tags.map((tag, i) => (
              <span key={i} className="blog-tag">#{tag}</span>
            ))}
          </div>
        )}

        {/* Actions Bar */}
        <div className="blog-detail-actions">
          <button className={`blog-action-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
            <Heart size={18} fill={liked ? "currentColor" : "none"} /> {blog.likes_count}
          </button>
          <button className={`blog-action-btn ${saved ? "saved" : ""}`} onClick={handleSave}>
            <Bookmark size={18} fill={saved ? "currentColor" : "none"} /> {blog.saves_count}
          </button>
          <button className="blog-action-btn">
            <MessageCircle size={18} /> {comments.length}
          </button>
          <div className="blog-share-btns">
            <button className="blog-share-btn" onClick={copyLink} title="Copy link"><Copy size={16} /></button>
            <button className="blog-share-btn" onClick={shareTwitter} title="Share on Twitter"><Share2 size={16} /></button>
          </div>
        </div>

        {/* Comments Section */}
        <section className="blog-comments-section">
          <h3 className="blog-comments-title">Comments ({comments.length})</h3>

          {/* Comment Form */}
          <form onSubmit={handleComment} className="blog-comment-form">
            <textarea
              placeholder={currentUser ? "Write a comment..." : "Sign in to comment"}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={!currentUser}
            />
            <div className="blog-comment-form-actions">
              <button type="submit" className="blog-comment-submit" disabled={submitting || !commentText.trim()}>
                {submitting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </form>

          {/* Comments List */}
          {comments.map((comment) => (
            <div key={comment.id} className="blog-comment">
              <div className="blog-comment-header">
                <span className="blog-comment-avatar">{comment.user_name?.charAt(0).toUpperCase()}</span>
                <span className="blog-comment-author">{comment.user_name}</span>
                <span className="blog-comment-date">{formatDate(comment.created_at)}</span>
              </div>
              <p className="blog-comment-content">{comment.content}</p>
              <button className="blog-comment-reply-btn" onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}>Reply</button>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="blog-comment-form" style={{ marginTop: "0.75rem" }}>
                  <textarea placeholder="Write a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} />
                  <div className="blog-comment-form-actions">
                    <button type="button" className="blog-comment-submit" onClick={() => handleReply(comment.id)} disabled={submitting || !replyText.trim()}>
                      {submitting ? "Posting..." : "Reply"}
                    </button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies?.length > 0 && (
                <div className="blog-comment-replies">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="blog-comment">
                      <div className="blog-comment-header">
                        <span className="blog-comment-avatar">{reply.user_name?.charAt(0).toUpperCase()}</span>
                        <span className="blog-comment-author">{reply.user_name}</span>
                        <span className="blog-comment-date">{formatDate(reply.created_at)}</span>
                      </div>
                      <p className="blog-comment-content">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Related Blogs */}
        {relatedBlogs.length > 0 && (
          <section className="blog-related-section">
            <h3 className="blog-related-title">Related Blogs</h3>
            <div className="blog-related-grid">
              {relatedBlogs.map((rb) => (
                <Link key={rb.id} to={`/blogs/${rb.slug}`} className="blog-related-card">
                  <h4 className="blog-related-card-title">{rb.title}</h4>
                  <span className="blog-related-card-meta">
                    <Calendar size={12} /> {formatDate(rb.published_at)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default BlogDetail;
