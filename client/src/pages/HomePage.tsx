import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CourseCard from "@/components/CourseCard";
import TestimonialCard from "@/components/TestimonialCard";
import MentorBio from "@/components/MentorBio";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target, Users, Award, TrendingUp, BookOpen, Clock, Play } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

import careerDevImage from '@assets/generated_images/Career_development_course_thumbnail_faf64b94.png';
import leadershipImage from '@assets/generated_images/Leadership_training_course_thumbnail_b254d9be.png';
import interviewImage from '@assets/generated_images/Interview_preparation_course_thumbnail_a10f56fe.png';
import strategyImage from '@assets/generated_images/Business_strategy_course_thumbnail_86b9615a.png';
import femaleMentorImage from '@assets/generated_images/Female_mentor_headshot_90fd7958.png';
import maleMentorImage from '@assets/generated_images/Male_mentor_headshot_f02c4e64.png';

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();

  // Fetch user's enrollments with progress
  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery({
    queryKey: ["/api/enrollments/my"],
    enabled: !!user,
  });

  // Fetch personalized recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["/api/recommendations"],
    enabled: !!user,
  });

  // Fetch upcoming live lectures
  const { data: upcomingLectures } = useQuery({
    queryKey: ["/api/live-lectures/upcoming"],
    enabled: !!user,
  });
  const featuredCourses = [
    {
      id: "1",
      title: "Career Development Mastery",
      instructor: "Sarah Johnson",
      instructorAvatar: femaleMentorImage,
      category: "Career Growth",
      price: 199,
      rating: 4.9,
      enrollments: 1234,
      duration: "8 weeks",
      thumbnail: careerDevImage,
      slug: "career-development-mastery",
    },
    {
      id: "2",
      title: "Leadership Excellence Program",
      instructor: "Michael Chen",
      instructorAvatar: maleMentorImage,
      category: "Leadership",
      price: 249,
      rating: 4.8,
      enrollments: 987,
      duration: "10 weeks",
      thumbnail: leadershipImage,
      slug: "leadership-excellence",
    },
    {
      id: "3",
      title: "Interview Preparation Bootcamp",
      instructor: "Sarah Johnson",
      instructorAvatar: femaleMentorImage,
      category: "Interview Prep",
      price: 149,
      rating: 5.0,
      enrollments: 1567,
      duration: "4 weeks",
      thumbnail: interviewImage,
      slug: "interview-prep-bootcamp",
    },
  ];

  const testimonials = [
    {
      name: "Michael Chen",
      role: "Senior Engineer",
      company: "Tech Corp",
      testimonial: "This platform transformed my career trajectory. The mentorship I received was invaluable, and the courses were exactly what I needed to advance to the next level.",
      avatar: maleMentorImage,
    },
    {
      name: "Emily Rodriguez",
      role: "Product Manager",
      company: "StartupCo",
      testimonial: "The career guidance here is unmatched. I went from feeling stuck to landing my dream job in just 3 months. The instructors truly care about your success.",
      avatar: femaleMentorImage,
    },
    {
      name: "David Park",
      role: "Marketing Director",
      company: "Global Inc",
      testimonial: "Best investment in my professional development. The live coaching sessions and personalized feedback helped me negotiate a 40% salary increase.",
      avatar: maleMentorImage,
    },
  ];

  const features = [
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Custom learning paths tailored to your career goals and experience level.",
    },
    {
      icon: Users,
      title: "Expert Mentors",
      description: "Learn from industry leaders with decades of real-world experience.",
    },
    {
      icon: Award,
      title: "Certificates",
      description: "Earn recognized certificates to showcase your new skills and knowledge.",
    },
    {
      icon: TrendingUp,
      title: "Career Growth",
      description: "Track your progress and see measurable improvements in your career.",
    },
  ];

  // If user is logged in, show personalized dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Personalized Welcome Section */}
        <section className="pt-24 pb-16 bg-gradient-to-br from-primary/10 via-purple-50/50 to-accent/10 dark:from-primary/5 dark:via-purple-950/20 dark:to-accent/5">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
            <div className="animate-fade-in space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold leading-tight">
                Welcome back, <span className="gradient-text">{user.name}</span>!
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">
                Continue your learning journey and explore new courses tailored for you.
              </p>
            </div>
          </div>
        </section>

        {/* Continue Learning Section */}
        {enrollments && enrollments.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-2">
                    Continue Learning
                  </h2>
                  <p className="text-muted-foreground">Pick up where you left off</p>
                </div>
                <Link href="/dashboard">
                  <Button variant="outline">View All Courses</Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.slice(0, 3).map((enrollment: any) => (
                  <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <img
                          src={enrollment.course.thumbnail}
                          alt={enrollment.course.title}
                          className="w-full h-40 object-cover rounded-md mb-4"
                        />
                        <CardTitle className="text-lg line-clamp-2">
                          {enrollment.course.title}
                        </CardTitle>
                        <CardDescription>{enrollment.course.category}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-semibold">{enrollment.progress}%</span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                          <p className="text-xs text-muted-foreground">
                            {enrollment.completedLessons} of {enrollment.totalLessons} lessons completed
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Recommended Courses Section */}
        {recommendations && recommendations.length > 0 && (
          <section className="py-16 md:py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
              <div className="mb-8">
                <Badge className="mb-4 gradient-primary shadow-md">RECOMMENDED FOR YOU</Badge>
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-2">
                  Courses You Might Like
                </h2>
                <p className="text-muted-foreground">
                  Based on your interests and learning patterns
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recommendations.slice(0, 6).map((course: any) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>

              <div className="text-center mt-8">
                <Link href="/courses">
                  <Button size="lg" className="gradient-primary">
                    Explore All Courses
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Upcoming Live Lectures */}
        {upcomingLectures && upcomingLectures.length > 0 && (
          <section className="py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-2">
                  Upcoming Live Lectures
                </h2>
                <p className="text-muted-foreground">
                  Join live sessions with expert instructors
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingLectures.slice(0, 4).map((lecture: any) => (
                  <Card key={lecture.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{lecture.title}</CardTitle>
                          <CardDescription className="line-clamp-2">
                            {lecture.description}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="ml-2">
                          <Play className="h-3 w-3 mr-1" />
                          Live
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(lecture.scheduledAt).toLocaleDateString()} at{" "}
                            {new Date(lecture.scheduledAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Empty State for New Users */}
        {(!enrollments || enrollments.length === 0) && (
          <section className="py-16 md:py-20">
            <div className="max-w-4xl mx-auto px-6 text-center">
              <div className="mb-8">
                <BookOpen className="h-20 w-20 mx-auto text-primary/50 mb-4" />
                <h2 className="text-2xl md:text-3xl font-heading font-semibold mb-4">
                  Start Your Learning Journey
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  You haven't enrolled in any courses yet. Explore our catalog and find the perfect course for you!
                </p>
                <Link href="/courses">
                  <Button size="lg" className="gradient-primary">
                    Browse Courses
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        <Footer />
      </div>
    );
  }

  // For logged-out users, show the original home page
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      <section className="py-12 border-y border-border bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="text-center animate-fade-in">
              <p className="text-3xl md:text-4xl font-bold gradient-text" data-testid="text-stat-students">5,000+</p>
              <p className="text-sm text-muted-foreground mt-1">Active Students</p>
            </div>
            <div className="text-center animate-fade-in" style={{animationDelay: '0.1s'}}>
              <p className="text-3xl md:text-4xl font-bold gradient-text" data-testid="text-stat-courses">50+</p>
              <p className="text-sm text-muted-foreground mt-1">Expert Courses</p>
            </div>
            <div className="text-center animate-fade-in" style={{animationDelay: '0.2s'}}>
              <p className="text-3xl md:text-4xl font-bold gradient-text" data-testid="text-stat-mentors">15+</p>
              <p className="text-sm text-muted-foreground mt-1">Industry Mentors</p>
            </div>
            <div className="text-center animate-fade-in" style={{animationDelay: '0.3s'}}>
              <p className="text-3xl md:text-4xl font-bold gradient-text" data-testid="text-stat-satisfaction">98%</p>
              <p className="text-sm text-muted-foreground mt-1">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute top-20 right-0 w-72 h-72 bg-primary/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-72 h-72 bg-accent/10 rounded-full filter blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <Badge className="mb-4 gradient-primary shadow-md" data-testid="badge-featured">FEATURED COURSES</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4" data-testid="text-featured-title">
              Start Your <span className="gradient-text">Learning Journey</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our most popular courses designed by industry experts to accelerate your career growth.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4" data-testid="text-features-title">
              Why Choose <span className="gradient-text">CareerPath Academy</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide everything you need to succeed in your career journey.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center space-y-4 group animate-scale-in" style={{animationDelay: `${index * 0.1}s`}} data-testid={`feature-${index}`}>
                <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 relative z-10">
          <div className="text-center mb-12 animate-slide-up">
            <Badge className="mb-4 gradient-primary shadow-md" data-testid="badge-testimonials">SUCCESS STORIES</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold mb-4" data-testid="text-testimonials-title">
              What Our <span className="gradient-text">Students Say</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of professionals who have transformed their careers with our guidance.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center mb-16">
            <Badge className="mb-4" data-testid="badge-mentors">OUR MENTORS</Badge>
            <h2 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-4" data-testid="text-mentors-title">
              Learn from Industry Leaders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our expert mentors bring decades of real-world experience to help guide your career.
            </p>
          </div>
          <div className="space-y-16">
            <MentorBio
              name="Sarah Johnson"
              title="Senior Career Coach & Tech Leader"
              bio="With over 15 years of experience in technology leadership and career development, Sarah has helped thousands of professionals navigate career transitions and achieve their goals. She specializes in helping mid-career professionals break into leadership roles."
              expertise={["Career Strategy", "Leadership Development", "Tech Industry", "Interview Coaching"]}
              photo={femaleMentorImage}
              linkedin="https://linkedin.com"
            />
            <MentorBio
              name="Michael Chen"
              title="Executive Coach & Business Strategist"
              bio="Michael brings 20+ years of corporate leadership experience, having led teams at Fortune 500 companies. He's passionate about helping professionals develop their leadership skills and navigate complex organizational dynamics."
              expertise={["Executive Coaching", "Business Strategy", "Team Leadership", "Career Advancement"]}
              photo={maleMentorImage}
              linkedin="https://linkedin.com"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
