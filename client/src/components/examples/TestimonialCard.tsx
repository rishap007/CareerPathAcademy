import TestimonialCard from '../TestimonialCard';
import mentorImage from '@assets/generated_images/Male_mentor_headshot_f02c4e64.png';

export default function TestimonialCardExample() {
  return (
    <div className="p-8 max-w-md">
      <TestimonialCard
        name="Michael Chen"
        role="Senior Engineer"
        company="Tech Corp"
        testimonial="This platform transformed my career trajectory. The mentorship I received was invaluable, and the courses were exactly what I needed to advance to the next level."
        avatar={mentorImage}
      />
    </div>
  );
}
