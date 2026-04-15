import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";
import "./styles/Navbar.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="navbar-header">
      <nav className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <img src={logo} alt="Florante Logo" className="navbar-logo-image" />
          <span className="navbar-logo-text">Florante</span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-desktop-menu">           
          {navLinks.map((l) => (
            <li key={l.href} className="navbar-menu-item">
              <Link
                to={l.href}
                className={`navbar-menu-link ${
                  location.pathname === l.href ? "navbar-menu-link-active" : ""
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/contact" className="navbar-desktop-cta">
          <button className="navbar-cta-button">Get Started</button>
        </Link>

        {/* Mobile toggle button */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="navbar-mobile-menu">
          <ul className="navbar-mobile-menu-list">
            {navLinks.map((l) => (
              <li key={l.href} className="navbar-mobile-menu-item">
                <Link
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={`navbar-mobile-menu-link ${
                    location.pathname === l.href
                      ? "navbar-mobile-menu-link-active"
                      : ""
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="navbar-mobile-menu-item">
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="navbar-mobile-cta-link"
              >
                <button className="navbar-cta-button navbar-cta-button-full">
                  Get Started
                </button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
