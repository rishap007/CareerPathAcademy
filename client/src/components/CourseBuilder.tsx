import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoUpload from "./VideoUpload";
import {
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const courseSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  price: z.number().min(0, "Price must be 0 or greater"),
  duration: z.string().min(1, "Duration is required"),
  thumbnail: z.string().url("Please provide a valid URL").optional().or(z.literal("")),
  published: z.boolean(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface Lesson {
  id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  videoFilename?: string;
  duration: string;
  orderIndex: number;
  type: "video" | "text";
}

interface CourseBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  editCourse?: any;
}

const categories = [
  "Career Growth",
  "Leadership",
  "Interview Prep",
  "Technical Skills",
  "Business Strategy",
  "Communication",
  "Marketing",
  "Finance",
  "Personal Development",
];

export default function CourseBuilder({ isOpen, onClose, editCourse }: CourseBuilderProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Partial<Lesson>>({
    type: "video",
    orderIndex: 0,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: editCourse?.title || "",
      slug: editCourse?.slug || "",
      description: editCourse?.description || "",
      category: editCourse?.category || "",
      price: editCourse?.price || 0,
      duration: editCourse?.duration || "",
      thumbnail: editCourse?.thumbnail || "",
      published: editCourse?.published ?? false,
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: async (data: CourseFormData & { lessons: Lesson[] }) => {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create course");
      return response.json();
    },
    onSuccess: (course) => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Success!",
        description: `Course "${course.title}" created successfully.`,
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create course",
        variant: "destructive",
      });
    },
  });

  // Auto-generate slug from title
  const watchTitle = watch("title");
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setValue("title", title);
    if (!editCourse) {
      setValue("slug", generateSlug(title));
    }
  };

  const addLesson = () => {
    if (!currentLesson.title) {
      toast({
        title: "Error",
        description: "Please provide a lesson title",
        variant: "destructive",
      });
      return;
    }

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: currentLesson.title,
      description: currentLesson.description,
      videoUrl: currentLesson.videoUrl,
      videoFilename: currentLesson.videoFilename,
      duration: currentLesson.duration || "0:00",
      orderIndex: lessons.length,
      type: currentLesson.type || "video",
    };

    setLessons([...lessons, newLesson]);
    setCurrentLesson({ type: "video", orderIndex: lessons.length + 1 });

    toast({
      title: "Lesson added",
      description: `"${newLesson.title}" has been added to the course`,
    });
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id));
  };

  const moveLessonUp = (index: number) => {
    if (index === 0) return;
    const newLessons = [...lessons];
    [newLessons[index], newLessons[index - 1]] = [newLessons[index - 1], newLessons[index]];
    newLessons.forEach((lesson, i) => {
      lesson.orderIndex = i;
    });
    setLessons(newLessons);
  };

  const moveLessonDown = (index: number) => {
    if (index === lessons.length - 1) return;
    const newLessons = [...lessons];
    [newLessons[index], newLessons[index + 1]] = [newLessons[index + 1], newLessons[index]];
    newLessons.forEach((lesson, i) => {
      lesson.orderIndex = i;
    });
    setLessons(newLessons);
  };

  const onSubmit = (data: CourseFormData) => {
    if (lessons.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one lesson to the course",
        variant: "destructive",
      });
      return;
    }

    createCourseMutation.mutate({ ...data, lessons });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {editCourse ? "Edit Course" : "Create New Course"}
          </DialogTitle>
          <DialogDescription>
            Fill in the course details and add lessons to create a complete course
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Course Details</TabsTrigger>
            <TabsTrigger value="lessons">
              Lessons ({lessons.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Master React Development"
                  {...register("title")}
                  onChange={handleTitleChange}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug *</Label>
                <Input
                  id="slug"
                  placeholder="e.g., master-react-development"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course..."
                  rows={4}
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => setValue("category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...register("price", { valueAsNumber: true })}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive">{errors.price.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration *</Label>
                  <Input
                    id="duration"
                    placeholder="e.g., 8 weeks"
                    {...register("duration")}
                  />
                  {errors.duration && (
                    <p className="text-sm text-destructive">{errors.duration.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="thumbnail">Thumbnail URL</Label>
                  <Input
                    id="thumbnail"
                    placeholder="https://..."
                    {...register("thumbnail")}
                  />
                  {errors.thumbnail && (
                    <p className="text-sm text-destructive">{errors.thumbnail.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  {...register("published")}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="published">Publish course immediately</Label>
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setActiveTab("lessons")}
                  >
                    Next: Add Lessons
                  </Button>
                  <Button
                    type="submit"
                    disabled={createCourseMutation.isPending}
                  >
                    {createCourseMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Course"
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4 mt-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-4">Add New Lesson</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Lesson Type</Label>
                  <Select
                    value={currentLesson.type}
                    onValueChange={(value: "video" | "text") =>
                      setCurrentLesson({ ...currentLesson, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Video Lesson
                        </div>
                      </SelectItem>
                      <SelectItem value="text">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Text/Article
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Lesson Title *</Label>
                  <Input
                    placeholder="e.g., Introduction to Components"
                    value={currentLesson.title || ""}
                    onChange={(e) =>
                      setCurrentLesson({ ...currentLesson, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Brief description of this lesson..."
                    rows={2}
                    value={currentLesson.description || ""}
                    onChange={(e) =>
                      setCurrentLesson({ ...currentLesson, description: e.target.value })
                    }
                  />
                </div>

                {currentLesson.type === "video" && (
                  <>
                    <div className="space-y-2">
                      <Label>Video Upload</Label>
                      <VideoUpload
                        onUploadComplete={(videoData) => {
                          setCurrentLesson({
                            ...currentLesson,
                            videoUrl: videoData.url,
                            videoFilename: videoData.filename,
                          });
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input
                        placeholder="e.g., 15:30"
                        value={currentLesson.duration || ""}
                        onChange={(e) =>
                          setCurrentLesson({ ...currentLesson, duration: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}

                <Button onClick={addLesson} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lesson
                </Button>
              </div>
            </Card>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Course Lessons ({lessons.length})</h3>

              {lessons.length === 0 ? (
                <Card className="p-8 text-center text-muted-foreground">
                  <p>No lessons added yet. Add your first lesson above.</p>
                </Card>
              ) : (
                <div className="space-y-2">
                  {lessons.map((lesson, index) => (
                    <Card key={lesson.id} className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveLessonUp(index)}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => moveLessonDown(index)}
                            disabled={index === lessons.length - 1}
                          >
                            ↓
                          </Button>
                        </div>

                        <GripVertical className="h-5 w-5 text-muted-foreground" />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">
                              {lesson.type === "video" ? (
                                <Video className="h-3 w-3 mr-1" />
                              ) : (
                                <FileText className="h-3 w-3 mr-1" />
                              )}
                              {lesson.type}
                            </Badge>
                            <span className="font-medium">{lesson.title}</span>
                            {lesson.videoUrl && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground">{lesson.description}</p>
                          )}
                          {lesson.duration && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Duration: {lesson.duration}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLesson(lesson.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveTab("details")}
              >
                Back to Details
              </Button>
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={createCourseMutation.isPending || lessons.length === 0}
              >
                {createCourseMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
