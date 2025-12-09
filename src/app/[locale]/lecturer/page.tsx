import Container from "@/components/Container";
import SidebarNavigation from "@/components/SidebarNavigation";
import StaffGrid from "@/components/StaffGrid";
import { getListStaff, getNavigationBySlug } from "@/data/loader";
import { NavigationItemProps } from "@/global";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function LecturerPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const listStaff = await getListStaff(locale);

  const data = await getNavigationBySlug(locale, "lecturer");

  if (
    !data ||
    !data?.data ||
    !Array.isArray(data.data) ||
    data.data.length === 0
  ) {
    return notFound();
  }

  const navigation = data.data[0] as NavigationItemProps;

  return (
    <Container className="py-4">
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-4 xl:col-span-3">
          <SidebarNavigation {...navigation} />
        </div>
        <div className="col-span-12 lg:col-span-8 xl:col-span-9">
          <StaffGrid listStaff={listStaff.data} />
        </div>
      </div>
    </Container>
  );
}
