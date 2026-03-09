import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
      <nav className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-heading text-2xl font-bold gradient-text">
          Trespics
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                to={l.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === l.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/contact" className="hidden md:block">
          <Button size="sm" className="gradient-primary text-primary-foreground">
            Get Started
          </Button>
        </Link>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-b animate-fade-in">
          <ul className="flex flex-col gap-4 p-4">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className={`block text-sm font-medium py-2 ${
                    location.pathname === l.href ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/contact" onClick={() => setOpen(false)}>
                <Button size="sm" className="gradient-primary text-primary-foreground w-full">
                  Get Started
                </Button>
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Navbar;
