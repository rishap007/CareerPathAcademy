import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { hash, verify } from "@node-rs/argon2";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import type { User } from "@shared/schema";

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

      const enrollment = await storage.createEnrollment({
        userId: user.id,
        courseId,
      });

      res.json(enrollment);
    } catch (error) {
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

  const httpServer = createServer(app);

  return httpServer;
}
