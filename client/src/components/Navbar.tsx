import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/courses", label: "Courses" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-heading font-bold text-foreground" data-testid="logo-text">
              CareerPath <span className="gradient-text">Academy</span>
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`text-base font-medium tracking-wide transition-colors hover-elevate px-3 py-2 rounded-md ${
                    location === link.href
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover:scale-110 transition-transform duration-300"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" className="hover:scale-105 transition-transform duration-300" data-testid="button-sign-in">
              Sign In
            </Button>
            <Button className="gradient-primary shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105" data-testid="button-get-started">
              Get Started
            </Button>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              data-testid="button-theme-toggle-mobile"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-b border-border">
          <div className="px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`block text-base font-medium py-3 ${
                    location === link.href
                      ? "text-primary"
                      : "text-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" className="flex-1" data-testid="button-sign-in-mobile">
                Sign In
              </Button>
              <Button className="flex-1" data-testid="button-get-started-mobile">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
