# 🎥 Video & Live Class Guide - CareerCompass

## ✅ What's Already Set Up

Your app now has a **complete video learning system**:

1. ✅ **Video Player Component** - Supports YouTube, Vimeo, Direct MP4
2. ✅ **Lesson Viewing Page** - Full video player with progress tracking
3. ✅ **Progress Tracking** - Mark lessons complete, track course progress
4. ✅ **Instructor Dashboard** - Upload videos & schedule live classes
5. ✅ **Live Lecture System** - Schedule and manage live sessions

---

## 📹 Adding Videos (3 Methods)

### Method 1: Via Instructor Dashboard (Easiest)

1. **Login as Instructor**
   ```
   URL: http://localhost:5000/instructor
   Email: sarah@careerpath.com
   Password: password123
   ```

2. **Click "Recorded Videos" Tab**

3. **Click "Upload Video" Button**

4. **Fill Form:**
   - **Course**: Select your course
   - **Title**: "Introduction to Career Planning"
   - **Description**: "Learn the basics..."
   - **Video URL**: Paste URL (see options below)
   - **Duration**: "10:30"
   - **Lesson Order**: 1

5. **Submit** - Video is immediately available!

---

### Method 2: Using YouTube (FREE & Recommended)

**Why YouTube?**
- ✅ FREE unlimited storage & bandwidth
- ✅ Automatic quality adjustment
- ✅ Mobile optimized
- ✅ No server costs

**Steps:**
1. Upload video to YouTube (can be Unlisted for privacy)
2. Copy video URL: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Add via Instructor Dashboard
4. App automatically embeds YouTube player!

**Example URLs:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
```

---

### Method 3: Using Vimeo (Professional)

**Why Vimeo?**
- ✅ No ads (unlike YouTube free tier)
- ✅ Better privacy controls
- ✅ Professional appearance
- ✅ Custom player branding

**Pricing:**
- Free: 500MB/week upload
- Plus: $12/month - 5GB storage
- Pro: $20/month - 20GB storage

**Steps:**
1. Upload to Vimeo
2. Get share link
3. Add via Instructor Dashboard

**Example URL:**
```
https://vimeo.com/76979871
```

---

### Method 4: Self-Hosted Videos

**For maximum control:**

1. **Upload videos to your server:**
   ```
   /client/public/videos/course-name/lesson-1.mp4
   ```

2. **Add lesson with URL:**
   ```
   /videos/course-name/lesson-1.mp4
   ```

3. **App uses HTML5 video player**

**Pros:**
- Complete control
- No third-party dependencies

**Cons:**
- Need storage space
- Bandwidth costs (use CDN recommended)
- Manual video transcoding needed

---

## 🔴 Adding Live Classes

### Method 1: Zoom/Google Meet (Easiest)

**Steps:**

1. **Create meeting:**
   - Zoom: https://zoom.us
   - Google Meet: https://meet.google.com
   - Microsoft Teams: https://teams.microsoft.com

2. **Copy meeting URL:**
   ```
   Zoom: https://zoom.us/j/1234567890?pwd=xxxxx
   Google Meet: https://meet.google.com/abc-defg-hij
   Teams: https://teams.microsoft.com/...
   ```

3. **Login to Instructor Dashboard**

4. **Click "Live Lectures" Tab**

5. **Click "Schedule Live Lecture"**

6. **Fill Form:**
   - **Course**: Select course
   - **Title**: "Live Q&A Session"
   - **Description**: "Ask anything about careers"
   - **Date & Time**: Pick future date/time
   - **Duration**: 60 minutes
   - **Meeting URL**: Paste Zoom/Meet link

7. **Submit**

**What Students See:**
- Lecture appears on course page with "Scheduled" badge
- Shows date/time
- When live, shows "LIVE NOW" badge
- "Join Live" button opens meeting in new tab

---

### Method 2: YouTube Live (FREE Streaming)

**For in-app streaming:**

1. **Set up YouTube Live:**
   - YouTube Studio → "Create" → "Go Live"
   - Get stream key

2. **Use OBS Studio (free):**
   - Download: https://obsproject.com
   - Settings → Stream → Enter YouTube key
   - Start streaming!

3. **Get live stream URL:**
   ```
   https://www.youtube.com/watch?v=LIVE_STREAM_ID
   ```

4. **Add as live lecture meeting URL**

**Students watch directly in your app!**

---

### Method 3: Advanced - Custom Streaming

**For professional in-app streaming:**

**Options:**
1. **AWS IVS** - $5-50/month
2. **Mux** - Usage-based pricing
3. **Agora** - Free tier available
4. **Twilio Live** - Usage-based

**I can help integrate any of these!**

---

## 🎬 How Video Streaming Works

Your `VideoPlayer` component automatically detects:

```typescript
// YouTube URLs
if (url.includes('youtube.com') || url.includes('youtu.be')) {
  // Embed YouTube player
  return <iframe src={youtubeEmbedUrl} />
}

// Vimeo URLs
else if (url.includes('vimeo.com')) {
  // Embed Vimeo player
  return <iframe src={vimeoEmbedUrl} />
}

// Direct video files (.mp4, .webm)
else {
  // HTML5 video player
  return <video src={url} controls />
}
```

**Features:**
- ✅ Auto-play support
- ✅ Fullscreen mode
- ✅ On-complete callback (marks lesson done)
- ✅ Responsive design
- ✅ Mobile optimized

---

## 🚀 Complete User Flow

### **Student Watches Video:**

1. Student browses courses → http://localhost:5000/courses
2. Clicks on course → Course detail page
3. Enrolls in course (free/paid)
4. Views curriculum → Clicks on lesson
5. **Lesson page loads** → http://localhost:5000/courses/course-slug/lessons/lesson-id
6. Video automatically embeds and plays
7. Student watches video
8. Clicks "Mark Complete" button
9. Progress tracked in database
10. Next lesson button appears
11. Returns to dashboard to see progress

---

## 📊 Progress Tracking

**Automatic tracking includes:**
- Lesson completion status
- Course progress percentage
- Completed lessons count
- Time spent (coming soon)
- Certificates on completion (coming soon)

---

## 🎯 Quick Test

**Try it now:**

1. **Open**: http://localhost:5000

2. **Login**:
   - Email: `student@example.com`
   - Password: `password123`

3. **Go to**: "Career Development Mastery" course

4. **Click on** any lesson in the curriculum

5. **Watch** the video (sample YouTube video is loaded)

6. **Click** "Mark Complete"

7. **Navigate** using "Next Lesson" button

8. **Return** to Dashboard to see progress!

---

## 💡 Best Practices

### For Videos:
1. **Use YouTube** for most content (free, reliable)
2. **Use Vimeo** for ad-free professional courses
3. **Self-host** only if you need complete control
4. **Keep videos** under 15 minutes (better engagement)
5. **Add descriptions** for better SEO
6. **Use thumbnails** for better click rates

### For Live Classes:
1. **Schedule in advance** (at least 24 hours)
2. **Send reminders** via email (implement later)
3. **Record sessions** for replay
4. **Use Zoom** for < 100 participants
5. **Use YouTube Live** for > 100 participants
6. **Test setup** 10 minutes before going live

---

## 🔧 Advanced Customization

### Want to add:
- ✅ **Quiz after videos** - I can add this
- ✅ **Downloadable resources** - Easy to add
- ✅ **Video speed control** - Already supported
- ✅ **Subtitles/Captions** - Can integrate
- ✅ **Interactive timestamps** - Can add
- ✅ **Chapter markers** - Can implement
- ✅ **Discussion threads** - Can build
- ✅ **Live chat** - Can integrate

**Just ask and I'll help implement!**

---

## 📞 Need Help?

**Common issues:**

**Video not playing?**
- Check URL is public/unlisted (not private)
- Verify YouTube embed is enabled
- Try different browser

**Progress not saving?**
- Ensure user is logged in
- Check enrollment status
- Verify API calls in Network tab

**Live lecture not showing?**
- Check scheduled time is in future
- Verify course ID is correct
- Reload page

---

## 🎉 Summary

✅ Your app supports **YouTube, Vimeo, and Direct video streaming**
✅ **Instructor Dashboard** to add content easily
✅ **Lesson viewing page** with progress tracking
✅ **Live class scheduling** with Zoom/Meet/YouTube Live
✅ **Automatic video player** detection
✅ **Mobile responsive** video playback
✅ **Progress tracking** and completion badges

**You're ready to add unlimited videos and live classes!** 🚀
