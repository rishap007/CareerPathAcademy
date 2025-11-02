import { useState } from "react";
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
import { Star, Users, Clock, CheckCircle, PlayCircle, Award, Infinity } from "lucide-react";

import courseImage from '@assets/generated_images/Career_development_course_thumbnail_faf64b94.png';
import instructorImage from '@assets/generated_images/Female_mentor_headshot_90fd7958.png';

export default function CourseDetailPage() {
  const course = {
    title: "Career Development Mastery",
    instructor: "Sarah Johnson",
    instructorAvatar: instructorImage,
    category: "Career Growth",
    price: 199,
    rating: 4.9,
    enrollments: 1234,
    duration: "8 weeks",
    thumbnail: courseImage,
    description: "Transform your career with this comprehensive program designed to help you navigate career transitions, develop essential skills, and achieve your professional goals. Learn proven strategies used by successful professionals to accelerate career growth.",
    learningOutcomes: [
      "Develop a clear career roadmap aligned with your goals",
      "Master effective networking and personal branding strategies",
      "Build confidence for career transitions and negotiations",
      "Create a compelling professional narrative",
      "Leverage industry insights for strategic career moves",
    ],
  };

  const syllabus = [
    {
      title: "Week 1-2: Career Assessment & Goal Setting",
      lessons: [
        { title: "Understanding Your Career Values", duration: "45 min", type: "video" },
        { title: "SWOT Analysis for Career Planning", duration: "30 min", type: "video" },
        { title: "Setting SMART Career Goals", duration: "1 hr", type: "video" },
        { title: "Creating Your Career Vision Board", duration: "20 min", type: "exercise" },
      ],
    },
    {
      title: "Week 3-4: Personal Branding & Networking",
      lessons: [
        { title: "Building Your Professional Brand", duration: "50 min", type: "video" },
        { title: "LinkedIn Optimization Masterclass", duration: "40 min", type: "video" },
        { title: "Networking Strategies That Work", duration: "55 min", type: "video" },
        { title: "Crafting Your Elevator Pitch", duration: "25 min", type: "exercise" },
      ],
    },
    {
      title: "Week 5-6: Career Transitions & Negotiations",
      lessons: [
        { title: "Navigating Career Transitions", duration: "1 hr", type: "video" },
        { title: "Salary Negotiation Tactics", duration: "45 min", type: "video" },
        { title: "Interview Best Practices", duration: "50 min", type: "video" },
        { title: "Mock Interview Session", duration: "1 hr", type: "live" },
      ],
    },
    {
      title: "Week 7-8: Sustaining Career Growth",
      lessons: [
        { title: "Building a Learning Habit", duration: "35 min", type: "video" },
        { title: "Mentorship & Sponsorship", duration: "40 min", type: "video" },
        { title: "Measuring Career Progress", duration: "30 min", type: "video" },
        { title: "Final Project: Your Career Action Plan", duration: "2 hrs", type: "project" },
      ],
    },
  ];

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
                  <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                  <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <span className="text-foreground font-medium" data-testid="text-instructor">{course.instructor}</span>
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

              <section>
                <h2 className="text-2xl font-heading font-semibold text-foreground mb-6" data-testid="text-outcomes-title">
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start gap-3" data-testid={`outcome-${index}`}>
                      <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>

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
                    <AvatarImage src={course.instructorAvatar} alt={course.instructor} />
                    <AvatarFallback>{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground" data-testid="text-instructor-name">
                      {course.instructor}
                    </h3>
                    <p className="text-primary font-medium">Senior Career Coach & Tech Leader</p>
                    <p className="text-foreground leading-relaxed">
                      With over 15 years of experience in technology leadership and career development, Sarah has helped thousands of professionals navigate career transitions and achieve their goals.
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

                <Button className="w-full" size="lg" data-testid="button-enroll-now">
                  Enroll Now
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

      <Footer />
    </div>
  );
}
