import { Badge } from "@/components/ui/badge";
import { Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MentorBioProps {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  photo: string;
  linkedin?: string;
}

export default function MentorBio({
  name,
  title,
  bio,
  expertise,
  photo,
  linkedin,
}: MentorBioProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12" data-testid={`mentor-bio-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="md:col-span-2">
        <img
          src={photo}
          alt={name}
          className="rounded-2xl w-full aspect-square object-cover shadow-lg"
          data-testid={`img-mentor-${name.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
      <div className="md:col-span-3 space-y-6">
        <div>
          <h3 className="text-3xl md:text-4xl font-heading font-semibold text-foreground" data-testid={`text-mentor-name`}>
            {name}
          </h3>
          <p className="text-lg text-primary font-medium mt-2" data-testid={`text-mentor-title`}>
            {title}
          </p>
        </div>
        <p className="text-base leading-relaxed text-foreground" data-testid={`text-mentor-bio`}>
          {bio}
        </p>
        <div className="space-y-3">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Areas of Expertise
          </p>
          <div className="flex flex-wrap gap-2">
            {expertise.map((skill, index) => (
              <Badge key={index} variant="secondary" data-testid={`badge-expertise-${index}`}>
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-4">
          {linkedin && (
            <Button variant="outline" size="icon" data-testid={`button-linkedin`}>
              <Linkedin className="h-5 w-5" />
            </Button>
          )}
          <Button variant="outline" size="icon" data-testid={`button-email`}>
            <Mail className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
