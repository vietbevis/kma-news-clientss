import { BlockRenderer } from "@/components/BlockRenderer";
import Container from "@/components/Container";
import Image from "@/components/ui/image";
import { Separator } from "@/components/ui/separator";
import envConfig from "@/config/env-config";
import {
  getDetailEducationalProgram,
  getEducationalProgram,
  getSubjectType,
} from "@/data/loader";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Sidebar from "./Sidebar";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale; slugEP: string }>;
}): Promise<Metadata> => {
  const { locale, slugEP } = await params;
  const data = await getDetailEducationalProgram(locale, slugEP);

  const pageData = data.data[0];

  return {
    title: pageData.name,
    description: pageData.description,
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_APP_URL}/${locale}/educational-program/${slugEP}`,
      languages: {
        "vi-VN": `${envConfig.NEXT_PUBLIC_APP_URL}/vi/educational-program/${slugEP}`,
        "en-US": `${envConfig.NEXT_PUBLIC_APP_URL}/en/educational-program/${slugEP}`,
      },
    },
    openGraph: {
      title: pageData.name,
      description: pageData.description,
      images: [
        {
          url: `${envConfig.NEXT_PUBLIC_APP_URL}${pageData.thumbnail.url}`,
          width: pageData.thumbnail.width,
          height: pageData.thumbnail.height,
          alt: pageData.thumbnail.alternativeText,
        },
      ],
    },
    twitter: {
      title: pageData.name,
      description: pageData.description,
      images: [
        {
          url: `${envConfig.NEXT_PUBLIC_APP_URL}${pageData.thumbnail.url}`,
          width: pageData.thumbnail.width,
          height: pageData.thumbnail.height,
          alt: pageData.thumbnail.alternativeText,
        },
      ],
    },
  };
};

export const generateStaticParams = async ({
  params,
}: {
  params: { locale: Locale };
}) => {
  const { locale } = params;
  const data = await getEducationalProgram(locale);
  return data.data.map((item: any) => ({
    slugEP: item.insertToPage.slug,
  }));
};

export default async function EducationalProgram({
  params,
}: {
  params: Promise<{ locale: Locale; slugEP: string }>;
}) {
  const { locale, slugEP } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Common");

  const data = await getDetailEducationalProgram(locale, slugEP);
  const dataSubjectType = await getSubjectType(locale);

  if (!data) {
    notFound();
  }

  const pageData = data.data[0];

  if (!pageData) {
    notFound();
  }

  const subjectTypeData = dataSubjectType ? dataSubjectType.data : [];
  const headings = pageData.blocks.map((block: any) => block.title) || [];

  return (
    <div className="scroll-pt-10">
      <div className="relative md:h-[400px] h-auto aspect-video md:aspect-auto flex items-center justify-center">
        <div className="absolute inset-0">
          <Image
            image={pageData.thumbnail}
            className="object-cover w-full h-full object-center"
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>
        <Container className="relative z-10 py-12 flex flex-col items-center justify-center gap-3">
          {/* <Breadcrumb>
            <BreadcrumbList className="flex-nowrap">
              <BreadcrumbItem className="text-nowrap whitespace-nowrap inline-block">
                <BreadcrumbLink asChild>
                  <Link href={`/`} className="text-white/80">
                    {t("home")}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/80" />
              <BreadcrumbItem>
                <BreadcrumbPage className="line-clamp-1 text-white">
                  {pageData.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb> */}
          <h1 className="xl:text-6xl lg:text-5xl md:text-4xl text-3xl font-bold text-white text-center">
            {pageData.name}
          </h1>
        </Container>
      </div>
      <Container className="grid max-w-7xl mt-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:-mt-14 lg:-mt-18 z-20 md:mb-10 relative">
        <div className="text-center border border-border bg-white shadow-md flex flex-col p-4 md:p-6 col-span-1">
          <strong className="flex-1 text-xl lg:text-2xl font-semibold flex items-center justify-start">
            {t("industryCode")}
          </strong>
          <Separator className="my-4" />
          <span className="text-blue-900 text-lg lg:text-xl font-bold flex-1 flex items-center justify-start">
            {pageData.industryCode}
          </span>
        </div>
        <div className="text-center border border-border bg-white shadow-md flex flex-col p-4 md:p-6 col-span-1">
          <strong className="flex-1 text-xl lg:text-2xl font-semibold flex items-center justify-start">
            {t("studyTime")}
          </strong>
          <Separator className="my-4" />
          <span className="text-blue-900 text-lg lg:text-xl font-bold flex-1 flex items-center justify-start">
            {pageData.studyTime}
          </span>
        </div>
        <div className="text-center border border-border bg-white shadow-md flex flex-col p-4 md:p-6 col-span-1">
          <strong className="flex-1 text-xl lg:text-2xl font-semibold flex items-center justify-start">
            {t("admissionPeriod")}
          </strong>
          <Separator className="my-4" />
          <span className="text-blue-900 text-lg lg:text-xl font-bold flex-1 flex items-center justify-start">
            {pageData.admissionPeriod}
          </span>
        </div>
        <div className="text-center border border-border bg-white shadow-md flex flex-col p-4 md:p-6 col-span-1">
          <strong className="flex-1 text-xl lg:text-2xl font-semibold flex items-center justify-start">
            {t("facility")}
          </strong>
          <Separator className="my-4" />
          <span className="text-blue-900 text-lg lg:text-xl font-bold flex-1 flex items-center justify-start">
            {pageData.facility}
          </span>
        </div>
      </Container>
      <Container className="py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <Sidebar headings={headings} />
          <div className="lg:col-span-3 col-span-1">
            <BlockRenderer
              blocks={pageData.blocks}
              subjectType={subjectTypeData}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
