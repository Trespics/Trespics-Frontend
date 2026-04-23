import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface ServiceCardProps {
  icon: LucideIcon | string;
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ icon, title, description, index }: ServiceCardProps) => {
  const isImage = typeof icon === 'string';
  const Icon = icon as any;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="group bg-white rounded-2xl p-8 border border-gray-100 hover:border-green-100 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-green-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
      
      <div className="w-16 h-16 rounded-xl bg-green-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 relative z-10 overflow-hidden">
        {isImage ? (
          <img src={icon} alt={title} className="w-full h-full object-cover" />
        ) : (
          <Icon size={28} className="text-green-600" />
        )}
      </div>
      
      <h3 className="font-heading text-xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed relative z-10">{description}</p>
      
      <div className="mt-6 flex items-center text-green-600 font-semibold text-sm group-hover:translate-x-2 transition-transform">
        Learn More 
        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </motion.div>
  );
};

export default ServiceCard;

