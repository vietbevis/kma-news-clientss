import { TagProps } from "@/global";
import { Badge } from "./ui/badge";

export default function Tag(data: TagProps & { className?: string }) {
  if (!data || !data?.text) return null;
  return (
    <Badge
      style={{
        backgroundColor: data.color,
      }}
      className={data.className}
    >
      {data.text}
    </Badge>
  );
}
