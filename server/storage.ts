import {
  users,
  courses,
  lessons,
  enrollments,
  progress,
  liveLectures,
  type User,
  type InsertUser,
  type Course,
  type InsertCourse,
  type Lesson,
  type InsertLesson,
  type Enrollment,
  type InsertEnrollment,
  type Progress,
  type InsertProgress,
  type LiveLecture,
  type InsertLiveLecture,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, hashedPassword: string): Promise<void>;

  getCourses(published?: boolean): Promise<Course[]>;
  getCourseBySlug(slug: string): Promise<Course | undefined>;
  getCourseById(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: string, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: string): Promise<void>;

  getLessonsByCourseId(courseId: string): Promise<Lesson[]>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  updateLesson(id: string, lesson: Partial<InsertLesson>): Promise<Lesson | undefined>;
  deleteLesson(id: string): Promise<void>;

  createEnrollment(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollmentsByUserId(userId: string): Promise<Enrollment[]>;
  getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined>;

  getProgressByUserAndLesson(userId: string, lessonId: string): Promise<Progress | undefined>;
  getProgressByUserAndCourse(userId: string, courseId: string): Promise<Progress[]>;
  createOrUpdateProgress(progress: InsertProgress): Promise<Progress>;

  // Live Lectures
  createLiveLecture(lecture: InsertLiveLecture): Promise<LiveLecture>;
  getLiveLecturesByCourseId(courseId: string): Promise<LiveLecture[]>;
  getUpcomingLiveLectures(): Promise<LiveLecture[]>;
  getLiveLectureById(id: string): Promise<LiveLecture | undefined>;
  updateLiveLecture(id: string, lecture: Partial<InsertLiveLecture>): Promise<LiveLecture | undefined>;
  deleteLiveLecture(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<void> {
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, id));
  }

  async getCourses(published?: boolean): Promise<Course[]> {
    if (published !== undefined) {
      return await db.select().from(courses).where(eq(courses.published, published)).orderBy(desc(courses.createdAt));
    }
    return await db.select().from(courses).orderBy(desc(courses.createdAt));
  }

  async getCourseBySlug(slug: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.slug, slug));
    return course || undefined;
  }

  async getCourseById(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || undefined;
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const [course] = await db
      .insert(courses)
      .values(insertCourse)
      .returning();
    return course;
  }

  async updateCourse(id: string, updateData: Partial<InsertCourse>): Promise<Course | undefined> {
    const [course] = await db
      .update(courses)
      .set(updateData)
      .where(eq(courses.id, id))
      .returning();
    return course || undefined;
  }

  async deleteCourse(id: string): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }

  async getLessonsByCourseId(courseId: string): Promise<Lesson[]> {
    return await db.select().from(lessons).where(eq(lessons.courseId, courseId)).orderBy(lessons.orderIndex);
  }

  async createLesson(insertLesson: InsertLesson): Promise<Lesson> {
    const [lesson] = await db
      .insert(lessons)
      .values(insertLesson)
      .returning();
    return lesson;
  }

  async updateLesson(id: string, updateData: Partial<InsertLesson>): Promise<Lesson | undefined> {
    const [lesson] = await db
      .update(lessons)
      .set(updateData)
      .where(eq(lessons.id, id))
      .returning();
    return lesson || undefined;
  }

  async deleteLesson(id: string): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, id));
  }

  async createEnrollment(insertEnrollment: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db
      .insert(enrollments)
      .values(insertEnrollment)
      .returning();
    return enrollment;
  }

  async getEnrollmentsByUserId(userId: string): Promise<Enrollment[]> {
    return await db.select().from(enrollments).where(eq(enrollments.userId, userId)).orderBy(desc(enrollments.purchasedAt));
  }

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(and(eq(enrollments.userId, userId), eq(enrollments.courseId, courseId)));
    return enrollment || undefined;
  }

  async getProgressByUserAndLesson(userId: string, lessonId: string): Promise<Progress | undefined> {
    const [progressRecord] = await db
      .select()
      .from(progress)
      .where(and(eq(progress.userId, userId), eq(progress.lessonId, lessonId)));
    return progressRecord || undefined;
  }

  async getProgressByUserAndCourse(userId: string, courseId: string): Promise<Progress[]> {
    return await db
      .select()
      .from(progress)
      .innerJoin(lessons, eq(progress.lessonId, lessons.id))
      .where(and(eq(progress.userId, userId), eq(lessons.courseId, courseId)))
      .then(results => results.map(r => r.progress));
  }

  async createOrUpdateProgress(insertProgress: InsertProgress): Promise<Progress> {
    const existing = await this.getProgressByUserAndLesson(
      insertProgress.userId,
      insertProgress.lessonId
    );

    if (existing) {
      const [updated] = await db
        .update(progress)
        .set({
          completed: insertProgress.completed,
          completedAt: insertProgress.completed ? new Date() : null,
        })
        .where(eq(progress.id, existing.id))
        .returning();
      return updated;
    }

    const [newProgress] = await db
      .insert(progress)
      .values({
        ...insertProgress,
        completedAt: insertProgress.completed ? new Date() : null,
      })
      .returning();
    return newProgress;
  }

  // Live Lecture Methods
  async createLiveLecture(insertLecture: InsertLiveLecture): Promise<LiveLecture> {
    const [lecture] = await db
      .insert(liveLectures)
      .values(insertLecture)
      .returning();
    return lecture;
  }

  async getLiveLecturesByCourseId(courseId: string): Promise<LiveLecture[]> {
    return await db
      .select()
      .from(liveLectures)
      .where(eq(liveLectures.courseId, courseId))
      .orderBy(liveLectures.scheduledAt);
  }

  async getUpcomingLiveLectures(): Promise<LiveLecture[]> {
    const now = new Date();
    return await db
      .select()
      .from(liveLectures)
      .where(
        and(
          gte(liveLectures.scheduledAt, now),
          eq(liveLectures.status, "scheduled")
        )
      )
      .orderBy(liveLectures.scheduledAt);
  }

  async getLiveLectureById(id: string): Promise<LiveLecture | undefined> {
    const [lecture] = await db
      .select()
      .from(liveLectures)
      .where(eq(liveLectures.id, id));
    return lecture || undefined;
  }

  async updateLiveLecture(id: string, updateData: Partial<InsertLiveLecture>): Promise<LiveLecture | undefined> {
    const [lecture] = await db
      .update(liveLectures)
      .set(updateData)
      .where(eq(liveLectures.id, id))
      .returning();
    return lecture || undefined;
  }

  async deleteLiveLecture(id: string): Promise<void> {
    await db.delete(liveLectures).where(eq(liveLectures.id, id));
  }
}

export const storage = new DatabaseStorage();
