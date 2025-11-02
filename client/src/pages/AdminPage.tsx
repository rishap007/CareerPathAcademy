import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, BookOpen, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Career Development Mastery",
      category: "Career Growth",
      price: 199,
      enrollments: 1234,
      revenue: 245466,
      published: true,
    },
    {
      id: 2,
      title: "Leadership Excellence Program",
      category: "Leadership",
      price: 249,
      enrollments: 987,
      revenue: 245763,
      published: true,
    },
    {
      id: 3,
      title: "Interview Preparation Bootcamp",
      category: "Interview Prep",
      price: 149,
      enrollments: 1567,
      revenue: 233483,
      published: true,
    },
  ]);

  const stats = [
    {
      label: "Total Revenue",
      value: "$724,712",
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive",
    },
    {
      label: "Total Students",
      value: "3,788",
      icon: Users,
      change: "+8.2%",
      changeType: "positive",
    },
    {
      label: "Active Courses",
      value: "24",
      icon: BookOpen,
      change: "+3",
      changeType: "positive",
    },
    {
      label: "Avg. Rating",
      value: "4.8",
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
                  data-testid="input-search-courses"
                />
              </div>
            </div>

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
                          ${course.price}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-foreground" data-testid={`text-enrollments-${course.id}`}>
                          {course.enrollments}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-foreground" data-testid={`text-revenue-${course.id}`}>
                          ${course.revenue.toLocaleString()}
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
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
