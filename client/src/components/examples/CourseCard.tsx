import CourseCard from '../CourseCard';
import careerDevImage from '@assets/generated_images/Career_development_course_thumbnail_faf64b94.png';
import mentorImage from '@assets/generated_images/Female_mentor_headshot_90fd7958.png';

export default function CourseCardExample() {
  return (
    <div className="p-8 max-w-sm">
      <CourseCard
        id="1"
        title="Career Development Mastery"
        instructor="Sarah Johnson"
        instructorAvatar={mentorImage}
        category="Career Growth"
        price={199}
        rating={4.9}
        enrollments={1234}
        duration="8 weeks"
        thumbnail={careerDevImage}
        slug="career-development-mastery"
      />
    </div>
  );
}
