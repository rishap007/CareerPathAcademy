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
    <Card className="p-8 space-y-6 hover-elevate transition-all duration-500 hover:shadow-2xl hover:border-primary/30 animate-scale-in group" data-testid={`card-testimonial-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative">
        <Quote className="h-10 w-10 text-primary/30 group-hover:text-primary/50 transition-colors duration-300" />
        <div className="absolute -top-2 -left-2 w-16 h-16 bg-primary/5 rounded-full filter blur-xl group-hover:bg-primary/10 transition-colors duration-300"></div>
      </div>
      <p className="text-base leading-relaxed text-foreground line-clamp-4" data-testid={`text-testimonial-content`}>
        {testimonial}
      </p>
      <div className="flex items-center gap-4 pt-4 border-t border-border/50">
        <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-primary/50 transition-all duration-300">
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
