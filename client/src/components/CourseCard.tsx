import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Users, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  instructorAvatar,
  category,
  price,
  rating,
  enrollments,
  duration,
  thumbnail,
  slug,
}: CourseCardProps) {
  return (
    <Card className="group overflow-hidden hover-elevate transition-all duration-300 border border-card-border" data-testid={`card-course-${slug}`}>
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          data-testid={`img-course-${slug}`}
        />
        <Badge className="absolute top-4 left-4" data-testid={`badge-category-${slug}`}>
          {category}
        </Badge>
      </div>
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 -mt-10 relative">
          <Avatar className="h-12 w-12 border-4 border-card">
            <AvatarImage src={instructorAvatar} alt={instructor} />
            <AvatarFallback>{instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground line-clamp-2 min-h-[3.5rem]" data-testid={`text-course-title-${slug}`}>
            {title}
          </h3>
          <p className="text-sm font-medium text-muted-foreground" data-testid={`text-instructor-${slug}`}>
            {instructor}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span data-testid={`text-rating-${slug}`}>{rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span data-testid={`text-enrollments-${slug}`}>{enrollments}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span data-testid={`text-duration-${slug}`}>{duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-2xl font-bold text-foreground" data-testid={`text-price-${slug}`}>
              ${price}
            </span>
          </div>
          <Button data-testid={`button-enroll-${slug}`}>
            Enroll Now
          </Button>
        </div>
      </div>
    </Card>
  );
}
