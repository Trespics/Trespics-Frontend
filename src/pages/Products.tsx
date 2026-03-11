import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import "./styles/Products.css";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/projects');
      setProducts(response.data);
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

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero-section">
        <div className="products-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="products-hero-content"
          >
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

      {/* Products Grid Section */}
      <section className="products-grid-section">
        <div className="products-grid-container">
          {loading ? (
            <div className="flex justify-center p-20"><Loader2 className="animate-spin text-primary" size={40} /></div>
          ) : error ? (
            <div className="text-center p-20">
              <p className="text-red-500 mb-4">{error}</p>
              <button 
                onClick={fetchProducts}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary/90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product, index) => (
                <ProductCard 
                  key={product.id || product.title} 
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  category={product.category}
                  link={product.link}
                  image={product.image_url} 
                  index={index} 
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
