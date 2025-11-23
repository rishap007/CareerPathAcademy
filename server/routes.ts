import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hash, verify } from "@node-rs/argon2";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { User } from "@shared/schema";
import { stripe, createCheckoutSession, constructWebhookEvent, isStripeConfigured } from "./stripe";
import { sendEmail, getEnrollmentConfirmationEmail, getPasswordResetEmail, verifyEmailConfig } from "./email";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure Passport
  passport.use(
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          const user = await storage.getUserByEmail(email);
          if (!user) {
            return done(null, false, { message: "Invalid email or password" });
          }

          const isValid = await verify(user.password, password, {
            memoryCost: 19456,
            timeCost: 2,
            outputLen: 32,
            parallelism: 1,
          });

          if (!isValid) {
            return done(null, false, { message: "Invalid email or password" });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  app.use(passport.initialize());
  app.use(passport.session());

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, name, password } = req.body;

      // Check if user exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await hash(password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      // Create user
      const user = await storage.createUser({
        email,
        name,
        password: hashedPassword,
        role: "student",
      });

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: "Error logging in" });
        }
        res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
      });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/auth/login", passport.authenticate("local"), (req, res) => {
    const user = req.user as User;
    res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.isAuthenticated()) {
      const user = req.user as User;
      res.json({ user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Password Reset Routes
  const resetTokens = new Map<string, { userId: string; expiresAt: Date }>();

  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = req.body;

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists
        return res.json({ message: "If an account exists, a reset link has been sent." });
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      resetTokens.set(resetToken, { userId: user.id, expiresAt });

      // Send reset email
      const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/reset-password?token=${resetToken}`;
      const emailTemplate = getPasswordResetEmail({
        userName: user.name,
        resetUrl,
        expiresIn: '1 hour',
      });

      await sendEmail({
        ...emailTemplate,
        to: user.email,
      });

      res.json({ message: "If an account exists, a reset link has been sent." });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: "Error processing request" });
    }
  });

  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      const resetData = resetTokens.get(token);
      if (!resetData || resetData.expiresAt < new Date()) {
        resetTokens.delete(token);
        return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      // Hash new password
      const hashedPassword = await hash(newPassword, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      });

      // Update user password (you'll need to add this method to storage)
      await storage.updateUserPassword(resetData.userId, hashedPassword);

      // Delete used token
      resetTokens.delete(token);

      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: "Error resetting password" });
    }
  });

  // Stripe Webhook Handler
  app.post("/api/webhooks/stripe", async (req, res) => {
    try {
      const signature = req.headers['stripe-signature'];

      if (!signature) {
        return res.status(400).json({ message: "Missing stripe-signature header" });
      }

      const event = constructWebhookEvent(req.rawBody as Buffer, signature as string);

      if (!event) {
        return res.status(400).json({ message: "Invalid signature" });
      }

      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as any;
          const userId = session.metadata.userId;
          const courseId = session.metadata.courseId;

          // Create enrollment
          const enrollment = await storage.createEnrollment({
            userId,
            courseId,
            stripePaymentId: session.payment_intent,
          });

          // Get user and course details
          const user = await storage.getUser(userId);
          const course = await storage.getCourseById(courseId);

          if (user && course) {
            // Update enrollment count
            await storage.updateCourse(courseId, {
              enrollmentCount: (course.enrollmentCount || 0) + 1,
            });

            // Send enrollment confirmation email
            const emailTemplate = getEnrollmentConfirmationEmail({
              userName: user.name,
              courseTitle: course.title,
              courseUrl: `${process.env.APP_URL || 'http://localhost:5000'}/courses/${course.slug}`,
              isPaid: true,
              amount: course.priceInCents,
            });

            await sendEmail({
              ...emailTemplate,
              to: user.email,
            });
          }

          console.log(`✅ Enrollment created for user ${userId} in course ${courseId}`);
          break;
        }

        case 'payment_intent.payment_failed': {
          const paymentIntent = event.data.object as any;
          console.error('❌ Payment failed:', paymentIntent.id);
          break;
        }

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // Courses Routes
  app.get("/api/courses", async (req, res) => {
    try {
      const published = req.query.published === "true";
      const courses = await storage.getCourses(published || undefined);

      // Convert priceInCents to price (in dollars) for frontend
      const coursesWithPrice = courses.map(course => ({
        ...course,
        price: course.priceInCents / 100,
        rating: course.rating / 10, // Convert rating from 0-50 to 0-5.0
        enrollments: course.enrollmentCount || 0,
      }));

      res.json(coursesWithPrice);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  app.get("/api/courses/:slug", async (req, res) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const lessons = await storage.getLessonsByCourseId(course.id);

      res.json({
        ...course,
        price: course.priceInCents / 100,
        rating: course.rating / 10,
        enrollments: course.enrollmentCount || 0,
        lessons,
      });
    } catch (error) {
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  app.post("/api/courses", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      if (user.role !== "admin" && user.role !== "instructor") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const courseData = {
        ...req.body,
        priceInCents: Math.round(req.body.price * 100),
        rating: Math.round(req.body.rating * 10),
        instructorId: user.id,
      };

      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error creating course" });
    }
  });

  // Enrollments Routes
  app.post("/api/enrollments", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      const { courseId } = req.body;

      // Check if already enrolled
      const existing = await storage.getEnrollment(user.id, courseId);
      if (existing) {
        return res.status(400).json({ message: "Already enrolled in this course" });
      }

      // Get course details
      const course = await storage.getCourseById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // If course is free (price is 0), enroll directly
      if (course.priceInCents === 0) {
        const enrollment = await storage.createEnrollment({
          userId: user.id,
          courseId,
        });

        // Update enrollment count
        await storage.updateCourse(courseId, {
          enrollmentCount: (course.enrollmentCount || 0) + 1,
        });

        // Send enrollment confirmation email
        const emailTemplate = getEnrollmentConfirmationEmail({
          userName: user.name,
          courseTitle: course.title,
          courseUrl: `${process.env.APP_URL || 'http://localhost:5000'}/courses/${course.slug}`,
          isPaid: false,
        });
        await sendEmail({
          ...emailTemplate,
          to: user.email,
        });

        return res.json(enrollment);
      }

      // For paid courses, create Stripe checkout session
      if (!isStripeConfigured()) {
        return res.status(503).json({
          message: "Payment processing is not available. Please contact support."
        });
      }

      const checkoutUrl = await createCheckoutSession({
        courseId: course.id,
        courseTitle: course.title,
        priceInCents: course.priceInCents,
        userId: user.id,
        userEmail: user.email,
      });

      if (!checkoutUrl) {
        return res.status(500).json({ message: "Failed to create checkout session" });
      }

      res.json({ checkoutUrl });
    } catch (error) {
      console.error('Enrollment error:', error);
      res.status(500).json({ message: "Error creating enrollment" });
    }
  });

  app.get("/api/enrollments/my", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      const enrollments = await storage.getEnrollmentsByUserId(user.id);

      // Fetch course details for each enrollment
      const enrollmentsWithCourses = await Promise.all(
        enrollments.map(async (enrollment) => {
          const course = await storage.getCourseById(enrollment.courseId);
          const progress = await storage.getProgressByUserAndCourse(user.id, enrollment.courseId);
          const lessons = await storage.getLessonsByCourseId(enrollment.courseId);

          const completedLessons = progress.filter(p => p.completed).length;
          const totalLessons = lessons.length;
          const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

          return {
            ...enrollment,
            course: course ? {
              ...course,
              price: course.priceInCents / 100,
              rating: course.rating / 10,
            } : null,
            progress: progressPercentage,
            completedLessons,
            totalLessons,
          };
        })
      );

      res.json(enrollmentsWithCourses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });

  // Course Recommendations
  app.get("/api/recommendations", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      const enrollments = await storage.getEnrollmentsByUserId(user.id);
      const enrolledCourseIds = enrollments.map(e => e.courseId);

      // Get all published courses
      const allCourses = await storage.getCourses(true);

      // Get enrolled courses with their categories
      const enrolledCourses = await Promise.all(
        enrolledCourseIds.map(id => storage.getCourseById(id))
      );
      const enrolledCategories = enrolledCourses
        .filter(c => c !== undefined)
        .map(c => c!.category);

      // Recommend courses based on:
      // 1. Similar categories to enrolled courses
      // 2. High ratings
      // 3. Not already enrolled
      const recommendations = allCourses
        .filter(course => !enrolledCourseIds.includes(course.id))
        .map(course => ({
          ...course,
          relevanceScore: enrolledCategories.includes(course.category)
            ? course.rating + 20  // Boost score for matching category
            : course.rating,
        }))
        .sort((a, b) => b.relevanceScore - a.relevanceScore)
        .slice(0, 6)
        .map(course => ({
          ...course,
          price: course.priceInCents / 100,
          rating: course.rating / 10,
          enrollments: course.enrollmentCount || 0,
        }));

      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching recommendations" });
    }
  });

  // Lessons Routes
  app.get("/api/courses/:slug/lessons", async (req, res) => {
    try {
      const course = await storage.getCourseBySlug(req.params.slug);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      const lessons = await storage.getLessonsByCourseId(course.id);
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: "Error fetching lessons" });
    }
  });

  // Progress Routes
  app.post("/api/progress", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      const { lessonId, completed } = req.body;

      // Validate lesson exists
      const lesson = await storage.getLessonById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }

      // Validate user is enrolled in the course
      const enrollment = await storage.getEnrollment(user.id, lesson.courseId);
      if (!enrollment) {
        return res.status(403).json({ message: "Not enrolled in this course" });
      }

      const progressRecord = await storage.createOrUpdateProgress({
        userId: user.id,
        lessonId,
        completed,
      });

      res.json(progressRecord);
    } catch (error) {
      res.status(500).json({ message: "Error updating progress" });
    }
  });

  // Live Lectures Routes
  app.post("/api/live-lectures", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      if (user.role !== "admin" && user.role !== "instructor") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const lectureData = {
        ...req.body,
        instructorId: user.id,
        scheduledAt: new Date(req.body.scheduledAt),
      };

      const lecture = await storage.createLiveLecture(lectureData);
      res.json(lecture);
    } catch (error) {
      res.status(500).json({ message: "Error creating live lecture" });
    }
  });

  app.get("/api/live-lectures/upcoming", async (req, res) => {
    try {
      const lectures = await storage.getUpcomingLiveLectures();
      res.json(lectures);
    } catch (error) {
      console.error('Error fetching upcoming lectures:', error);
      res.status(500).json({ message: "Error fetching upcoming lectures" });
    }
  });

  app.get("/api/live-lectures/course/:courseId", async (req, res) => {
    try {
      const lectures = await storage.getLiveLecturesByCourseId(req.params.courseId);
      res.json(lectures);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course lectures" });
    }
  });

  app.get("/api/live-lectures/:id", async (req, res) => {
    try {
      const lecture = await storage.getLiveLectureById(req.params.id);
      if (!lecture) {
        return res.status(404).json({ message: "Live lecture not found" });
      }
      res.json(lecture);
    } catch (error) {
      res.status(500).json({ message: "Error fetching live lecture" });
    }
  });

  app.put("/api/live-lectures/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      if (user.role !== "admin" && user.role !== "instructor") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updateData = {
        ...req.body,
        ...(req.body.scheduledAt && { scheduledAt: new Date(req.body.scheduledAt) }),
      };

      const lecture = await storage.updateLiveLecture(req.params.id, updateData);
      if (!lecture) {
        return res.status(404).json({ message: "Live lecture not found" });
      }
      res.json(lecture);
    } catch (error) {
      res.status(500).json({ message: "Error updating live lecture" });
    }
  });

  app.delete("/api/live-lectures/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      if (user.role !== "admin" && user.role !== "instructor") {
        return res.status(403).json({ message: "Not authorized" });
      }

      await storage.deleteLiveLecture(req.params.id);
      res.json({ message: "Live lecture deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting live lecture" });
    }
  });

  // Lesson Upload/Create Route (for recorded lectures)
  app.post("/api/lessons", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      if (user.role !== "admin" && user.role !== "instructor") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const lesson = await storage.createLesson(req.body);
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Error creating lesson" });
    }
  });

  app.put("/api/lessons/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      if (user.role !== "admin" && user.role !== "instructor") {
        return res.status(403).json({ message: "Not authorized" });
      }

      const lesson = await storage.updateLesson(req.params.id, req.body);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Error updating lesson" });
    }
  });

  app.delete("/api/lessons/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = req.user as User;
      if (user.role !== "admin" && user.role !== "instructor") {
        return res.status(403).json({ message: "Not authorized" });
      }

      await storage.deleteLesson(req.params.id);
      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting lesson" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
