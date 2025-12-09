import { StaffProps } from "@/global";
import { Link } from "@/i18n/navigation";
import Image from "./ui/image";

export default async function StaffGrid({
  listStaff,
}: {
  listStaff: StaffProps[];
}) {
  if (!listStaff || listStaff.length === 0) {
    return null;
  }

  return (
    <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 md:grid-cols-3 gap-4">
      {listStaff.map((item: StaffProps) => (
        <div
          key={item.id}
          className="flex flex-col gap-4 p-2 border border-border rounded-lg shadow hover:shadow-lg transition-shadow"
        >
          <div className="aspect-[3/4] overflow-hidden">
            <Image image={item.avatar} className="w-full h-full object-cover" />
          </div>
          <Link
            href={`/lecturer/${item.username}`}
            className="text-lg font-bold hover:text-blue-900 transition-colors"
          >
            {item.displayName}
          </Link>
        </div>
      ))}
    </div>
  );
}
