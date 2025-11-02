import { db } from "./db";
import { users, courses, lessons, enrollments, progress } from "@shared/schema";
import { hash } from "@node-rs/argon2";

async function seed() {
  console.log("Clearing existing data...");

  await db.delete(progress);
  await db.delete(enrollments);
  await db.delete(lessons);
  await db.delete(courses);
  await db.delete(users);

  console.log("Seeding database...");

  const hashedPassword = await hash("password123");

  const [instructor1] = await db
    .insert(users)
    .values({
      email: "sarah@careerpath.com",
      name: "Sarah Johnson",
      password: hashedPassword,
      role: "instructor",
    })
    .returning();

  const [instructor2] = await db
    .insert(users)
    .values({
      email: "michael@careerpath.com",
      name: "Michael Chen",
      password: hashedPassword,
      role: "instructor",
    })
    .returning();

  await db
    .insert(users)
    .values({
      email: "admin@careerpath.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
    });

  const [student] = await db
    .insert(users)
    .values({
      email: "student@example.com",
      name: "John Student",
      password: hashedPassword,
      role: "student",
    })
    .returning();

  const [course1] = await db
    .insert(courses)
    .values({
      title: "Career Development Mastery",
      slug: "career-development-mastery",
      description:
        "Transform your career with this comprehensive program designed to help you navigate career transitions, develop essential skills, and achieve your professional goals. Learn proven strategies used by successful professionals to accelerate career growth.",
      category: "Career Growth",
      priceInCents: 19900,
      thumbnail: "/assets/generated_images/Career_development_course_thumbnail_faf64b94.png",
      instructorId: instructor1.id,
      published: true,
      rating: 49,
      enrollmentCount: 1234,
      duration: "8 weeks",
    })
    .returning();

  const [course2] = await db
    .insert(courses)
    .values({
      title: "Leadership Excellence Program",
      slug: "leadership-excellence",
      description:
        "Develop the leadership skills needed to inspire teams, drive results, and create positive organizational change. This comprehensive program covers everything from fundamental leadership principles to advanced management strategies.",
      category: "Leadership",
      priceInCents: 24900,
      thumbnail: "/assets/generated_images/Leadership_training_course_thumbnail_b254d9be.png",
      instructorId: instructor2.id,
      published: true,
      rating: 48,
      enrollmentCount: 987,
      duration: "10 weeks",
    })
    .returning();

  const [course3] = await db
    .insert(courses)
    .values({
      title: "Interview Preparation Bootcamp",
      slug: "interview-prep-bootcamp",
      description:
        "Master the art of interviewing with our intensive bootcamp. Learn how to answer behavioral questions, technical questions, negotiate offers, and present yourself confidently to land your dream job.",
      category: "Interview Prep",
      priceInCents: 14900,
      thumbnail: "/assets/generated_images/Interview_preparation_course_thumbnail_a10f56fe.png",
      instructorId: instructor1.id,
      published: true,
      rating: 50,
      enrollmentCount: 1567,
      duration: "4 weeks",
    })
    .returning();

  await db
    .insert(courses)
    .values({
      title: "Strategic Business Planning",
      slug: "strategic-business-planning",
      description:
        "Learn how to create comprehensive business strategies that drive growth and competitive advantage. This course covers market analysis, strategic frameworks, execution planning, and performance measurement.",
      category: "Business Strategy",
      priceInCents: 29900,
      thumbnail: "/assets/generated_images/Business_strategy_course_thumbnail_86b9615a.png",
      instructorId: instructor2.id,
      published: true,
      rating: 47,
      enrollmentCount: 756,
      duration: "12 weeks",
    })
    .returning();

  const course1Lessons = await db.insert(lessons).values([
    {
      courseId: course1.id,
      title: "Understanding Your Career Values",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 1,
      duration: "45 min",
      type: "video",
    },
    {
      courseId: course1.id,
      title: "SWOT Analysis for Career Planning",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 2,
      duration: "30 min",
      type: "video",
    },
    {
      courseId: course1.id,
      title: "Setting SMART Career Goals",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 3,
      duration: "1 hr",
      type: "video",
    },
    {
      courseId: course1.id,
      title: "Creating Your Career Vision Board",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 4,
      duration: "20 min",
      type: "exercise",
    },
    {
      courseId: course1.id,
      title: "Building Your Professional Brand",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 5,
      duration: "50 min",
      type: "video",
    },
    {
      courseId: course1.id,
      title: "LinkedIn Optimization Masterclass",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 6,
      duration: "40 min",
      type: "video",
    },
    {
      courseId: course1.id,
      title: "Networking Strategies That Work",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 7,
      duration: "55 min",
      type: "video",
    },
    {
      courseId: course1.id,
      title: "Crafting Your Elevator Pitch",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 8,
      duration: "25 min",
      type: "exercise",
    },
  ]).returning();

  await db.insert(lessons).values([
    {
      courseId: course2.id,
      title: "Foundations of Effective Leadership",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 1,
      duration: "50 min",
      type: "video",
    },
    {
      courseId: course2.id,
      title: "Understanding Leadership Styles",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 2,
      duration: "45 min",
      type: "video",
    },
    {
      courseId: course2.id,
      title: "Effective Team Communication",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 3,
      duration: "40 min",
      type: "video",
    },
    {
      courseId: course2.id,
      title: "Conflict Resolution Strategies",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 4,
      duration: "55 min",
      type: "video",
    },
  ]);

  await db.insert(lessons).values([
    {
      courseId: course3.id,
      title: "Interview Preparation Fundamentals",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 1,
      duration: "35 min",
      type: "video",
    },
    {
      courseId: course3.id,
      title: "Mastering Behavioral Questions",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 2,
      duration: "50 min",
      type: "video",
    },
    {
      courseId: course3.id,
      title: "Technical Interview Success",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 3,
      duration: "1 hr",
      type: "video",
    },
    {
      courseId: course3.id,
      title: "Salary Negotiation Mastery",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      orderIndex: 4,
      duration: "45 min",
      type: "video",
    },
  ]);

  await db.insert(enrollments).values([
    {
      userId: student.id,
      courseId: course1.id,
    },
    {
      userId: student.id,
      courseId: course2.id,
    },
  ]);

  await db.insert(progress).values([
    {
      userId: student.id,
      lessonId: course1Lessons[0].id,
      completed: true,
      completedAt: new Date(),
    },
    {
      userId: student.id,
      lessonId: course1Lessons[1].id,
      completed: true,
      completedAt: new Date(),
    },
    {
      userId: student.id,
      lessonId: course1Lessons[2].id,
      completed: false,
    },
  ]);

  console.log("Database seeded successfully!");
  console.log("\nTest accounts:");
  console.log("Instructor: sarah@careerpath.com / password123");
  console.log("Instructor: michael@careerpath.com / password123");
  console.log("Admin: admin@careerpath.com / password123");
  console.log("Student: student@example.com / password123");
  console.log("\nThe student is enrolled in 2 courses with some progress tracked.");

  process.exit(0);
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});
