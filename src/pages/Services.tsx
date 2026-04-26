import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Service {
  id: string;
  title: string;
  description: string;
  icon?: string;
  category?: string;
  price?: string;
  image_url?: string;
}

const Services = () => {
  const { data: services, isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await api.get("/services");
      return response.data as Service[];
    },
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-background -z-10" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 -z-10" />
        
        <div className="section-padding container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6 inline-block">
              Our Expertise
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Solutions That Empower Your Business
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
              From web development to system solutions, we provide cutting-edge technology 
              to help you scale and succeed in the digital landscape.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-section-alt/30">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[300px] bg-muted animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {services?.map((service) => (
                <Link to={`/services/${service.id}`} key={service.id}>
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ y: -5 }}
                    className="group relative bg-card border border-border/50 overflow-hidden rounded-2xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 glass h-full flex flex-col"
                  >
                    <div className="aspect-video w-full overflow-hidden relative">
                      {service.image_url ? (
                        <img 
                          src={service.image_url} 
                          alt={service.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary">
                          <Briefcase size={48} />
                        </div>
                      )}
                      {service.category && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-background/80 backdrop-blur-md text-primary text-xs font-bold rounded-full border border-primary/20">
                            {service.category}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                        {service.title}
                      </h3>
                      
                      <p className="text-muted-foreground mb-8 line-clamp-3 flex-1">
                        {service.description}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-border/50">
                        {service.price ? (
                          <span className="font-bold text-foreground">
                            {service.price}
                          </span>
                        ) : (
                          <span className="text-sm font-medium text-muted-foreground">
                            Custom Quote
                          </span>
                        )}
                        
                        <div className="flex items-center text-primary text-sm font-bold group-hover:gap-2 transition-all">
                          View Details <ArrowRight className="ml-1 w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </motion.div>
          )}

          {services?.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-xl">No services found. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Services;
