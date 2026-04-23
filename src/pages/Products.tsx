import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2, Search, Filter, Grid3x3, LayoutList } from "lucide-react";
import api from "@/lib/api";
import "./styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categories, setCategories] = useState<string[]>(["All"]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/projects');
      setProducts(response.data);
      
      // Extract unique categories
      const uniqueCategories = ["All", ...new Set(response.data.map((p: any) => p.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (err: any) {
      console.error("Failed to fetch products", err);
      setError(err.response?.data?.error?.message || "Failed to load products. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="products-page">
      {/* Compact Hero Section */}
      <section className="products-hero-section">
        <div className="products-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="products-hero-content"
          >
            <div className="products-hero-badge">Our Collection</div>
            <h1 className="products-hero-title">
              Ready-Made Digital Products
            </h1>
            <p className="products-hero-description">
              Browse our collection of professionally built apps, websites, and
              systems — ready to deploy or customize for your business.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Bar */}
      <section className="products-filter-section">
        <div className="products-filter-container">
          <div className="products-search-wrapper">
            <Search className="products-search-icon" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="products-search-input"
            />
          </div>

          <div className="products-filters">
            <div className="products-categories">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`products-category-btn ${
                    selectedCategory === category ? "active" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="products-view-toggle">
              <button
                onClick={() => setViewMode("grid")}
                className={`products-view-btn ${viewMode === "grid" ? "active" : ""}`}
                aria-label="Grid view"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`products-view-btn ${viewMode === "list" ? "active" : ""}`}
                aria-label="List view"
              >
                <LayoutList size={18} />
              </button>
            </div>
          </div>

          <div className="products-results-count">
            {!loading && !error && (
              <span>{filteredProducts.length} products found</span>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid Section */}
      <section className="products-grid-section">
        <div className="products-grid-container">
          {loading ? (
            <div className="products-loading-state">
              <Loader2 className="products-loading-spinner" size={40} />
              <p>Loading amazing products...</p>
            </div>
          ) : error ? (
            <div className="products-error-state">
              <p className="products-error-message">{error}</p>
              <button 
                onClick={fetchProducts}
                className="products-retry-btn"
              >
                Try Again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="products-empty-state">
              <p className="products-empty-title">No products found</p>
              <p className="products-empty-description">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="products-reset-btn"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`products-grid ${viewMode === "list" ? "list-view" : ""}`}>
              {filteredProducts.map((product, index) => (
                <ProductCard 
                  key={product.id || product.title} 
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  category={product.category}
                  link={product.link}
                  image={product.image_url} 
                  index={index}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Products;