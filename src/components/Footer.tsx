import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import Logo from "@/assets/logo.png";
import "./styles/Footer.css";

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-grid">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo-container">
            <img src={Logo} alt="Trespics Logo" className="footer-logo" />
            <h3 className="footer-brand-title">Trespics</h3>
          </div>
          <p className="footer-brand-description">
            Building digital solutions that drive growth. Apps, websites, and
            systems crafted with precision.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links">
          <h4 className="footer-links-title">Quick Links</h4>
          <ul className="footer-links-list">
            <li>
              <Link to="/" className="footer-link">
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="footer-link">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/products" className="footer-link">
                Products
              </Link>
            </li>
            <li>
              <Link to="/contact" className="footer-link">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-links">
          <h4 className="footer-links-title">Services</h4>
          <ul className="footer-links-list">
            <li className="footer-service-item">App Development</li>
            <li className="footer-service-item">Website Development</li>
            <li className="footer-service-item">Systems Solutions</li>
            <li className="footer-service-item">Consulting</li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="footer-contact">
          <h4 className="footer-contact-title">Contact</h4>
          <ul className="footer-contact-list">
            <li className="footer-contact-item">
              <Mail size={14} className="footer-contact-icon" />
              <span>trespicsj@gmail.com</span>
            </li>
            <li className="footer-contact-item">
              <Phone size={14} className="footer-contact-icon" />
              <span>+254 770 428 297</span>
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
        © {new Date().getFullYear()} Trespics Company. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
