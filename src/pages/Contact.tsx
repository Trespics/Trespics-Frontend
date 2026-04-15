import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import "./styles/Contact.css";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({
        title: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.post('/contact', form);
      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error("Failed to send message", err);
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppClick = () => {
    const phoneNumber = "254770428297";
    const message = encodeURIComponent("Hello! I'm interested in your services.");
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero-section">
        <div className="contact-hero-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="contact-hero-content"
          >
            <p className="contact-hero-subtitle">Contact Us</p>
            <h1 className="contact-hero-title">Let's Talk</h1>
            <p className="contact-hero-description">
              Have a project in mind? We'd love to hear from you. Drop us a
              message and we'll respond within 24 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-container">
          <div className="contact-grid">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="contact-form-wrapper"
            >
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="contact-form-group">
                    <label className="contact-form-label">
                      Name <span className="contact-required">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      placeholder="John Doe"
                      maxLength={100}
                      className="contact-form-input"
                    />
                  </div>
                  <div className="contact-form-group">
                    <label className="contact-form-label">
                      Email <span className="contact-required">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="john@example.com"
                      maxLength={255}
                      className="contact-form-input"
                    />
                  </div>
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    placeholder="Project Inquiry"
                    maxLength={200}
                    className="contact-form-input"
                  />
                </div>

                <div className="contact-form-group">
                  <label className="contact-form-label">
                    Message <span className="contact-required">*</span>
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Tell us about your project..."
                    rows={6}
                    maxLength={2000}
                    className="contact-form-textarea"
                  />
                </div>

                <button type="submit" className="contact-submit-button">
                  <Send size={18} /> Send Message
                </button>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="contact-info-wrapper"
            >
              <div className="contact-info-card">
                <h3 className="contact-info-title">Contact Information</h3>

                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <Mail size={20} />
                    </div>
                    <div className="contact-info-content">
                      <p className="contact-info-label">Email</p>
                      <p className="contact-info-value">florantej@gmail.com</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <Phone size={20} />
                    </div>
                    <div className="contact-info-content">
                      <p className="contact-info-label">Phone</p>
                      <p className="contact-info-value">+254 770 428 297</p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <MapPin size={20} />
                    </div>
                    <div className="contact-info-content">
                      <p className="contact-info-label">Address</p>
                      <p className="contact-info-value">10304 Kirinyaga</p>
                    </div>
                  </div>

                  {/* WhatsApp Contact */}
                  <div className="contact-info-item contact-whatsapp-item">
                    <div className="contact-info-icon contact-whatsapp-icon">
                      <MessageCircle size={20} />
                    </div>
                    <div className="contact-info-content">
                      <p className="contact-info-label">WhatsApp</p>
                      <button
                        onClick={handleWhatsAppClick}
                        className="contact-whatsapp-button"
                      >
                        Chat on WhatsApp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Contact Buttons */}
                <div className="contact-quick-actions">
                  <a
                    href="mailto:Florantej@gmail.com"
                    className="contact-quick-action"
                  >
                    <Mail size={16} />
                    Email Us
                  </a>
                  <button
                    onClick={handleWhatsAppClick}
                    className="contact-quick-action contact-quick-action-whatsapp"
                  >
                    <MessageCircle size={16} />
                    WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="contact-whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
};

export default Contact;
