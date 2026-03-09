import { Smartphone, Globe, Server, Quote } from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ServiceCard from "@/components/ServiceCard";
import SectionHeading from "@/components/SectionHeading";
import { motion } from "framer-motion";

const services = [
  {
    icon: Smartphone,
    title: "App Development",
    description: "Native and cross-platform mobile applications built for performance, security, and seamless user experience across iOS and Android.",
  },
  {
    icon: Globe,
    title: "Website Development",
    description: "Responsive, fast, and visually stunning websites that convert visitors into customers — from landing pages to full-scale platforms.",
  },
  {
    icon: Server,
    title: "Systems Solutions",
    description: "Custom enterprise systems, CRMs, ERPs, and dashboards that streamline your operations and give you real-time insights.",
  },
];

const testimonials = [
  {
    quote: "Trespics delivered our e-commerce platform ahead of schedule. The quality exceeded all expectations.",
    author: "Sarah Mitchell",
    company: "RetailFlow Inc.",
  },
  {
    quote: "Their team transformed our outdated system into a modern, efficient solution. Highly recommended!",
    author: "James Rodriguez",
    company: "DataSync Corp.",
  },
  {
    quote: "Professional, responsive, and incredibly talented. Trespics is our go-to tech partner.",
    author: "Emily Chen",
    company: "GreenLeaf Studios",
  },
];

const Index = () => (
  <>
    <HeroSection />

    {/* Services Section */}
    <section className="section-padding bg-section-alt">
      <div className="container mx-auto">
        <SectionHeading
          label="What We Do"
          title="Our Services"
          description="We deliver end-to-end digital solutions tailored to your business needs."
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <ServiceCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>

    {/* Testimonials */}
    <section className="section-padding">
      <div className="container mx-auto">
        <SectionHeading
          label="Testimonials"
          title="What Our Clients Say"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-card border rounded-lg p-8 relative"
            >
              <Quote size={32} className="text-primary/20 mb-4" />
              <p className="text-muted-foreground text-sm mb-6 italic leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-heading font-semibold text-sm">{t.author}</p>
                <p className="text-muted-foreground text-xs">{t.company}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section-padding gradient-primary text-center">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Ready to Build Something Great?
          </h2>
          <p className="text-primary-foreground/70 mb-8 max-w-xl mx-auto">
            Let's turn your vision into reality. Get in touch and let's start your project today.
          </p>
          <a href="/contact">
            <button className="bg-background text-foreground font-medium px-8 py-3 rounded-lg hover:opacity-90 transition-opacity">
              Contact Us
            </button>
          </a>
        </motion.div>
      </div>
    </section>
  </>
);

export default Index;
