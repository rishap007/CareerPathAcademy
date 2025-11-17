import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Video, Calendar, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function InstructorPage() {
  const [activeTab, setActiveTab] = useState("lectures");
  const [isCreateLectureOpen, setIsCreateLectureOpen] = useState(false);
  const [isUploadVideoOpen, setIsUploadVideoOpen] = useState(false);

  // Mock data - replace with actual API calls
  const courses = [
    { id: "1", title: "Career Development Mastery" },
    { id: "2", title: "Leadership Excellence Program" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50/30 to-white dark:from-purple-950/5 dark:to-background">
      <Navbar />

      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
              Instructor Dashboard
            </h1>
            <p className="text-muted-foreground">
              Manage your lectures, upload videos, and engage with your students
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="lectures" className="gap-2">
                <Calendar className="h-4 w-4" />
                Live Lectures
              </TabsTrigger>
              <TabsTrigger value="videos" className="gap-2">
                <Video className="h-4 w-4" />
                Recorded Videos
              </TabsTrigger>
            </TabsList>

            {/* Live Lectures Tab */}
            <TabsContent value="lectures" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Scheduled Live Lectures</h2>
                <Dialog open={isCreateLectureOpen} onOpenChange={setIsCreateLectureOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Live Lecture
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Schedule Live Lecture</DialogTitle>
                    </DialogHeader>
                    <ScheduleLiveLectureForm
                      courses={courses}
                      onClose={() => setIsCreateLectureOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="p-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No scheduled lectures yet</p>
                  <p className="text-sm">
                    Schedule your first live lecture to start engaging with students in real-time
                  </p>
                </div>
              </Card>
            </TabsContent>

            {/* Recorded Videos Tab */}
            <TabsContent value="videos" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Recorded Video Lectures</h2>
                <Dialog open={isUploadVideoOpen} onOpenChange={setIsUploadVideoOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Upload Video Lecture</DialogTitle>
                    </DialogHeader>
                    <UploadVideoForm
                      courses={courses}
                      onClose={() => setIsUploadVideoOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <Card className="p-6">
                <div className="text-center py-12 text-muted-foreground">
                  <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">No recorded videos yet</p>
                  <p className="text-sm">
                    Upload your first video lecture to build your course content
                  </p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// Schedule Live Lecture Form Component
function ScheduleLiveLectureForm({ courses, onClose }: { courses: any[], onClose: () => void }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      courseId: formData.get("courseId"),
      title: formData.get("title"),
      description: formData.get("description"),
      scheduledAt: new Date(formData.get("scheduledAt") as string).toISOString(),
      duration: parseInt(formData.get("duration") as string),
      meetingUrl: formData.get("meetingUrl"),
    };

    try {
      const response = await fetch("/api/live-lectures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Live lecture scheduled successfully!");
        onClose();
      } else {
        alert("Failed to schedule lecture");
      }
    } catch (error) {
      alert("Error scheduling lecture");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="courseId">Course</Label>
        <Select name="courseId" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Lecture Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Introduction to Career Development"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the lecture..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="scheduledAt">Date & Time</Label>
          <Input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes)</Label>
          <Input
            id="duration"
            name="duration"
            type="number"
            placeholder="60"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="meetingUrl">Meeting URL (Zoom, Google Meet, etc.)</Label>
        <Input
          id="meetingUrl"
          name="meetingUrl"
          type="url"
          placeholder="https://zoom.us/j/..."
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
          Schedule Lecture
        </Button>
      </div>
    </form>
  );
}

// Upload Video Form Component
function UploadVideoForm({ courses, onClose }: { courses: any[], onClose: () => void }) {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const data = {
      courseId: formData.get("courseId"),
      title: formData.get("title"),
      description: formData.get("description"),
      videoUrl: formData.get("videoUrl"),
      duration: formData.get("duration"),
      orderIndex: parseInt(formData.get("orderIndex") as string) || 0,
      type: "video",
    };

    try {
      const response = await fetch("/api/lessons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Video uploaded successfully!");
        onClose();
      } else {
        alert("Failed to upload video");
      }
    } catch (error) {
      alert("Error uploading video");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="courseId">Course</Label>
        <Select name="courseId" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.id}>
                {course.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Video Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Lesson 1: Introduction"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="What will students learn in this video..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video URL</Label>
        <Input
          id="videoUrl"
          name="videoUrl"
          type="url"
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          required
        />
        <p className="text-xs text-muted-foreground">
          Supports YouTube, Vimeo, or direct video file URLs
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            placeholder="45 min"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderIndex">Lesson Number</Label>
          <Input
            id="orderIndex"
            name="orderIndex"
            type="number"
            placeholder="1"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
          Upload Video
        </Button>
      </div>
    </form>
  );
}
