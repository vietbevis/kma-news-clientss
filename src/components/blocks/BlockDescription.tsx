import { BlockDescriptionProps } from "@/global";

export default function BlockDescription(
  data: BlockDescriptionProps & { id: number }
) {
  return (
    <div className="mb-12">
      <div className="relative mb-6">
        <h3
          className="text-2xl md:text-3xl uppercase font-bold text-blue-900"
          id={`heading-${data.id}`}
          data-index={data.id}
        >
          {data.title}
        </h3>
        <div className="absolute -bottom-2 w-20 h-1 bg-gradient-to-r from-red-500/60 to-red-500 rounded-full"></div>
      </div>
      <div
        className="prose max-w-none lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: data.content }}
      />
    </div>
  );
}
