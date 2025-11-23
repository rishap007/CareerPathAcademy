import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle, Users, Award, BookOpen, Video } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_mentorship_scene_0cea2b16.png";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import AuthModal from "./AuthModal";

export default function Hero() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const stats = [
    { icon: Users, value: "15M+", label: "Happy Students" },
    { icon: Video, value: "14K+", label: "Video Lectures" },
    { icon: BookOpen, value: "80K+", label: "Practice Papers" },
    { icon: Award, value: "100+", label: "Expert Mentors" },
  ];

  const handleGetStarted = () => {
    if (user) {
      setLocation("/courses");
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 overflow-hidden bg-gradient-to-b from-purple-50/50 to-white dark:from-purple-950/10 dark:to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                India's Trusted Educational Platform
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight text-foreground" data-testid="text-hero-title">
              Transform Your Career with{" "}
              <span className="text-primary">Expert Mentorship</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed" data-testid="text-hero-subtitle">
              Access premium courses, live lectures, and personalized guidance from industry leaders. Join millions of learners advancing their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/courses">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-base font-semibold" data-testid="button-explore-courses">
                  Explore Courses
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-base font-semibold border-2"
                onClick={handleGetStarted}
                data-testid="button-watch-demo"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                {user ? "My Learning" : "Get Started"}
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src={heroImage}
                alt="Professional mentorship session"
                className="w-full object-cover"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-card rounded-xl p-6 text-center border border-border/50 hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
        onSuccess={() => setLocation("/courses")}
      />
    </section>
  );
}
