import { sqliteDb } from "./db";

console.log("Adding missing columns to database tables...");

try {
  // Add status column to live_lectures table
  sqliteDb.exec(`
    ALTER TABLE live_lectures ADD COLUMN status TEXT NOT NULL DEFAULT 'scheduled';
  `);
  console.log("✅ Added status column to live_lectures");
} catch (err: any) {
  if (err.message.includes('duplicate column name')) {
    console.log("ℹ️  status column already exists");
  } else {
    console.error("Error adding status column:", err.message);
  }
}

try {
  // Add recording_url column to live_lectures table
  sqliteDb.exec(`
    ALTER TABLE live_lectures ADD COLUMN recording_url TEXT;
  `);
  console.log("✅ Added recording_url column to live_lectures");
} catch (err: any) {
  if (err.message.includes('duplicate column name')) {
    console.log("ℹ️  recording_url column already exists");
  } else {
    console.error("Error adding recording_url column:", err.message);
  }
}

try {
  // Add instructor_id column to live_lectures table
  sqliteDb.exec(`
    ALTER TABLE live_lectures ADD COLUMN instructor_id TEXT NOT NULL DEFAULT '';
  `);
  console.log("✅ Added instructor_id column to live_lectures");
} catch (err: any) {
  if (err.message.includes('duplicate column name')) {
    console.log("ℹ️  instructor_id column already exists");
  } else {
    console.error("Error adding instructor_id column:", err.message);
  }
}

try {
  // Add description column to lessons table
  sqliteDb.exec(`
    ALTER TABLE lessons ADD COLUMN description TEXT;
  `);
  console.log("✅ Added description column to lessons");
} catch (err: any) {
  if (err.message.includes('duplicate column name')) {
    console.log("ℹ️  description column already exists");
  } else {
    console.error("Error adding description column:", err.message);
  }
}

console.log("\n✅ Schema update completed!");
process.exit(0);
