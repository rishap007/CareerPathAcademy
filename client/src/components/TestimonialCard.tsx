import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote } from "lucide-react";

export interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  testimonial: string;
  avatar: string;
}

export default function TestimonialCard({
  name,
  role,
  company,
  testimonial,
  avatar,
}: TestimonialCardProps) {
  return (
    <Card className="p-8 space-y-6 hover-elevate transition-all duration-300" data-testid={`card-testimonial-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <Quote className="h-10 w-10 text-primary/30" />
      <p className="text-base leading-relaxed text-foreground line-clamp-4" data-testid={`text-testimonial-content`}>
        {testimonial}
      </p>
      <div className="flex items-center gap-4 pt-4 border-t border-border">
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold text-foreground" data-testid={`text-testimonial-name`}>{name}</p>
          <p className="text-sm text-muted-foreground" data-testid={`text-testimonial-role`}>
            {role}, {company}
          </p>
        </div>
      </div>
    </Card>
  );
}
