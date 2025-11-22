import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock, TrendingUp, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch("/api/enrollments/my", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setEnrollments(data);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load your courses",
          });
        }
      } catch (error) {
        console.error("Failed to fetch enrollments:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Something went wrong loading your courses",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, [user, toast]);

  // Calculate stats from enrollment data
  const totalCourses = enrollments.length;
  const totalLessonsCompleted = enrollments.reduce((sum, e) => sum + (e.progress || 0), 0);
  const avgProgress = totalCourses > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / totalCourses)
    : 0;

  const stats = [
    { label: "Courses Enrolled", value: totalCourses.toString(), icon: BookOpen },
    { label: "Avg Progress", value: `${avgProgress}%`, icon: CheckCircle },
    { label: "Hours Learned", value: "0", icon: Clock },
    { label: "This Week", value: "+0%", icon: TrendingUp },
  ];

  // Show loading state
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

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="text-muted-foreground mb-6">You need to be logged in to view your dashboard</p>
          <Button onClick={() => setLocation("/")}>Go to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4" data-testid="text-page-title">
              My Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your learning progress and continue your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6" data-testid={`stat-card-${index}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground" data-testid={`stat-value-${index}`}>
                      {stat.value}
                    </p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6" data-testid="text-my-courses-title">
                  My Courses
                </h2>
                {enrollments.length === 0 ? (
                  <Card className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                      <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">No courses yet</h3>
                    <p className="text-muted-foreground mb-6">Start your learning journey by enrolling in a course</p>
                    <Button onClick={() => setLocation("/courses")}>
                      Explore Courses
                    </Button>
                  </Card>
                ) : (
                  <div className="space-y-6">
                    {enrollments.map((enrollment) => (
                      <Card key={enrollment.id} className="overflow-hidden" data-testid={`course-card-${enrollment.courseId}`}>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                          <div className="md:col-span-2">
                            <img
                              src={enrollment.course?.thumbnail || "/placeholder-course.jpg"}
                              alt={enrollment.course?.title || "Course"}
                              className="w-full h-48 md:h-full object-cover"
                              data-testid={`img-course-${enrollment.courseId}`}
                            />
                          </div>
                          <div className="md:col-span-3 p-6 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-course-title-${enrollment.courseId}`}>
                                  {enrollment.course?.title || "Untitled Course"}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {enrollment.course?.category || "General"}
                                </p>
                              </div>
                              <Badge variant="secondary" data-testid={`badge-status-${enrollment.courseId}`}>
                                {enrollment.progress > 0 ? "In Progress" : "Not Started"}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="font-medium text-foreground" data-testid={`text-progress-${enrollment.courseId}`}>
                                  {enrollment.progress || 0}%
                                </span>
                              </div>
                              <Progress value={enrollment.progress || 0} className="h-2" />
                            </div>
                            <div className="flex items-center justify-between pt-2">
                              <p className="text-sm text-muted-foreground">
                                Enrolled {new Date(enrollment.purchasedAt).toLocaleDateString()}
                              </p>
                              <Button
                                onClick={() => setLocation(`/courses/${enrollment.course?.slug}`)}
                                data-testid={`button-continue-${enrollment.courseId}`}
                              >
                                Continue Learning
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <div className="lg:col-span-1 space-y-8">
              {enrollments.length > 0 && (
                <>
                  <section>
                    <h2 className="text-xl font-heading font-semibold text-foreground mb-6" data-testid="text-recent-activity-title">
                      Recent Enrollments
                    </h2>
                    <Card className="p-6 space-y-4">
                      {enrollments.slice(0, 3).map((enrollment, index) => (
                        <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0" data-testid={`activity-${index}`}>
                          <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground line-clamp-2">
                              {enrollment.course?.title || "Course"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Enrolled {new Date(enrollment.purchasedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </Card>
                  </section>

                  <section>
                    <h2 className="text-xl font-heading font-semibold text-foreground mb-6" data-testid="text-achievements-title">
                      Achievements
                    </h2>
                    <Card className="p-6 space-y-4">
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="h-8 w-8 text-primary" />
                        </div>
                        <p className="font-semibold text-foreground mb-1">
                          {enrollments.length === 1 ? "First Course Enrolled" : `${enrollments.length} Courses Enrolled`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {enrollments.length === 1
                            ? "You've started your learning journey!"
                            : "Keep up the great work!"}
                        </p>
                      </div>
                    </Card>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
