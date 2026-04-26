import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  CheckCircle2, 
  Code2, 
  Languages, 
  Info,
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

interface Service {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  category?: string;
  price?: string;
  image_url?: string;
  languages?: string[];
  extra_images?: string[];
}

const ServiceDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: service, isLoading } = useQuery({
    queryKey: ["service", id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/services`);
      const allServices = response.data as Service[];
      return allServices.find(s => String(s.id) === String(id)) || null;
    },
    enabled: !!id,
  });

  const images = service?.extra_images && service.extra_images.length > 0 
    ? [service.image_url, ...service.extra_images].filter(Boolean) as string[]
    : [service?.image_url].filter(Boolean) as string[];

  // Auto-scroll logic for images
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold mb-4">Service Not Found</h2>
        <p className="text-muted-foreground mb-8 text-lg">The service you're looking for doesn't exist or has been removed.</p>
        <Link to="/services">
          <Button>
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Services
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={images[currentImageIndex]} 
            alt={service.title} 
            className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 pb-12 relative z-10">
          <Link to="/services" className="inline-flex items-center text-primary font-bold mb-6 hover:translate-x-[-4px] transition-transform">
            <ArrowLeft className="mr-2 w-5 h-5" /> Back to Services
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-3 py-1 bg-primary text-white text-xs font-bold rounded-full mb-4 inline-block uppercase tracking-widest">
              {service.category || "Service"}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
              {service.title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2">
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Info className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold">About the Service</h2>
                </div>
                <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  {service.full_description ? (
                    service.full_description.split('\n').map((para, i) => (
                      <p key={i} className="mb-4">{para}</p>
                    ))
                  ) : (
                    <p>No detailed description available yet.</p>
                  )}
                </div>
              </div>

              {/* Image Gallery - Left to Right Scroll */}
              {images.length > 1 && (
                <div className="mb-16">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" /> Visual Gallery
                  </h3>
                  <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-4 pb-4 snap-x hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {images.map((img, idx) => (
                      <div key={idx} className="min-w-[300px] md:min-w-[450px] aspect-video rounded-2xl overflow-hidden snap-center group">
                        <img 
                          src={img} 
                          alt={`${service.title} screenshot ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary w-6' : 'bg-primary/20'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar */}
            <div className="space-y-8">
              {/* Languages / Tools */}
              {service.languages && service.languages.length > 0 && (
                <div className="bg-card border border-border/50 rounded-2xl p-8 glass sticky top-24">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <Languages className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold">Tools & Technologies</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {service.languages.map((lang, idx) => (
                      <span 
                        key={idx} 
                        className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg border border-border"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-10 pt-10 border-t border-border/50 text-center">
                    <p className="text-2xl font-bold mb-2">{service.price || "Custom Pricing"}</p>
                    <p className="text-muted-foreground text-sm mb-6">Contact us for a detailed quote tailored to your needs.</p>
                    <Link to="/contact">
                      <Button className="w-full h-12 text-lg font-bold">
                        Inquire Now
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Other Services CTA */}
      <section className="py-20 bg-section-alt/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Explore More Solutions</h2>
          <Link to="/services">
            <Button variant="outline" size="lg">
              View All Services
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetail;
