import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background">
    <div className="container mx-auto section-padding">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-1">
          <h3 className="font-heading text-2xl font-bold mb-4 gradient-text">Trespics</h3>
          <p className="text-sm opacity-70">
            Building digital solutions that drive growth. Apps, websites, and systems crafted with precision.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li><Link to="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
            <li><Link to="/about" className="hover:opacity-100 transition-opacity">About Us</Link></li>
            <li><Link to="/products" className="hover:opacity-100 transition-opacity">Products</Link></li>
            <li><Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm opacity-70">
            <li>App Development</li>
            <li>Website Development</li>
            <li>Systems Solutions</li>
            <li>Consulting</li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm opacity-70">
            <li className="flex items-center gap-2"><Mail size={14} /> info@trespics.com</li>
            <li className="flex items-center gap-2"><Phone size={14} /> +1 (555) 123-4567</li>
            <li className="flex items-center gap-2"><MapPin size={14} /> 123 Tech Street, CA</li>
          </ul>
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-background/10 text-center text-sm opacity-50">
        © {new Date().getFullYear()} Trespics Company. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
