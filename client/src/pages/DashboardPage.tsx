import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, CheckCircle, Clock, TrendingUp } from "lucide-react";

import careerDevImage from '@assets/generated_images/Career_development_course_thumbnail_faf64b94.png';
import leadershipImage from '@assets/generated_images/Leadership_training_course_thumbnail_b254d9be.png';

export default function DashboardPage() {
  const [courses] = useState([
    {
      id: 1,
      title: "Career Development Mastery",
      thumbnail: careerDevImage,
      progress: 65,
      totalLessons: 24,
      completedLessons: 16,
      nextLesson: "Salary Negotiation Tactics",
      status: "in-progress",
    },
    {
      id: 2,
      title: "Leadership Excellence Program",
      thumbnail: leadershipImage,
      progress: 30,
      totalLessons: 32,
      completedLessons: 10,
      nextLesson: "Effective Team Communication",
      status: "in-progress",
    },
  ]);

  const stats = [
    { label: "Courses Enrolled", value: "2", icon: BookOpen },
    { label: "Lessons Completed", value: "26", icon: CheckCircle },
    { label: "Hours Learned", value: "42", icon: Clock },
    { label: "Progress This Week", value: "+12%", icon: TrendingUp },
  ];

  const recentLessons = [
    {
      course: "Career Development Mastery",
      lesson: "Building Your Professional Brand",
      completed: true,
      duration: "45 min",
    },
    {
      course: "Career Development Mastery",
      lesson: "LinkedIn Optimization Masterclass",
      completed: true,
      duration: "40 min",
    },
    {
      course: "Leadership Excellence Program",
      lesson: "Understanding Leadership Styles",
      completed: true,
      duration: "50 min",
    },
  ];

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
                <div className="space-y-6">
                  {courses.map((course) => (
                    <Card key={course.id} className="overflow-hidden" data-testid={`course-card-${course.id}`}>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        <div className="md:col-span-2">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-48 md:h-full object-cover"
                            data-testid={`img-course-${course.id}`}
                          />
                        </div>
                        <div className="md:col-span-3 p-6 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`text-course-title-${course.id}`}>
                                {course.title}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {course.completedLessons} of {course.totalLessons} lessons completed
                              </p>
                            </div>
                            <Badge variant="secondary" data-testid={`badge-status-${course.id}`}>
                              {course.status === "in-progress" ? "In Progress" : "Not Started"}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium text-foreground" data-testid={`text-progress-${course.id}`}>
                                {course.progress}%
                              </span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                          <div className="flex items-center justify-between pt-2">
                            <p className="text-sm text-muted-foreground">
                              Next: <span className="text-foreground font-medium">{course.nextLesson}</span>
                            </p>
                            <Button data-testid={`button-continue-${course.id}`}>
                              Continue Learning
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </div>

            <div className="lg:col-span-1 space-y-8">
              <section>
                <h2 className="text-xl font-heading font-semibold text-foreground mb-6" data-testid="text-recent-activity-title">
                  Recent Activity
                </h2>
                <Card className="p-6 space-y-4">
                  {recentLessons.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0" data-testid={`activity-${index}`}>
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {item.lesson}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.course}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.duration}
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
                    <p className="font-semibold text-foreground mb-1">First Course Started</p>
                    <p className="text-sm text-muted-foreground">You've begun your learning journey!</p>
                  </div>
                </Card>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
