import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import "./styles/Hero.css";

const HeroSection = () => (
  <section className="hero-section">
    <div
      className="hero-background"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="hero-overlay" />
   
    <div className="hero-content">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="hero-subtitle"
      >
        Digital Solutions That Deliver
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="hero-title"
      >
        We Build Apps, Websites
        <br />
        <span className="hero-title-gradient">& Smart Systems</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="hero-description"
      >
        From concept to deployment, Trespics transforms your ideas into powerful
        digital products that scale your business.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="hero-buttons"
      >
        <Link to="/contact" className="hero-button-primary-wrapper">
          <button className="hero-button hero-button-primary">
            Get Started <ArrowRight size={18} />
          </button>
        </Link>
        <Link to="/products" className="hero-button-secondary-wrapper">
          <button className="hero-button hero-button-secondary">
            View Products
          </button>    
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
