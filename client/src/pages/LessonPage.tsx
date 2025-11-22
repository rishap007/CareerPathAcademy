import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";

export default function LessonPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/courses/:courseSlug/lessons/:lessonId");

  const [lesson, setLesson] = useState<any>(null);
  const [course, setCourse] = useState<any>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  useEffect(() => {
    const fetchLesson = async () => {
      if (!params?.courseSlug || !params?.lessonId) return;

      setIsLoading(true);
      try {
        // Fetch course
        const courseRes = await fetch(`/api/courses/${params.courseSlug}`);
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setCourse(courseData);
          setAllLessons(courseData.lessons || []);

          // Find the specific lesson
          const lessonData = courseData.lessons?.find((l: any) => l.id === params.lessonId);
          if (lessonData) {
            setLesson(lessonData);
          }
        }

        // Check if lesson is completed
        if (user) {
          const progressRes = await fetch(`/api/progress?lessonId=${params.lessonId}`, {
            credentials: "include",
          });
          if (progressRes.ok) {
            const progress = await progressRes.json();
            setIsCompleted(progress?.completed || false);
          }
        }
      } catch (error) {
        console.error("Failed to fetch lesson:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load lesson",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [params?.courseSlug, params?.lessonId, user]);

  const handleMarkComplete = async () => {
    if (!user || !lesson) return;

    setIsMarkingComplete(true);
    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          lessonId: lesson.id,
          completed: true,
        }),
      });

      if (response.ok) {
        setIsCompleted(true);
        toast({
          title: "Lesson Completed!",
          description: "Great job! Keep up the good work.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to mark lesson as complete",
      });
    } finally {
      setIsMarkingComplete(false);
    }
  };

  const handleVideoComplete = () => {
    if (!isCompleted) {
      handleMarkComplete();
    }
  };

  const currentLessonIndex = allLessons.findIndex(l => l.id === params?.lessonId);
  const nextLesson = allLessons[currentLessonIndex + 1];
  const prevLesson = allLessons[currentLessonIndex - 1];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Lesson Not Found</h1>
          <Button onClick={() => setLocation("/courses")}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Button
                variant="link"
                className="p-0 h-auto"
                onClick={() => setLocation(`/courses/${params?.courseSlug}`)}
              >
                {course.title}
              </Button>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{lesson.title}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player */}
              {lesson.videoUrl && (
                <VideoPlayer
                  videoUrl={lesson.videoUrl}
                  title={lesson.title}
                  onComplete={handleVideoComplete}
                  autoPlay={true}
                />
              )}

              {/* Lesson Info */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                      {lesson.title}
                    </h1>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{lesson.type}</Badge>
                      <span className="text-sm text-muted-foreground">{lesson.duration}</span>
                      {isCompleted && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </div>

                  {!isCompleted && (
                    <Button
                      onClick={handleMarkComplete}
                      disabled={isMarkingComplete || !user}
                      className="bg-primary hover:bg-primary/90"
                    >
                      {isMarkingComplete ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Marking...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark Complete
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {lesson.description && (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed">{lesson.description}</p>
                  </div>
                )}
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                {prevLesson ? (
                  <Button
                    variant="outline"
                    onClick={() => setLocation(`/courses/${params?.courseSlug}/lessons/${prevLesson.id}`)}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous Lesson
                  </Button>
                ) : (
                  <div />
                )}

                {nextLesson ? (
                  <Button
                    onClick={() => setLocation(`/courses/${params?.courseSlug}/lessons/${nextLesson.id}`)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Next Lesson
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setLocation("/dashboard")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Course Complete!
                  </Button>
                )}
              </div>
            </div>

            {/* Sidebar - Course Curriculum */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Course Content
                </h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {allLessons.map((l: any, index: number) => (
                    <button
                      key={l.id}
                      onClick={() => setLocation(`/courses/${params?.courseSlug}/lessons/${l.id}`)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        l.id === lesson.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-sm font-medium">{index + 1}.</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium line-clamp-2">{l.title}</p>
                          <p className="text-xs opacity-75 mt-1">{l.duration}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
