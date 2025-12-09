import Container from "@/components/Container";
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
import { getListStaff, getStaffByUsername } from "@/data/loader";
import { StaffProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { Metadata } from "next";
import { Locale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { htmlToText } from "html-to-text";

export async function generateStaticParams({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const data = await getListStaff(locale);
  return data.data.map((item: { username: string }) => ({
    username: item.username,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; username: string }>;
}): Promise<Metadata> {
  const { locale, username } = await params;
  const data = await getStaffByUsername(locale, username);
  const staffData = data.data[0] as StaffProps;
  return {
    title: staffData.displayName,
    description: htmlToText(staffData.position, {
      wordwrap: false,
    }),
    alternates: {
      canonical: `${envConfig.NEXT_PUBLIC_APP_URL}/${locale}/lecturer/${username}`,
      languages: {
        "vi-VN": `${envConfig.NEXT_PUBLIC_APP_URL}/vi/lecturer/${username}`,
        "en-US": `${envConfig.NEXT_PUBLIC_APP_URL}/en/lecturer/${username}`,
      },
    },
    openGraph: {
      title: staffData.displayName,
      description: htmlToText(staffData.position, {
        wordwrap: false,
      }),
      images: [
        {
          url: `${envConfig.NEXT_PUBLIC_APP_URL}${staffData.avatar.url}`,
          width: staffData.avatar.width,
          height: staffData.avatar.height,
          alt: staffData.avatar.alternativeText,
        },
      ],
    },
    twitter: {
      title: staffData.displayName,
      description: htmlToText(staffData.position, {
        wordwrap: false,
      }),
      images: [
        {
          url: `${envConfig.NEXT_PUBLIC_APP_URL}${staffData.avatar.url}`,
          width: staffData.avatar.width,
          height: staffData.avatar.height,
          alt: staffData.avatar.alternativeText,
        },
      ],
    },
  };
}

export default async function StaffPage({
  params,
}: {
  params: Promise<{ locale: Locale; username: string }>;
}) {
  const { locale, username } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Common");
  const data = await getStaffByUsername(locale, username);

  if (!data || !data?.data || data?.data?.length === 0) {
    return notFound();
  }

  const staff = data.data[0] as StaffProps;

  if (!staff) {
    return notFound();
  }

  return (
    <Container className="py-4 pb-20">
      <Breadcrumb className="mb-4">
        <BreadcrumbList className="flex-nowrap">
          <BreadcrumbItem className="text-nowrap whitespace-nowrap inline-block">
            <BreadcrumbLink asChild>
              <Link href={`/lecturer`}>{t("staff")}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {staff.displayName}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-12 space-y-8 lg:space-y-0 lg:space-x-8 items-start">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3 flex flex-col gap-4 lg:sticky lg:top-16">
          <div className="aspect-[3/4] overflow-hidden">
            <Image
              image={staff.avatar}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold uppercase text-blue-900">
              {staff.name}
            </h2>
            {staff.position && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: staff.position }}
              />
            )}
            {staff.phoneNumber && (
              <p>
                <strong>{t("phone")}:</strong>{" "}
                <a href={`tel:${staff.phoneNumber}`}>{staff.phoneNumber}</a>
              </p>
            )}
            {staff.email && (
              <p>
                <strong>Email:</strong>{" "}
                <a href={`mailto:${staff.email}`}>{staff.email}</a>
              </p>
            )}
            {staff.web && (
              <p>
                <strong>Website:</strong>{" "}
                <a href={staff.web} target="_blank">
                  {staff.web}
                </a>
              </p>
            )}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col gap-8">
          {staff.blockDescription.map((item) => (
            <div key={item.id} className="flex flex-col gap-4">
              <div className="relative">
                <h2 className="text-2xl uppercase font-bold">{item.title}</h2>
                <div className="absolute -bottom-2 w-20 h-1 bg-gradient-to-r from-red-500/60 to-red-500 rounded-full"></div>
              </div>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: item.content }}
              />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
