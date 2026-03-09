import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
}

const SectionHeading = ({ label, title, description }: SectionHeadingProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12"
  >
    {label && (
      <p className="text-accent font-medium text-sm uppercase tracking-wider mb-2">{label}</p>
    )}
    <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">{title}</h2>
    {description && (
      <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
    )}
  </motion.div>
);

export default SectionHeading;
