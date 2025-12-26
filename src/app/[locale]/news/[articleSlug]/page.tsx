import Container from "@/components/Container";
import RelatedArticles from "@/components/RelatedArticles";
import ShareButton from "@/components/ShareButton";
import TableOfContents from "@/components/TableOfContents";
import Tag from "@/components/Tag";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Image from "@/components/ui/image";
import envConfig from "@/config/env-config";
import { getDetailArticleBySlug, getListArticle } from "@/data/loader";
import { ArticlesProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { checkIsHeading, formatDate, processHeadings } from "@/lib/utils";
import { Clock, User } from "lucide-react";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateStaticParams({
  params,
}: {
  params: { locale: Locale };
}) {
  const { locale } = params;
  const data = await getListArticle(locale);
  return data.data.map((item: { slug: string }) => ({
    articleSlug: item.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale; articleSlug: string };
}): Promise<Metadata> {
  const { locale, articleSlug } = params;
  const data = await getDetailArticleBySlug(locale, articleSlug);
  const articleData = data.data[0] as ArticlesProps;
  return {
    title: articleData.title,
    description: articleData.shortDescription,
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_APP_URL}/${locale}/news/${articleSlug}`,
      languages: {
        "vi-VN": `${envConfig.NEXT_PUBLIC_APP_URL}/vi/news/${articleSlug}`,
        "en-US": `${envConfig.NEXT_PUBLIC_APP_URL}/en/news/${articleSlug}`,
      },
    },
    openGraph: {
      title: articleData.title,
      description: articleData.shortDescription,
      images: [
        {
          url: `${envConfig.NEXT_PUBLIC_APP_URL}${articleData.thumbnail.url}`,
          width: articleData.thumbnail.width,
          height: articleData.thumbnail.height,
          alt: articleData.thumbnail.alternativeText,
        },
      ],
    },
    twitter: {
      title: articleData.title,
      description: articleData.shortDescription,
      images: [
        {
          url: `${envConfig.NEXT_PUBLIC_APP_URL}${articleData.thumbnail.url}`,
          width: articleData.thumbnail.width,
          height: articleData.thumbnail.height,
          alt: articleData.thumbnail.alternativeText,
        },
      ],
    },
  };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: Locale; articleSlug: string }>;
}) {
  const { locale, articleSlug } = await params;
  setRequestLocale(locale);
  const data = await getDetailArticleBySlug(locale, articleSlug);
  const t = await getTranslations("Common");

  if (!data || data.data.length === 0) {
    return notFound();
  }

  const article = data.data[0];

  if (!article) {
    return notFound();
  }

  const isHeading = checkIsHeading(article.content);
  const isContentOnly =
    !isHeading &&
    (!article.relatedArticles || article.relatedArticles.length === 0);

  return (
    <Container className="py-4">
      <div className="grid grid-cols-12 gap-6">
        <div
          className={` ${
            isContentOnly
              ? "xl:col-start-2 lg:col-start-1 lg:col-span-12 xl:col-span-10 col-span-12"
              : "lg:col-span-8 xl:col-span-9 col-span-12"
          }`}
        >
          {article.insertToPage && article.insertToPage.length > 0 && (
            <Breadcrumb className="mb-3">
              <BreadcrumbList className="flex-nowrap">
                <BreadcrumbItem className="text-nowrap whitespace-nowrap inline-block">
                  <BreadcrumbLink asChild>
                    <Link href={`/${article.insertToPage[0]?.slug}`}>
                      {article.insertToPage[0]?.text}
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="line-clamp-1">
                    {article.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          )}
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>{article.tag && <Tag {...article.tag} />}</div>
              <div className="flex items-center gap-2">
                <ShareButton
                  url={`${envConfig.NEXT_PUBLIC_APP_URL}/news/${article.slug}`}
                  type="facebook"
                />
                <ShareButton
                  url={`${envConfig.NEXT_PUBLIC_APP_URL}/news/${article.slug}`}
                  type="twitter"
                />
                <ShareButton
                  url={`${envConfig.NEXT_PUBLIC_APP_URL}/news/${article.slug}`}
                  type="linkedin"
                />
                <ShareButton
                  url={`${envConfig.NEXT_PUBLIC_APP_URL}/news/${article.slug}`}
                  type="email"
                />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              {article.title}
            </h1>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {article.shortDescription}
            </p>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {article.author && (
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t("author")}:
                    <Link
                      href={`/lecturer/${article.author.username}`}
                      className="text-blue-900 hover:text-blue-950 transition-colors"
                    >
                      {article.author.displayName}
                    </Link>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {t("updatedAt")}: {formatDate(article.publishedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {isHeading && (
            <TableOfContents
              id={"mobile"}
              className="mb-8 block lg:hidden"
              collapseDepth={6}
            />
          )}
          <div className="mb-8">
            <Image
              image={article.thumbnail}
              className="w-full h-auto rounded-lg shadow-lg aspect-video object-cover"
            />
          </div>
          <article
            className={`prose max-w-none w-full ${
              isHeading ? "js-toc-content" : ""
            }`}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: processHeadings(article.content),
              }}
            />
          </article>
        </div>
        <div
          className={`${
            isContentOnly ? "hidden" : "lg:col-span-4 xl:col-span-3 col-span-12"
          }`}
        >
          <div className="sticky top-16 flex flex-col gap-4">
            {isHeading && (
              <TableOfContents
                id={"desktop"}
                className=" lg:flex hidden"
                collapseDepth={6}
              />
            )}
            {article.relatedArticles && article.relatedArticles.length > 0 && (
              <RelatedArticles relatedArticles={article.relatedArticles} />
            )}
          </div>
        </div>
      </div>
    </Container>
  );
}
