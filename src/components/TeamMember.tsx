import { motion } from "framer-motion";

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  index: number;
}

const TeamMember = ({ name, role, image, index }: TeamMemberProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="text-center group"
  >
    <div className="w-40 h-40 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary/20 group-hover:border-primary/50 transition-colors">
      <img src={image} alt={name} className="w-full h-full object-cover" loading="lazy" />
    </div>
    <h3 className="font-heading font-semibold text-lg">{name}</h3>
    <p className="text-muted-foreground text-sm">{role}</p>
  </motion.div>
);

export default TeamMember;
