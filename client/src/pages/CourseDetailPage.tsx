import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Star, Users, Clock, CheckCircle, PlayCircle, Award, Infinity, Radio, Loader2 } from "lucide-react";
import LiveLectureCard from "@/components/LiveLectureCard";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useLocation, useRoute } from "wouter";

import instructorImage from '@assets/generated_images/Female_mentor_headshot_90fd7958.png';

export default function CourseDetailPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/courses/:slug");
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      if (!params?.slug) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/courses/${params.slug}`);
        if (response.ok) {
          const data = await response.json();
          setCourse(data);
          setLessons(data.lessons || []);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load course details",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch course",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourse();
  }, [params?.slug]);

  // Check if user is enrolled
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user || !course) return;

      try {
        const response = await fetch("/api/enrollments/my", {
          credentials: "include",
        });
        if (response.ok) {
          const enrollments = await response.json();
          const enrolled = enrollments.some((e: any) => e.courseId === course.id);
          setIsEnrolled(enrolled);
        }
      } catch (error) {
        console.error("Failed to check enrollment:", error);
      }
    };

    checkEnrollment();
  }, [user, course]);

  // Handle payment redirect from Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');

    if (paymentStatus === 'success') {
      toast({
        title: "Payment Successful!",
        description: "Your enrollment is being processed. You will receive a confirmation email shortly.",
      });
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
      // Redirect to dashboard after a moment
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2000);
    } else if (paymentStatus === 'cancelled') {
      toast({
        variant: "destructive",
        title: "Payment Cancelled",
        description: "Your payment was cancelled. You can try again.",
      });
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleEnroll = async () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }

    setIsEnrolling(true);

    try {
      const response = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();

        // Check if response contains a checkout URL (paid course)
        if (data.checkoutUrl) {
          // Redirect to Stripe checkout
          window.location.href = data.checkoutUrl;
          return;
        }

        // Free course - enrollment successful
        setIsEnrolled(true);
        toast({
          title: "Success!",
          description: "You have successfully enrolled in this course!",
        });
        setTimeout(() => {
          setLocation("/dashboard");
        }, 1500);
      } else {
        const error = await response.json();
        if (error.message.includes("Already enrolled")) {
          setIsEnrolled(true);
          toast({
            title: "Already Enrolled",
            description: "You are already enrolled in this course.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Enrollment Failed",
            description: error.message || "Could not enroll in course",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  // Mock live lectures - can be replaced with API call later
  const liveLectures: any[] = [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <Button onClick={() => setLocation("/courses")}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  // Group lessons by sections (every 4 lessons)
  const syllabus = [];
  for (let i = 0; i < lessons.length; i += 4) {
    syllabus.push({
      title: `Module ${Math.floor(i / 4) + 1}`,
      lessons: lessons.slice(i, i + 4),
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="relative h-64 md:h-80 bg-gradient-to-r from-primary/20 to-primary/5 border-b border-border">
        <div className="absolute inset-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 lg:px-20 h-full flex items-end pb-8">
          <div>
            <Badge className="mb-3" data-testid="badge-category">{course.category}</Badge>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4" data-testid="text-course-title">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={instructorImage} />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium" data-testid="text-instructor">Instructor</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-foreground font-medium" data-testid="text-rating">{course.rating}</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-4 w-4" />
                <span data-testid="text-enrollments">{course.enrollments} students</span>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span data-testid="text-duration">{course.duration}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-4" data-testid="text-about-title">
                  About This Course
                </h2>
                <p className="text-base leading-relaxed text-foreground" data-testid="text-course-description">
                  {course.description}
                </p>
              </section>

              {lessons.length > 0 && (
                <section>
                  <h2 className="text-2xl font-heading font-semibold text-foreground mb-6" data-testid="text-outcomes-title">
                    What You'll Learn
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{lessons.length} comprehensive video lessons</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Practical exercises and projects</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Lifetime access to course materials</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">Certificate of completion</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Live Lectures Section */}
              {liveLectures.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-6">
                    <Radio className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-heading font-semibold text-foreground">
                      Upcoming Live Lectures
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {liveLectures.map((lecture) => (
                      <LiveLectureCard key={lecture.id} {...lecture} />
                    ))}
                  </div>
                </section>
              )}

              <section>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6" data-testid="text-syllabus-title">
                  Course Curriculum
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {syllabus.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`} className="border border-border rounded-lg px-6">
                      <AccordionTrigger className="hover:no-underline" data-testid={`accordion-section-${index}`}>
                        <div className="flex items-center justify-between w-full pr-4">
                          <span className="font-semibold text-foreground text-left">{section.title}</span>
                          <span className="text-sm text-muted-foreground">{section.lessons.length} lessons</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 pt-2">
                          {section.lessons.map((lesson, lessonIndex) => (
                            <div key={lessonIndex} className="flex items-center justify-between py-2" data-testid={`lesson-${index}-${lessonIndex}`}>
                              <div className="flex items-center gap-3">
                                <PlayCircle className="h-5 w-5 text-muted-foreground" />
                                <span className="text-foreground">{lesson.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              <section>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6" data-testid="text-instructor-bio-title">
                  About the Instructor
                </h2>
                <div className="flex items-start gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={instructorImage} />
                    <AvatarFallback>IN</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground" data-testid="text-instructor-name">
                      Expert Instructor
                    </h3>
                    <p className="text-primary font-medium">Professional Career Coach</p>
                    <p className="text-foreground leading-relaxed">
                      With years of experience in professional development and career coaching, our instructor has helped thousands of professionals navigate career transitions and achieve their goals.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 space-y-6 sticky top-24">
                <div>
                  <p className="text-3xl font-bold text-foreground mb-2" data-testid="text-price">
                    ${course.price}
                  </p>
                  <p className="text-sm text-muted-foreground">One-time payment</p>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                  onClick={handleEnroll}
                  disabled={isEnrolling || isEnrolled}
                  data-testid="button-enroll-now"
                >
                  {isEnrolling ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enrolling...
                    </>
                  ) : isEnrolled ? (
                    "Enrolled ✓"
                  ) : (
                    "Enroll Now"
                  )}
                </Button>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="font-semibold text-foreground">This course includes:</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <PlayCircle className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">30+ hours of video content</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Infinity className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Lifetime access</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Certificate of completion</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Users className="h-5 w-5 text-muted-foreground" />
                      <span className="text-foreground">Community access</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-center text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab="register"
        onSuccess={handleEnroll}
      />

      <Footer />
    </div>
  );
}
