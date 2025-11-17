import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, PlayCircle, Radio } from "lucide-react";
import { format } from "date-fns";

interface LiveLectureCardProps {
  id: string;
  title: string;
  description?: string;
  scheduledAt: Date;
  duration: number;
  status: "scheduled" | "live" | "completed" | "cancelled";
  meetingUrl?: string;
  recordingUrl?: string;
  instructorName?: string;
}

export default function LiveLectureCard({
  title,
  description,
  scheduledAt,
  duration,
  status,
  meetingUrl,
  recordingUrl,
  instructorName,
}: LiveLectureCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white";
      case "scheduled":
        return "bg-primary text-primary-foreground";
      case "completed":
        return "bg-secondary text-secondary-foreground";
      case "cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "live":
        return <Radio className="h-3 w-3 animate-pulse" />;
      case "scheduled":
        return <Calendar className="h-3 w-3" />;
      case "completed":
        return <PlayCircle className="h-3 w-3" />;
      default:
        return <Video className="h-3 w-3" />;
    }
  };

  const formatDate = (date: Date) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  const formatTime = (date: Date) => {
    return format(new Date(date), "hh:mm a");
  };

  return (
    <Card className="overflow-hidden transition-all hover:border-primary/50 hover:shadow-md">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge className={`${getStatusColor()} flex items-center gap-1`}>
                {getStatusIcon()}
                <span className="capitalize">{status}</span>
              </Badge>
              {status === "live" && (
                <span className="text-xs text-red-500 font-semibold animate-pulse">
                  • LIVE NOW
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-foreground line-clamp-2">
              {title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {description}
          </p>
        )}

        {/* Details */}
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(scheduledAt)}</span>
            <span className="text-xs">•</span>
            <Clock className="h-4 w-4" />
            <span>{formatTime(scheduledAt)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Video className="h-4 w-4" />
            <span>{duration} minutes</span>
            {instructorName && (
              <>
                <span className="text-xs">•</span>
                <span>by {instructorName}</span>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-border/50">
          {status === "live" && meetingUrl && (
            <Button className="w-full bg-red-500 hover:bg-red-600" asChild>
              <a href={meetingUrl} target="_blank" rel="noopener noreferrer">
                <Radio className="h-4 w-4 mr-2 animate-pulse" />
                Join Live Lecture
              </a>
            </Button>
          )}
          {status === "scheduled" && (
            <Button variant="outline" className="w-full" disabled>
              <Calendar className="h-4 w-4 mr-2" />
              Scheduled
            </Button>
          )}
          {status === "completed" && recordingUrl && (
            <Button variant="secondary" className="w-full" asChild>
              <a href={recordingUrl} target="_blank" rel="noopener noreferrer">
                <PlayCircle className="h-4 w-4 mr-2" />
                Watch Recording
              </a>
            </Button>
          )}
          {status === "completed" && !recordingUrl && (
            <Button variant="ghost" className="w-full" disabled>
              Recording Not Available
            </Button>
          )}
          {status === "cancelled" && (
            <Button variant="ghost" className="w-full" disabled>
              Cancelled
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
