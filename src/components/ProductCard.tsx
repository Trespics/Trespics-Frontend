import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  title: string;
  description: string;
  price?: string;
  image: string;
  category: string;
  index: number;
}

const ProductCard = ({ title, description, price, image, category, index }: ProductCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group bg-card rounded-lg border overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
  >
    <div className="overflow-hidden aspect-video">
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    </div>
    <div className="p-6">
      <span className="text-xs font-medium text-accent uppercase tracking-wider">{category}</span>
      <h3 className="font-heading text-lg font-semibold mt-2 mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{description}</p>
      <div className="flex items-center justify-between">
        {price && <span className="font-heading font-bold text-primary text-lg">{price}</span>}
        <Link to="/contact" className={price ? "" : "w-full"}>
          <Button size="sm" className="gradient-primary text-primary-foreground" style={price ? {} : { width: "100%" }}>
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </motion.div>
);

export default ProductCard;
