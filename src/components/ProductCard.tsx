import { motion } from "framer-motion";
import "./styles/ProductCard.css";

interface ProductCardProps {
  title: string;
  description: string;
  price?: string;
  image: string;
  category: string;
  index: number;
  link?: string; // Optional link to open
}

const ProductCard = ({
  title,
  description,
  price,
  image,
  category,
  index,
  link = "#",
}: ProductCardProps) => {
  const handleCardClick = () => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="product-card"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleCardClick();
        }
      }}
    >
      <div className="product-card-image-container">
        <img
          src={image}
          alt={title}
          className="product-card-image"
          loading="lazy"
        />
      </div>
      <div className="product-card-content">
        <span className="product-card-category">{category}</span>
        <h3 className="product-card-title">{title}</h3>
        <p className="product-card-description">{description}</p>
        <div className="product-card-footer">
          {price && <span className="product-card-price">{price}</span>}
          <button
            className={`product-card-button ${!price ? "product-card-button-full" : ""}`}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when button is clicked
              window.open(link, "_blank", "noopener,noreferrer");
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
