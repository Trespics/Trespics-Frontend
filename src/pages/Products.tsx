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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/projects');
        setProducts(response.data);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
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
