import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon: Icon, title, description, index }: ServiceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.15, duration: 0.5 }}
    className="group bg-card rounded-lg p-8 border hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
  >
    <div className="w-14 h-14 rounded-lg gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-primary-foreground" />
    </div>
    <h3 className="font-heading text-xl font-semibold mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.div>
);

export default ServiceCard;
