import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import productApp1 from "@/assets/product-app-1.jpg";
import productApp2 from "@/assets/product-app-2.jpg";
import productWeb1 from "@/assets/product-web-1.jpg";
import productWeb2 from "@/assets/product-web-2.jpg";
import productSystem1 from "@/assets/product-system-1.jpg";
import productSystem2 from "@/assets/product-system-2.jpg";

const products = [
  {
    title: "ShopEase Mobile App",
    description: "A feature-rich e-commerce mobile app with cart, payments, and real-time order tracking.",
    price: "$2,499",
    image: productApp1,
    category: "Mobile App",
  },
  {
    title: "Corporate Pro Website",
    description: "Professional business website with CMS, SEO optimization, and responsive design.",
    price: "$1,299",
    image: productWeb1,
    category: "Website",
  },
  {
    title: "Analytics Dashboard",
    description: "Enterprise analytics system with real-time data visualization and custom reporting.",
    price: "$3,999",
    image: productSystem1,
    category: "System",
  },
  {
    title: "FoodHub Delivery App",
    description: "Restaurant delivery app with menu management, GPS tracking, and payment integration.",
    price: "$2,899",
    image: productApp2,
    category: "Mobile App",
  },
  {
    title: "RealEstate Pro Website",
    description: "Property listing platform with advanced search, virtual tours, and agent dashboard.",
    price: "$1,799",
    image: productWeb2,
    category: "Website",
  },
  {
    title: "Inventory Manager",
    description: "Complete inventory management system with barcode scanning and automated restocking.",
    price: "$2,199",
    image: productSystem2,
    category: "System",
  },
];

const Products = () => (
  <div className="pt-16">
    <section className="section-padding bg-section-alt">
      <div className="container mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">Our Products</p>
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">
            Ready-Made <span className="gradient-text">Digital Products</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Browse our collection of professionally built apps, websites, and systems — ready to deploy or customize for your business.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.title} {...p} index={i} />
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default Products;
