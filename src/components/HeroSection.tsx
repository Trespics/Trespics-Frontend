import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, TrendingUp, ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";
import api from "@/lib/api";
import "./styles/Hero.css";

interface FeaturedBlog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  published_at: string;
  author?: string;
}

interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  image: string;
}

const HeroSection = () => {
  const [featuredBlogs, setFeaturedBlogs] = useState<FeaturedBlog[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Carousel data
  const carouselSlides: CarouselSlide[] = [
    {
      id: 1,
      title: "We Build And Maintain",
      subtitle: "Digital Solutions That Deliver",
      description: "From concept to deployment, Florante transforms your ideas into powerful digital products that scale your business.",
      ctaText: "Get Started",
      ctaLink: "/contact",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
    },
    // {
    //   id: 2,
    //   title: "Smart Systems",
    //   subtitle: "Intelligent Automation",
    //   description: "Leverage AI and machine learning to automate workflows, gain insights, and make data-driven decisions.",
    //   ctaText: "Learn More",
    //   ctaLink: "/services",
    //   image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop",
    // },
    {
      id: 3,
      title: "Mobile & Web Apps",
      subtitle: "Cross-Platform Excellence",
      description: "Native and cross-platform applications built with cutting-edge technology for seamless user experiences.",
      ctaText: "View Products",
      ctaLink: "/products",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop",
    },
    {
      id: 4,
      title: "Enterprise Solutions",
      subtitle: "Scale Your Business",
      description: "Custom enterprise systems, CRMs, and dashboards that streamline operations and drive growth.",
      ctaText: "Contact Us",
      ctaLink: "/contact",
      image: "https://images.unsplash.com/photo-1551434678-e076c2235a7b?w=800&h=600&fit=crop",
    },
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get("/blogs/featured");
        setFeaturedBlogs(res.data || []);
      } catch (err) {
        console.error("Failed to fetch featured blogs:", err);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      }, 10000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselSlides.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentSlide(index);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const truncateExcerpt = (text: string, wordCount: number = 15) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordCount ? words.slice(0, wordCount).join(" ") + "..." : text;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <section className="hero-split-section">
      {/* Left Section - Blogs (25% width) */}
      <aside className="hero-blogs-sidebar">
        <div className="blogs-header">
          <TrendingUp size={18} />
          <span>Featured Blogs</span>
        </div>

        <div className="blogs-list">
          {featuredBlogs.length > 0 ? (
            featuredBlogs.slice(0, 5).map((blog, i) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="blog-item"
              >
                <Link to={`/blogs/${blog.slug}`} className="blog-link">
                  {blog.featured_image && (
                    <div className="blog-image">
                      <img src={blog.featured_image} alt={blog.title} />
                    </div>
                  )}
                  <div className="blog-content">
                    <h4 className="blog-title">{blog.title}</h4>
                    <p className="blog-excerpt">{truncateExcerpt(blog.excerpt, 12)}</p>
                    <div className="blog-meta">
                      <span className="blog-date">
                        <Calendar size={12} />
                        {formatDate(blog.published_at)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <div className="blogs-empty">
              <p>No featured blogs yet</p>
              <Link to="/blogs" className="blogs-empty-link">
                View all blogs →
              </Link>
            </div>
          )}
        </div>

        {featuredBlogs.length > 0 && (
          <div className="blogs-footer">
            <Link to="/blogs" className="view-all-link">
              View All Blogs <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </aside>

      {/* Right Section - Hero Carousel (75% width) */}
      <div className="hero-carousel-section">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
            className="carousel-slide"
            style={{
              backgroundImage: `linear-gradient(135deg, rgba(26, 71, 42, 0.95), rgba(45, 106, 79, 0.85)), url(${carouselSlides[currentSlide].image})`,
            }}
          >
            <div className="carousel-content">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="carousel-subtitle"
              >
                {carouselSlides[currentSlide].subtitle}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="carousel-title"
              >
                {carouselSlides[currentSlide].title}
                {/* <span className="title-gradient">  */}
                  & Smart Systems
                  {/* </span> */}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="carousel-description"
              >
                {carouselSlides[currentSlide].description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="carousel-buttons"
              >
                <Link to={carouselSlides[currentSlide].ctaLink} className="btn-primary">
                  {carouselSlides[currentSlide].ctaText} <ArrowRight size={18} />
                </Link>
                <Link to="/products" className="btn-secondary">
                  View Products
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <div className="carousel-controls">
          <button onClick={prevSlide} className="control-btn" aria-label="Previous slide">
            <ChevronLeft size={20} />
          </button>
          
          <div className="carousel-dots">
            {carouselSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`dot ${currentSlide === index ? "active" : ""}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          <button onClick={nextSlide} className="control-btn" aria-label="Next slide">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slide Indicator */}
        <div className="slide-indicator">
          <span className="current-slide">{String(currentSlide + 1).padStart(2, "0")}</span>
          <span className="slide-separator">/</span>
          <span className="total-slides">{String(carouselSlides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;