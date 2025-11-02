import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, unique, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const courses = pgTable("courses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  thumbnail: text("thumbnail"),
  instructorId: varchar("instructor_id").notNull().references(() => users.id),
  published: boolean("published").notNull().default(true),
  rating: integer("rating").notNull().default(0),
  enrollmentCount: integer("enrollment_count").notNull().default(0),
  duration: text("duration").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  instructorIdx: index("courses_instructor_idx").on(table.instructorId),
}));

export const lessons = pgTable("lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  videoUrl: text("video_url").notNull(),
  orderIndex: integer("order_index").notNull(),
  duration: text("duration").notNull(),
  type: text("type").notNull().default("video"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => ({
  courseIdx: index("lessons_course_idx").on(table.courseId),
}));

export const enrollments = pgTable("enrollments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: varchar("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  purchasedAt: timestamp("purchased_at").notNull().defaultNow(),
  stripePaymentId: text("stripe_payment_id"),
}, (table) => ({
  userIdx: index("enrollments_user_idx").on(table.userId),
  courseIdx: index("enrollments_course_idx").on(table.courseId),
  uniqueEnrollment: unique("unique_user_course_enrollment").on(table.userId, table.courseId),
}));

export const progress = pgTable("progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: varchar("lesson_id").notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
}, (table) => ({
  userIdx: index("progress_user_idx").on(table.userId),
  lessonIdx: index("progress_lesson_idx").on(table.lessonId),
  uniqueProgress: unique("unique_user_lesson_progress").on(table.userId, table.lessonId),
}));

export const usersRelations = relations(users, ({ many }) => ({
  coursesInstructed: many(courses),
  enrollments: many(enrollments),
  progress: many(progress),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  instructor: one(users, {
    fields: [courses.instructorId],
    references: [users.id],
  }),
  lessons: many(lessons),
  enrollments: many(enrollments),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  progress: many(progress),
}));

export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

export const progressRelations = relations(progress, ({ one }) => ({
  user: one(users, {
    fields: [progress.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [progress.lessonId],
    references: [lessons.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  rating: true,
  enrollmentCount: true,
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  purchasedAt: true,
});

export const insertProgressSchema = createInsertSchema(progress).omit({
  id: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type Lesson = typeof lessons.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;

export type Enrollment = typeof enrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type Progress = typeof progress.$inferSelect;
export type InsertProgress = z.infer<typeof insertProgressSchema>;
