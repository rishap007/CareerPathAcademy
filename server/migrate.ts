import { sqliteDb } from "./db";

console.log("Creating database tables...");

// Create users table
sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch())
  );
`);

// Create courses table
sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS courses (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    price_in_cents INTEGER NOT NULL,
    thumbnail TEXT,
    instructor_id TEXT NOT NULL,
    published INTEGER DEFAULT 1,
    rating INTEGER DEFAULT 45,
    enrollment_count INTEGER DEFAULT 0,
    duration TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (instructor_id) REFERENCES users(id)
  );
`);

// Create lessons table
sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS lessons (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT,
    order_index INTEGER NOT NULL,
    duration TEXT,
    type TEXT DEFAULT 'video',
    description TEXT,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );
`);

// Create enrollments table
sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS enrollments (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    purchased_at INTEGER DEFAULT (unixepoch()),
    stripe_payment_id TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(user_id, course_id)
  );
`);

// Create progress table
sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS progress (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    user_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    completed INTEGER DEFAULT 0,
    completed_at INTEGER,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    UNIQUE(user_id, lesson_id)
  );
`);

// Create live_lectures table
sqliteDb.exec(`
  CREATE TABLE IF NOT EXISTS live_lectures (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    meeting_url TEXT,
    status TEXT NOT NULL DEFAULT 'scheduled',
    recording_url TEXT,
    instructor_id TEXT NOT NULL,
    created_at INTEGER DEFAULT (unixepoch()),
    updated_at INTEGER DEFAULT (unixepoch()),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (instructor_id) REFERENCES users(id)
  );
`);

console.log("✅ Database tables created successfully!");
process.exit(0);
