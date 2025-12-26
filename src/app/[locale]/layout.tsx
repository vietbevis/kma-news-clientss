import Footer from "@/components/layouts/Footer";
import Header from "@/components/layouts/Header";
import ScrollTop from "@/components/SrollTop";
import envConfig from "@/config/env-config";
import { getGlobalSetiings } from "@/data/loader";
import { routing } from "@/i18n/routing";
import { Metadata } from "next";
import { Locale, NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Roboto, Roboto_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const { data } = await getGlobalSetiings(locale);
  return {
    title: data.title,
    description: data.subTitle,
    openGraph: {
      title: data.title,
      description: data.subTitle,
      images: [
        {
          url: `${envConfig.NEXT_PUBLIC_APP_URL}${data.header.logo.image.url}`,
          width: data.header.logo.image.width,
          height: data.header.logo.image.height,
          alt: data.header.logo.image.alternativeText,
        },
      ],
    },
    icons: {
      icon: `${envConfig.NEXT_PUBLIC_APP_URL}${data.favicon.url}`,
    },
  };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const { data } = await getGlobalSetiings(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header {...data.header} locale={locale} />
          <main className="max-w-[2400px] mx-auto flex-1 w-full">
            {children}
          </main>
          <Footer {...data.footer} locale={locale} />
          <ScrollTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
