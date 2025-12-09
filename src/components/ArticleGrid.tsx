import { ArticlesProps } from "@/global";
import { cn } from "@/lib/utils";
import CardArticle from "./CardArticle";

export default async function ArticleGrid({
  listArticle,
  className,
}: {
  listArticle: ArticlesProps[];
  className?: string;
}) {
  if (!listArticle || listArticle.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-12",
        className
      )}
    >
      {listArticle.map((article: ArticlesProps) => (
        <CardArticle key={article.slug} {...article} />
      ))}
    </div>
  );
}
