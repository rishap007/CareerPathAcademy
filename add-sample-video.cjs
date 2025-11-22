const Database = require('better-sqlite3');
const crypto = require('crypto');

const db = new Database('./local.db');

// Get first course
const course = db.prepare('SELECT * FROM courses ORDER BY createdAt LIMIT 1').get();

if (course) {
  // Add a demo YouTube video
  const lessonId = crypto.randomUUID();
  
  db.prepare(`
    INSERT INTO lessons (id, courseId, title, videoUrl, orderIndex, duration, type, description)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    lessonId,
    course.id,
    'Demo: How to Set Career Goals',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    999,
    '3:33',
    'video',
    'This is a sample video. Click to watch and test the video player!'
  );

  console.log('✅ Demo video added successfully!');
  console.log('📺 Course:', course.title);
  console.log('🎥 Video Title: Demo: How to Set Career Goals');
  console.log('🌐 View at: http://localhost:5000/courses/' + course.slug);
  console.log('');
  console.log('To watch:');
  console.log('1. Login as student@example.com / password123');
  console.log('2. Go to "' + course.title + '" course');
  console.log('3. Click on the demo lesson in curriculum');
  console.log('4. Video will auto-play!');
} else {
  console.log('❌ No courses found');
}

db.close();
