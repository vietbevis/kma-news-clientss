import ArticleGrid from "@/components/ArticleGrid";
import Container from "@/components/Container";
import SidebarNavigation from "@/components/SidebarNavigation";
import envConfig from "@/config/env-config";
import {
  getAllNavigation,
  getListArticleByNavigationId,
  getNavigationBySlug,
} from "@/data/loader";
import { NavigationItemProps } from "@/global";
import { redirect } from "@/i18n/navigation";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export const generateStaticParams = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) => {
  const { locale } = await params;
  const data = await getAllNavigation(locale);
  return data.data
    .filter(
      (item: any) =>
        item.slug !== "home" &&
        item.slug !== "educational-program" &&
        item.navigation?.slug !== "educational-program" &&
        item.slug !== "lecturer"
    )
    .map((item: any) => ({
      pageSlug: item.slug,
    }));
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; pageSlug: string }>;
}): Promise<Metadata> {
  const { locale, pageSlug } = await params;

  const data = await getNavigationBySlug(locale, pageSlug);

  const navigation = data.data[0] as NavigationItemProps;

  return {
    title: navigation.text,
    description: navigation.text,
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_APP_URL}/${locale}/${pageSlug}`,
      languages: {
        "vi-VN": `${envConfig.NEXT_PUBLIC_APP_URL}/vi/${pageSlug}`,
        "en-US": `${envConfig.NEXT_PUBLIC_APP_URL}/en/${pageSlug}`,
      },
    },
    openGraph: {
      title: navigation.text,
      description: navigation.text,
    },
    twitter: {
      title: navigation.text,
      description: navigation.text,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale; pageSlug: string }>;
}) {
  const { locale, pageSlug } = await params;
  setRequestLocale(locale);

  const data = await getNavigationBySlug(locale, pageSlug);

  if (
    !data ||
    !data?.data ||
    !Array.isArray(data.data) ||
    data.data.length === 0
  ) {
    return notFound();
  }

  const navigation = data.data[0] as NavigationItemProps;

  if (!navigation.navigation && navigation.navigations.length === 0) {
    return notFound();
  }

  if (
    navigation.slug === "educational-program" ||
    navigation.navigation?.slug === "educational-program"
  ) {
    return notFound();
  }

  // Chuyển đến trang con đầu tiên khi vào trang cha
  const firstChild = navigation.navigations[0];
  if (firstChild) {
    redirect({
      href:
        firstChild.slug === "home"
          ? "/"
          : navigation.slug === "educational-program"
          ? `/educational-program/${firstChild.slug}`
          : firstChild.slug,
      locale,
    });
  }

  const listArticle = await getListArticleByNavigationId(locale, navigation.id);

  return (
    <Container className="py-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <SidebarNavigation {...navigation} />
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          {navigation.pageType === "news" && listArticle && (
            <ArticleGrid listArticle={listArticle.data} />
          )}
          {navigation.pageType === "single" && (
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{
                __html: navigation.singlePageContent,
              }}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
