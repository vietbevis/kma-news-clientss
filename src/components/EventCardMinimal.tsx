import { EventProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { formatEventTime } from "@/lib/utils";
import { formatDate } from "date-fns";
import { Clock, MapPin } from "lucide-react";
import { Card } from "./ui/card";
import Image from "./ui/image";

export default function EventCardMinimal(event: EventProps) {
  const eventDate = event.startDate ? new Date(event.startDate) : null;
  const eventTime = eventDate ? formatEventTime(eventDate) : null;

  return (
    <Card className="group overflow-hidden py-0 bg-white gap-0 hover:border-primary/30 transition-all duration-200 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image image={event.thumbnail} className="object-cover w-full h-full" />

        {/* Simple overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Date Badge - Corner style */}
        {eventDate && (
          <div className="absolute top-0 right-0">
            <div className="bg-primary text-white px-3 py-2 rounded-bl-lg shadow-lg">
              <div className="text-sm font-semibold">
                {formatDate(eventDate, "dd")}
              </div>
              <div className="text-xs opacity-90">
                Th{formatDate(eventDate, "MM")}
              </div>
            </div>
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-semibold text-white text-lg leading-tight mb-2 line-clamp-2">
            <Link href={`/events/${event.slug}`} className="hover:underline">
              {event.name}
            </Link>
          </h3>
        </div>
      </div>

      {/* Event details outside image */}
      <div className="p-4 bg-gray-50">
        <div className="space-y-2 text-sm text-gray-600">
          {eventTime && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{eventTime}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
