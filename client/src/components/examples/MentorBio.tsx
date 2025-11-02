import MentorBio from '../MentorBio';
import mentorImage from '@assets/generated_images/Female_mentor_headshot_90fd7958.png';

export default function MentorBioExample() {
  return (
    <div className="p-8 max-w-5xl">
      <MentorBio
        name="Sarah Johnson"
        title="Senior Career Coach & Tech Leader"
        bio="With over 15 years of experience in technology leadership and career development, Sarah has helped thousands of professionals navigate career transitions and achieve their goals. She specializes in helping mid-career professionals break into leadership roles."
        expertise={["Career Strategy", "Leadership Development", "Tech Industry", "Interview Coaching"]}
        photo={mentorImage}
        linkedin="https://linkedin.com"
      />
    </div>
  );
}
