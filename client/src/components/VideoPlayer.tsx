import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  onComplete?: () => void;
  autoPlay?: boolean;
}

export default function VideoPlayer({
  videoUrl,
  title,
  onComplete,
  autoPlay = false
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Extract video ID from YouTube URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=${autoPlay ? 1 : 0}&rel=0`;
    }
    return url;
  };

  // Check if it's a YouTube or Vimeo URL
  const isYouTube = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be');
  const isVimeo = videoUrl.includes('vimeo.com');

  const embedUrl = isYouTube ? getYouTubeEmbedUrl(videoUrl) : videoUrl;

  return (
    <Card className="overflow-hidden bg-black">
      <div className="relative aspect-video bg-black">
        {(isYouTube || isVimeo) ? (
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            className="w-full h-full"
            controls
            autoPlay={autoPlay}
            onEnded={onComplete}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 bg-white dark:bg-card border-t border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Video Lecture</span>
        </div>
      </div>
    </Card>
  );
}
