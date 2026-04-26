import { Quote, Loader2 } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import Phone from "@/assets/phone.png";
import Global from "@/assets/Global.jpg";
import Server from "@/assets/server.jpg";
import ELearning from "@/assets/E-learning.png";
import "./styles/Home.css";



const Index = () => {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get('/testimonials');
        setTestimonials(response.data);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data);
      } catch (err) {
        console.error("Failed to fetch services", err);
      } finally {
        setServicesLoading(false);
      }
    };

    fetchTestimonials();
    fetchServices();
  }, []);

  return (
    <>
      <HeroSection />

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <SectionHeading
            label="What We Do"
            title="Our Services"
            description="We deliver end-to-end digital solutions tailored to your business needs."
          />
          <div className="services-grid">
            {servicesLoading ? (
              <div className="loading-container">
                <Loader2 className="loading-spinner" />
              </div>
            ) : (
              services.slice(0, 4).map((s, i) => (
                <ServiceCard 
                  key={s.id} 
                  id={s.id}
                  icon={s.image_url || s.icon} 
                  title={s.title} 
                  description={s.description} 
                  index={i} 
                />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <SectionHeading
            label="Testimonials"
            title="What Our Clients Say"
          />
          {loading ? (
            <div className="loading-container">
              <Loader2 className="loading-spinner" />
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.id || i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="testimonial-card"
                >
                  <Quote className="testimonial-quote-icon" />
                  <p className="testimonial-quote">"{t.quote}"</p>
                  <div>
                    <p className="testimonial-author">{t.author}</p>
                    <p className="testimonial-company">{t.company}</p>
                  </div>
                </motion.div>
              ))}
            </div>     
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">
              Ready to Build Something Great?
            </h2>
            <p className="cta-description">
              Let's turn your vision into reality. Get in touch and let's start your project today.
            </p>
            <a href="/contact">
              <button className="cta-button">
                Contact Us
              </button>
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Index;