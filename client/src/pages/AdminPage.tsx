import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, BookOpen, TrendingUp, Plus, Edit, Trash2, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: allCourses = [], isLoading } = useQuery({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const response = await fetch("/api/courses", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch courses");
      return response.json();
    },
  });

  // Filter courses based on search query
  const courses = allCourses.filter((course: any) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats from courses data
  const totalRevenue = courses.reduce((sum: number, course: any) => {
    return sum + ((course.enrollmentCount || 0) * (course.priceInCents || 0));
  }, 0) / 100;

  const totalStudents = courses.reduce((sum: number, course: any) => {
    return sum + (course.enrollmentCount || 0);
  }, 0);

  const avgRating = courses.length > 0
    ? (courses.reduce((sum: number, course: any) => sum + (course.rating || 0), 0) / courses.length).toFixed(1)
    : "0.0";

  const stats = [
    {
      label: "Total Revenue",
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive",
    },
    {
      label: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: Users,
      change: "+8.2%",
      changeType: "positive",
    },
    {
      label: "Active Courses",
      value: courses.filter((c: any) => c.published).length.toString(),
      icon: BookOpen,
      change: `+${courses.filter((c: any) => c.published).length}`,
      changeType: "positive",
    },
    {
      label: "Avg. Rating",
      value: avgRating,
      icon: TrendingUp,
      change: "+0.2",
      changeType: "positive",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-4" data-testid="text-page-title">
                Admin Dashboard
              </h1>
              <p className="text-lg text-muted-foreground">
                Manage your courses and track performance metrics.
              </p>
            </div>
            <Button size="lg" data-testid="button-create-course">
              <Plus className="h-5 w-5 mr-2" />
              Create Course
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6" data-testid={`stat-card-${index}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <Badge variant={stat.changeType === "positive" ? "default" : "secondary"}>
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground" data-testid={`stat-value-${index}`}>
                  {stat.value}
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold text-foreground" data-testid="text-courses-title">
                Course Management
              </h2>
              <div className="flex gap-3">
                <Input
                  placeholder="Search courses..."
                  className="w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search-courses"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p>No courses found</p>
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                      Course
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                      Category
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                      Price
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                      Enrollments
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                      Revenue
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-foreground uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b border-border hover:bg-muted/30" data-testid={`course-row-${course.id}`}>
                      <td className="py-4 px-4">
                        <p className="font-medium text-foreground" data-testid={`text-course-title-${course.id}`}>
                          {course.title}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="secondary" data-testid={`badge-category-${course.id}`}>
                          {course.category}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground" data-testid={`text-price-${course.id}`}>
                          ${course.priceInCents === 0 ? 'Free' : (course.priceInCents / 100).toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground" data-testid={`text-enrollments-${course.id}`}>
                          {course.enrollmentCount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground" data-testid={`text-revenue-${course.id}`}>
                          ${(((course.enrollmentCount || 0) * (course.priceInCents || 0)) / 100).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={course.published ? "default" : "secondary"} data-testid={`badge-status-${course.id}`}>
                          {course.published ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" data-testid={`button-edit-${course.id}`}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" data-testid={`button-delete-${course.id}`}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            )}
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
