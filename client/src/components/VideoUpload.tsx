import { useCallback, useState } from "react";
import { Upload, X, Video, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface VideoUploadProps {
  onUploadComplete?: (videoData: {
    url: string;
    filename: string;
    duration?: number;
    size: number;
  }) => void;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
}

export default function VideoUpload({
  onUploadComplete,
  maxSizeInMB = 500,
  acceptedFormats = ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"],
}: VideoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "processing" | "complete" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return {
        valid: false,
        error: `Invalid file type. Accepted formats: ${acceptedFormats.map(f => f.split('/')[1]).join(', ')}`,
      };
    }

    // Check file size
    const fileSizeInMB = file.size / (1024 * 1024);
    if (fileSizeInMB > maxSizeInMB) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeInMB}MB limit. Your file is ${fileSizeInMB.toFixed(2)}MB`,
      };
    }

    return { valid: true };
  };

  const handleUpload = async (file: File) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || "Invalid file");
      setUploadStatus("error");
      return;
    }

    setUploadedFile(file);
    setUploadStatus("uploading");
    setErrorMessage("");

    // Create video preview
    const preview = URL.createObjectURL(file);
    setVideoPreview(preview);

    try {
      // Simulate upload progress (in real implementation, use XMLHttpRequest or similar for progress tracking)
      const formData = new FormData();
      formData.append("video", file);

      // Simulate upload progress
      for (let i = 0; i <= 90; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // In production, you would upload to your chosen video service (Cloudflare Stream, Vimeo, etc.)
      // For now, we'll simulate a successful upload

      // TODO: Replace with actual API call
      // const response = await fetch('/api/videos/upload', {
      //   method: 'POST',
      //   body: formData,
      //   credentials: 'include',
      // });
      // const data = await response.json();

      setUploadStatus("processing");
      setUploadProgress(95);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));

      setUploadProgress(100);
      setUploadStatus("complete");

      // For demo purposes, create a mock video URL
      const mockVideoData = {
        url: preview, // In production, this would be the URL from your video service
        filename: file.name,
        size: file.size,
        duration: undefined, // Would come from video processing service
      };

      if (onUploadComplete) {
        onUploadComplete(mockVideoData);
      }
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage("Upload failed. Please try again.");
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0].type.startsWith("video/")) {
      handleUpload(files[0]);
    } else {
      setErrorMessage("Please upload a valid video file");
      setUploadStatus("error");
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleReset = () => {
    setUploadStatus("idle");
    setUploadProgress(0);
    setUploadedFile(null);
    setErrorMessage("");
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  return (
    <Card className="p-6">
      {uploadStatus === "idle" || uploadStatus === "error" ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? "border-primary bg-primary/5 scale-102"
              : "border-border hover:border-primary/50 hover:bg-muted/30"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="flex flex-col items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground mb-1">
                Drag and drop your video here
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              id="video-upload"
              className="hidden"
              accept={acceptedFormats.join(",")}
              onChange={handleFileSelect}
            />
            <Button onClick={() => document.getElementById("video-upload")?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Select Video
            </Button>
            <p className="text-xs text-muted-foreground">
              Supported formats: MP4, WebM, MOV, AVI • Max size: {maxSizeInMB}MB
            </p>
          </div>

          {uploadStatus === "error" && errorMessage && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Video className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-medium text-foreground truncate">
                  {uploadedFile?.name}
                </p>
                {uploadStatus === "complete" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : uploadStatus === "uploading" || uploadStatus === "processing" ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
                ) : null}
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {uploadedFile && `${(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB`}
                {uploadStatus === "uploading" && " • Uploading..."}
                {uploadStatus === "processing" && " • Processing..."}
                {uploadStatus === "complete" && " • Upload complete"}
              </p>

              {(uploadStatus === "uploading" || uploadStatus === "processing") && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{uploadProgress}%</p>
                </div>
              )}

              {uploadStatus === "complete" && videoPreview && (
                <div className="mt-4">
                  <video
                    src={videoPreview}
                    controls
                    className="w-full max-h-64 rounded-lg bg-black"
                  />
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleReset}
              disabled={uploadStatus === "uploading" || uploadStatus === "processing"}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
