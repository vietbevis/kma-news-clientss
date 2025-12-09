import { ArticlesProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Tag from "./Tag";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "./ui/image";

export default async function CardArticle(article: ArticlesProps) {
  const t = await getTranslations("Common");

  return (
    <Card key={article.slug} className="overflow-hidden py-0 gap-4 relative">
      <div className="aspect-video relative overflow-hidden">
        <Image
          image={article.thumbnail}
          className="object-cover w-full h-full transition-transform hover:scale-105"
        />
      </div>
      <div className="space-y-4 pb-3 px-4">
        <div className="absolute top-1.5 left-2">
          <Tag {...article.tag} className="text-xs" />
        </div>
        <CardHeader className="px-0 gap-0">
          <CardTitle className="line-clamp-2 overflow-hidden text-lg leading-tight">
            <Link href={`/news/${article.slug}`} className="hover:underline">
              {article.title}
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 px-0">
          <CardDescription className="line-clamp-3 overflow-hidden text-sm leading-relaxed">
            {article.shortDescription}
          </CardDescription>
          <div className="mt-4">
            <Link
              href={`/news/${article.slug}`}
              className="text-sm font-medium hover:underline inline-flex items-center gap-1"
            >
              {t("readMore")}
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
