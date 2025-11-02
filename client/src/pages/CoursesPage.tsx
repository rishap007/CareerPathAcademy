import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseCard from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

import careerDevImage from '@assets/generated_images/Career_development_course_thumbnail_faf64b94.png';
import leadershipImage from '@assets/generated_images/Leadership_training_course_thumbnail_b254d9be.png';
import interviewImage from '@assets/generated_images/Interview_preparation_course_thumbnail_a10f56fe.png';
import strategyImage from '@assets/generated_images/Business_strategy_course_thumbnail_86b9615a.png';
import femaleMentorImage from '@assets/generated_images/Female_mentor_headshot_90fd7958.png';
import maleMentorImage from '@assets/generated_images/Male_mentor_headshot_f02c4e64.png';

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Career Growth", "Leadership", "Interview Prep", "Business Strategy"];

  const allCourses = [
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
    {
      id: "4",
      title: "Strategic Business Planning",
      instructor: "Michael Chen",
      instructorAvatar: maleMentorImage,
      category: "Business Strategy",
      price: 299,
      rating: 4.7,
      enrollments: 756,
      duration: "12 weeks",
      thumbnail: strategyImage,
      slug: "strategic-business-planning",
    },
    {
      id: "5",
      title: "Advanced Career Transitions",
      instructor: "Sarah Johnson",
      instructorAvatar: femaleMentorImage,
      category: "Career Growth",
      price: 179,
      rating: 4.9,
      enrollments: 1089,
      duration: "6 weeks",
      thumbnail: careerDevImage,
      slug: "advanced-career-transitions",
    },
    {
      id: "6",
      title: "Executive Leadership Mastery",
      instructor: "Michael Chen",
      instructorAvatar: maleMentorImage,
      category: "Leadership",
      price: 349,
      rating: 4.8,
      enrollments: 567,
      duration: "14 weeks",
      thumbnail: leadershipImage,
      slug: "executive-leadership-mastery",
    },
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16 bg-muted/30 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4" data-testid="text-page-title">
            Explore Our Courses
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Discover expert-led courses designed to accelerate your career growth and professional development.
          </p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                  Search Courses
                </h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    placeholder="Search courses..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search-courses"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                      data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground" data-testid="text-results-count">
                  Showing {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'}
                </p>
                <Button variant="outline" size="sm" data-testid="button-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground" data-testid="text-no-results">
                    No courses found matching your criteria.
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
