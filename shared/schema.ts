import { sql, relations } from "drizzle-orm";
import { sqliteTable, text, integer, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("student"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const courses = sqliteTable("courses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  thumbnail: text("thumbnail"),
  instructorId: text("instructor_id").notNull().references(() => users.id),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
  rating: integer("rating").notNull().default(0),
  enrollmentCount: integer("enrollment_count").notNull().default(0),
  duration: text("duration").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  instructorIdx: index("courses_instructor_idx").on(table.instructorId),
}));

export const lessons = sqliteTable("lessons", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  videoUrl: text("video_url"),
  orderIndex: integer("order_index").notNull(),
  duration: text("duration").notNull(),
  type: text("type").notNull().default("video"), // video, exercise, live, project
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  courseIdx: index("lessons_course_idx").on(table.courseId),
}));

export const liveLectures = sqliteTable("live_lectures", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  description: text("description"),
  scheduledAt: integer("scheduled_at", { mode: "timestamp" }).notNull(),
  duration: integer("duration").notNull(), // duration in minutes
  meetingUrl: text("meeting_url"),
  status: text("status").notNull().default("scheduled"), // scheduled, live, completed, cancelled
  recordingUrl: text("recording_url"), // URL to recorded version after live lecture ends
  instructorId: text("instructor_id").notNull().references(() => users.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
}, (table) => ({
  courseIdx: index("live_lectures_course_idx").on(table.courseId),
  statusIdx: index("live_lectures_status_idx").on(table.status),
  scheduledAtIdx: index("live_lectures_scheduled_at_idx").on(table.scheduledAt),
}));

export const enrollments = sqliteTable("enrollments", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  courseId: text("course_id").notNull().references(() => courses.id, { onDelete: 'cascade' }),
  purchasedAt: integer("purchased_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  stripePaymentId: text("stripe_payment_id"),
}, (table) => ({
  userIdx: index("enrollments_user_idx").on(table.userId),
  courseIdx: index("enrollments_course_idx").on(table.courseId),
  uniqueEnrollment: uniqueIndex("unique_user_course_enrollment").on(table.userId, table.courseId),
}));

export const progress = sqliteTable("progress", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId: text("lesson_id").notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  completedAt: integer("completed_at", { mode: "timestamp" }),
}, (table) => ({
  userIdx: index("progress_user_idx").on(table.userId),
  lessonIdx: index("progress_lesson_idx").on(table.lessonId),
  uniqueProgress: uniqueIndex("unique_user_lesson_progress").on(table.userId, table.lessonId),
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
  liveLectures: many(liveLectures),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  course: one(courses, {
    fields: [lessons.courseId],
    references: [courses.id],
  }),
  progress: many(progress),
}));

export const liveLecturesRelations = relations(liveLectures, ({ one }) => ({
  course: one(courses, {
    fields: [liveLectures.courseId],
    references: [courses.id],
  }),
  instructor: one(users, {
    fields: [liveLectures.instructorId],
    references: [users.id],
  }),
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

export const insertLiveLectureSchema = createInsertSchema(liveLectures).omit({
  id: true,
  createdAt: true,
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

export type LiveLecture = typeof liveLectures.$inferSelect;
export type InsertLiveLecture = z.infer<typeof insertLiveLectureSchema>;
