import {
  ContactProps,
  CopyRightProps,
  LogoProps,
  QuickLinksProps,
} from "@/global";
import { Link } from "@/i18n/navigation";
import { Mail, MapPin, Phone } from "lucide-react";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import SocialLink from "../SocialLink";
import Image from "../ui/image";

interface FooterProps {
  contact: ContactProps;
  description: string;
  logo: LogoProps;
  title: string;
  subTitle: string;
  quickLinks: QuickLinksProps;
  copyRight: CopyRightProps;
}

export default async function Footer(data: FooterProps & { locale: Locale }) {
  const t = await getTranslations("Footer");

  return (
    <footer className="bg-blue-900 text-white border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <Link href={data.logo.href} className="inline-block mb-4">
              <div className="flex items-center gap-3">
                <Image
                  image={data.logo.image}
                  className="rounded-full size-16"
                />
                <div>
                  <h3 className="font-bold text-lg">{data.title}</h3>
                  <p className="text-sm text-white">{data.subTitle}</p>
                </div>
              </div>
            </Link>

            <p className="text-white text-sm leading-relaxed mb-6">
              {data.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{t("followUs")}</span>
              {data.contact.socialLinks.map((social) => (
                <SocialLink key={social.link.id} {...social} />
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-lg mb-6">{t("contactInfo")}</h4>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">{t("address")}</p>
                  <p className="text-white text-sm leading-relaxed">
                    {data.contact.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">{t("phone")}</p>
                  <Link
                    href={`tel:${data.contact.phoneNumber}`}
                    className="text-white text-sm"
                  >
                    {data.contact.phoneNumber}
                  </Link>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm mb-1">{t("email")}</p>
                  <Link
                    href={`mailto:${data.contact.email}`}
                    className="text-white text-sm"
                  >
                    {data.contact.email}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Google Maps */}
          <div className="lg:col-span-1">
            <h4 className="font-semibold text-lg mb-6">{t("map")}</h4>

            <div className="relative w-full h-64 rounded-lg overflow-hidden border bg-muted/50">
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: data.contact.googleMap }}
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="border-t mt-12 pt-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {data.quickLinks.map((quickLink) => (
              <div key={quickLink.slug}>
                <h5 className="font-semibold mb-4">{quickLink.text}</h5>
                <ul className="space-y-2 text-sm">
                  {quickLink.navigations.map((navigation) => (
                    <li key={navigation.slug}>
                      <Link
                        href={
                          navigation.slug === "educational-program"
                            ? `/educational-program/${navigation.navigations[0].slug}`
                            : `/${navigation.slug}`
                        }
                        locale={data.locale}
                        className="text-white"
                      >
                        {navigation.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              {data.copyRight.text}
            </p>
            <div className="flex items-center gap-6 text-sm flex-wrap justify-center">
              {data.copyRight.links.map((link) => (
                <Link key={link.id} href={link.href} className="text-white">
                  {link.text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
