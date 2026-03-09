import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0 bg-hero-overlay/80" />

    <div className="relative z-10 container mx-auto px-4 text-center">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-accent font-medium mb-4 tracking-wider uppercase text-sm"
      >
        Digital Solutions That Deliver
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight"
      >
        We Build Apps, Websites
        <br />
        <span className="gradient-text">& Smart Systems</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-8"
      >
        From concept to deployment, Trespics transforms your ideas into powerful digital products that scale your business.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link to="/contact">
          <Button size="lg" className="gradient-primary text-primary-foreground gap-2 text-base px-8">
            Get Started <ArrowRight size={18} />
          </Button>
        </Link>
        <Link to="/products">
          <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base px-8">
            View Products
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
