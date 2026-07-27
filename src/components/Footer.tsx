import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/assets/logo.png";
import "./styles/Footer.css";

const Footer = () => (
  <footer className="footer" itemScope itemType="https://schema.org/WPFooter">
    <div className="footer-container">
      <div className="footer-grid">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo-container">
            <img src={Logo} alt="Florante Tech Software & Systems Logo" className="footer-logo" />
            <h3 className="footer-brand-title">Florante (Florant)</h3>
          </div>
          <p className="footer-brand-description">
            Building innovative software, smart computer systems, tech hackathons, and technology blogs that power digital growth.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4 className="footer-links-title">Quick Links</h4>    
          <ul className="footer-links-list">
            <li>
              <Link to="/" className="footer-link" title="Florante Home - Tech & Software">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link" title="About Florante Technology & Systems">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className="footer-link" title="Software & Computer Systems Services">
                Services
              </Link>
            </li>
            <li>
              <Link to="/products" className="footer-link" title="Tech Products & Applications">
                Products
              </Link>
            </li>
            <li>
              <Link to="/projects" className="footer-link" title="Tech Projects & Hackathons">
                Hackathons & Projects
              </Link>
            </li>
            <li>
              <Link to="/blogs" className="footer-link" title="Tech & Computer Software Blogs">
                Technology Blogs
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link" title="Contact Florante Tech Support">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Focus Areas */}
        <div className="footer-links">
          <h4 className="footer-links-title">Tech Solutions</h4>
          <ul className="footer-links-list">
            <li className="footer-service-item">Software & App Development</li>
            <li className="footer-service-item">Enterprise Systems & Architectures</li>
            <li className="footer-service-item">Hackathons & Coding Challenges</li>
            <li className="footer-service-item">Computer Science & Tech Blogs</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-contact">
          <h4 className="footer-contact-title">Contact Us</h4>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <Mail size={14} className="footer-contact-icon" />
              <span>techrica2@gmail.com</span>
            </li>
            <li className="footer-contact-item">
              <Phone size={14} className="footer-contact-icon" />
              <span>+254 11 860 6119</span>
            </li>
            <li className="footer-contact-item">
              <MapPin size={14} className="footer-contact-icon" />
              <span>10304 Kirinyaga</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-copyright">
        © {new Date().getFullYear()} Florante (Florant) Tech & Software Systems. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
