import { ArticlesProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "./ui/image";

export default async function RelatedArticles({
  relatedArticles,
}: {
  relatedArticles: ArticlesProps[];
}) {
  const t = await getTranslations("RelatedArticles");
  return (
    <Card className="p-0 overflow-hidden gap-0">
      <CardHeader className="bg-blue-900 text-white gap-0 px-4 py-2">
        <CardTitle className="text-xl font-semibold">
          {t("relatedArticles")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-2">
        {relatedArticles.map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="group"
          >
            <div className="flex gap-2 sm:gap-4 items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className="flex-shrink-0 size-16 sm:size-20 overflow-hidden rounded-md">
                <Image
                  image={article.thumbnail}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-md font-medium mb-1 line-clamp-2 group-hover:text-blue-900 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {article.shortDescription}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
