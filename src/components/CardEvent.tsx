import { EventProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { formatDateBadge } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { Card } from "./ui/card";
import Image from "./ui/image";

export default function CardEvent(event: EventProps) {
  const eventDate = event.startDate ? new Date(event.startDate) : null;
  const { day, month } = eventDate
    ? formatDateBadge(eventDate)
    : { day: "", month: "" };

  return (
    <Card className="group py-0 gap-0 overflow-hidden bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
      {/* Thumbnail Section - Clean without heavy overlays */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          image={event.thumbnail}
          className="object-cover w-full h-full object-center transition-transform duration-300 group-hover:scale-105"
        />

        {/* Light overlay only for readability */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Date Badge - Only minimal overlay */}
        {eventDate && (
          <div className="absolute top-4 left-4">
            <div className="bg-white/95 backdrop-blur-sm text-gray-800 rounded-lg px-3 py-2 text-center shadow-md border border-white/20">
              <div className="text-xl font-bold leading-none text-primary">
                {day}
              </div>
              <div className="text-xs font-medium mt-1 text-gray-600 uppercase">
                {month}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Section - Separated from thumbnail */}
      <div className="p-4 bg-white">
        <h3 className="font-semibold text-lg leading-tight mb-3 text-gray-800 line-clamp-2 group-hover:text-primary transition-colors duration-200">
          <Link href={`/events/${event.slug}`} className="hover:underline">
            {event.name}
          </Link>
        </h3>

        <div className="space-y-2 text-sm text-gray-600">
          <p className="leading-relaxed text-sm line-clamp-3">
            {event.shortDescription}
          </p>

          {event.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 text-primary" />
              <span className="truncate">{event.location}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
