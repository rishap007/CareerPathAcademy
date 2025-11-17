import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock, BookOpen } from "lucide-react";
import { Link } from "wouter";

export interface CourseCardProps {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  category: string;
  price: number;
  rating: number;
  enrollments: number;
  duration: string;
  thumbnail: string;
  slug: string;
}

export default function CourseCard({
  title,
  instructor,
  category,
  price,
  rating,
  enrollments,
  duration,
  thumbnail,
  slug,
}: CourseCardProps) {
  return (
    <Link href={`/courses/${slug}`}>
      <Card
        className="group overflow-hidden transition-all duration-300 border border-border hover:border-primary/50 hover:shadow-lg cursor-pointer bg-white dark:bg-card"
        data-testid={`card-course-${slug}`}
      >
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-950/20 dark:to-purple-900/10">
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-course-${slug}`}
          />
          <Badge
            className="absolute top-3 left-3 bg-white/95 dark:bg-card/95 text-primary border-0 shadow-sm font-medium"
            data-testid={`badge-category-${slug}`}
          >
            <BookOpen className="h-3 w-3 mr-1" />
            {category}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground line-clamp-2 min-h-[3.5rem] group-hover:text-primary transition-colors" data-testid={`text-course-title-${slug}`}>
              {title}
            </h3>
            <p className="text-sm text-muted-foreground" data-testid={`text-instructor-${slug}`}>
              by {instructor}
            </p>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-medium" data-testid={`text-rating-${slug}`}>{rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span data-testid={`text-enrollments-${slug}`}>{enrollments.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span data-testid={`text-duration-${slug}`}>{duration}</span>
            </div>
          </div>

          {/* Price & CTA */}
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div>
              <span className="text-2xl font-bold text-primary" data-testid={`text-price-${slug}`}>
                ${price}
              </span>
            </div>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              data-testid={`button-enroll-${slug}`}
            >
              Enroll Now
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
}
