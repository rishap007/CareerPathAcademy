import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, BookOpen, User, LogOut } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "./AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const { user, logout } = useAuth();

  // Define all possible navigation links with role requirements
  const allNavLinks = [
    { href: "/", label: "Home", requireAuth: false },
    { href: "/courses", label: "Courses", requireAuth: false },
    { href: "/dashboard", label: "My Learning", requireAuth: true },
    { href: "/instructor", label: "Instructor", requireAuth: true, roles: ["instructor", "admin"] },
    { href: "/admin", label: "Admin", requireAuth: true, roles: ["admin"] },
  ];

  // Filter navigation links based on user authentication and role
  const navLinks = allNavLinks.filter(link => {
    // If link doesn't require auth, always show it
    if (!link.requireAuth) return true;

    // If link requires auth but user is not logged in, hide it
    if (!user) return false;

    // If link has role requirements, check if user has the required role
    if (link.roles && !link.roles.includes(user.role)) return false;

    // Otherwise, show the link
    return true;
  });

  const handleSignIn = () => {
    setAuthModalTab("login");
    setAuthModalOpen(true);
  };

  const handleGetStarted = () => {
    setAuthModalTab("register");
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-background/95 backdrop-blur-sm border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-heading font-bold text-foreground" data-testid="logo-text">
              CareerCompass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                  data-testid={`link-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-primary capitalize">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <a className="flex items-center w-full">
                        <User className="mr-2 h-4 w-4" />
                        My Learning
                      </a>
                    </Link>
                  </DropdownMenuItem>
                  {(user.role === "instructor" || user.role === "admin") && (
                    <DropdownMenuItem asChild>
                      <Link href="/instructor">
                        <a className="flex items-center w-full">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Instructor Dashboard
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <a className="flex items-center w-full">
                          <BookOpen className="mr-2 h-4 w-4" />
                          Admin Panel
                        </a>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={handleSignIn} data-testid="button-sign-in">
                  Sign In
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleGetStarted} data-testid="button-get-started">
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              data-testid="button-theme-toggle-mobile"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-menu-toggle"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-background border-b border-border">
          <div className="px-4 py-3 space-y-1">
            {/* User Info for Mobile (if logged in) */}
            {user && (
              <div className="px-4 py-3 mb-2 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <p className="text-xs text-primary capitalize font-medium">{user.role}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                    location === link.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              </Link>
            ))}

            {/* Auth Actions */}
            <div className="flex gap-2 pt-3">
              {user ? (
                <Button variant="outline" size="sm" className="flex-1" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" size="sm" className="flex-1" onClick={handleSignIn} data-testid="button-sign-in-mobile">
                    Sign In
                  </Button>
                  <Button size="sm" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleGetStarted} data-testid="button-get-started-mobile">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </nav>
  );
}
