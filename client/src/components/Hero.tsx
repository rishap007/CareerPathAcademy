import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_mentorship_scene_0cea2b16.png";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-7 space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-foreground leading-tight" data-testid="text-hero-title">
              Transform Your Career with Expert Mentorship
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl" data-testid="text-hero-subtitle">
              Access premium courses, live coaching sessions, and personalized guidance from industry leaders. Join thousands of professionals advancing their careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-10 py-6" data-testid="button-explore-courses">
                Explore Courses
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-6" data-testid="button-learn-more">
                Learn More
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>5,000+ Professionals</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Expert Instructors</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="relative">
              <img
                src={heroImage}
                alt="Professional mentorship session"
                className="rounded-2xl shadow-xl w-full"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
