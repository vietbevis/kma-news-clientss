import { BlockRenderer } from "@/components/BlockRenderer";
import { getHomePage } from "@/data/loader";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const { data } = await getHomePage(locale);
  return <BlockRenderer blocks={data.blocks} />;
}
