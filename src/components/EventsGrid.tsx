import { EventProps } from "@/global";
import { cn } from "@/lib/utils";
import CardEvent from "./CardEvent";

export default async function EventsGrid({
  listEvent,
  className,
}: {
  listEvent: EventProps[];
  className?: string;
}) {
  if (!listEvent || listEvent.length === 0) {
    return null;
  }
  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-12",
        className
      )}
    >
      {listEvent.map((event: EventProps) => (
        <CardEvent key={event.slug} {...event} />
      ))}
    </div>
  );
}
