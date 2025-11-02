import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Linkedin, Twitter, Facebook, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-heading font-bold text-foreground" data-testid="text-footer-logo">
              CareerPath Academy
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Empowering professionals worldwide with expert mentorship and career guidance.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="ghost" size="icon" data-testid="button-social-linkedin">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-twitter">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" data-testid="button-social-facebook">
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Courses
            </h4>
            <ul className="space-y-3">
              {['Career Development', 'Leadership', 'Interview Prep', 'Business Strategy'].map((item) => (
                <li key={item}>
                  <Link href="/courses">
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-footer-${item.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Company
            </h4>
            <ul className="space-y-3">
              {['About Us', 'Our Mentors', 'Success Stories', 'Contact'].map((item) => (
                <li key={item}>
                  <Link href="/">
                    <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-footer-${item.toLowerCase().replace(/\s+/g, '-')}`}>
                      {item}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
              Newsletter
            </h4>
            <p className="text-sm text-muted-foreground">
              Get career tips and course updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <Input placeholder="Your email" type="email" data-testid="input-newsletter-email" />
              <Button size="icon" data-testid="button-newsletter-submit">
                <Mail className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              © 2024 CareerPath Academy. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/">
                <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-privacy">
                  Privacy Policy
                </a>
              </Link>
              <Link href="/">
                <a className="text-sm text-muted-foreground hover:text-foreground transition-colors" data-testid="link-terms">
                  Terms of Service
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
