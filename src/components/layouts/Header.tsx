"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LogoProps, NavigationProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Locale } from "next-intl";
import { useState } from "react";
import LanguageSwitcher from "../LanguageSwitcher";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Image from "../ui/image";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar";

interface HeaderProps {
  title: string;
  subTitle: string;
  logo: LogoProps;
  navigations: NavigationProps[];
  locale: Locale;
  facultyWork?: {
    text: string;
    href: string;
    isExternal: boolean;
  };
}

export default function Header({
  title,
  subTitle,
  logo,
  navigations,
  locale,
  facultyWork,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Recursive function to render desktop navigation
  const renderDesktopNavigation = (
    items: NavigationProps[]
  ): React.ReactNode => {
    return items.map((item) => {
      // Case 1: No children - render as simple button/link
      if (!item.navigations || item.navigations.length === 0) {
        return (
          <Button key={item.text} variant="ghost" asChild size="sm">
            <Link
              href={`/${
                item.slug === "home"
                  ? ""
                  : item.navigation?.slug === "educational-program"
                  ? `educational-program/${item.slug}`
                  : item.slug
              }`}
              className="cursor-pointer"
              locale={locale}
            >
              {item.text}
            </Link>
          </Button>
        );
      }

      // Case 2: Has children - render as dropdown menu
      return (
        <MenubarMenu key={item.text}>
          <MenubarTrigger className="cursor-pointer h-8 px-3 hover:bg-accent hover:text-accent-foreground">
            {item.text}
          </MenubarTrigger>
          <MenubarContent>{renderMenuItems(item.navigations)}</MenubarContent>
        </MenubarMenu>
      );
    });
  };

  // Separate function to handle menu items recursively
  const renderMenuItems = (items: NavigationProps[]): React.ReactNode => {
    return items.map((item) => {
      // No children - render as menu item
      if (!item.navigations || item.navigations.length === 0) {
        return (
          <MenubarItem key={item.text} asChild>
            <Link
              href={`/${
                item.slug === "home"
                  ? ""
                  : item.navigation?.slug === "educational-program"
                  ? `educational-program/${item.slug}`
                  : item.slug
              }`}
              className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
              locale={locale}
            >
              {item.text}
            </Link>
          </MenubarItem>
        );
      }

      // Has children - render as submenu
      return (
        <MenubarSub key={item.text}>
          <MenubarSubTrigger className="cursor-pointer hover:bg-accent hover:text-accent-foreground">
            {item.text}
          </MenubarSubTrigger>
          <MenubarSubContent>
            {renderMenuItems(item.navigations)}
          </MenubarSubContent>
        </MenubarSub>
      );
    });
  };

  // Recursive function to render mobile navigation
  const renderMobileNavigation = (
    items: NavigationProps[],
    level = 0
  ): React.ReactNode => {
    return items.map((item, index) => {
      if (!item.navigations || item.navigations.length === 0) {
        return (
          <div key={item.text} className={cn(level > 0 ? "pl-4" : "")}>
            <Button
              variant="ghost"
              className="justify-start w-full px-3"
              onClick={() => setIsOpen(false)}
              asChild
            >
              <Link
                href={`/${
                  item.slug === "home"
                    ? ""
                    : item.navigation?.slug === "educational-program"
                    ? `educational-program/${item.slug}`
                    : item.slug
                }`}
                locale={locale}
              >
                {item.text}
              </Link>
            </Button>
          </div>
        );
      }

      return (
        <div key={item.text}>
          <AccordionItem value={`${level}-${index}`}>
            <Button asChild variant="ghost" className="justify-start w-full">
              <AccordionTrigger className="text-left hover:no-underline justify-between">
                {item.text}
              </AccordionTrigger>
            </Button>
            <AccordionContent className={cn(level > 0 ? "pl-4" : "", "pb-0")}>
              {renderMobileNavigation(item.navigations, level + 1)}
            </AccordionContent>
          </AccordionItem>
        </div>
      );
    });
  };

  return (
    <>
      <header className="w-full bg-white shadow-md">
        {/* Header Top */}
        <div className="bg-blue-900 text-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-2">
              {/* Logo and University Name */}
              <Link
                href={"/"}
                className="flex items-center space-x-4 hover:no-underline"
                locale={locale}
              >
                <div className="flex-shrink-0 sm:size-12 size-10">
                  <Image image={logo.image} />
                </div>
                <div>
                  <h1 className="text-sm md:text-lg font-bold">{title}</h1>
                  <p className="text-xs md:text-sm text-blue-200">{subTitle}</p>
                </div>
              </Link>
              {/* Language Switcher and Mobile Menu */}
              <div className="flex items-center">
                {/* Language Switcher */}
                <LanguageSwitcher locale={locale} />
                {/* Mobile Menu Button */}
                <div className="lg:hidden">
                  <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-transparent hover:text-white hover:cursor-pointer"
                      >
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="gap-2" side="right">
                      <SheetHeader className="gap-0 px-5 py-3 border-b">
                        <SheetTitle className="mb-0">Menu</SheetTitle>
                        <SheetDescription className="hidden"></SheetDescription>
                      </SheetHeader>
                      <div className="overflow-y-auto max-h-[calc(100vh-80px)] px-2">
                        <Accordion type="multiple" className="w-full">
                          {renderMobileNavigation(navigations)}
                        </Accordion>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Header Bottom - Navigation */}
      <div className="bg-white border-b h-11 hidden lg:block sticky top-0 z-50 shadow">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-1.5">
            <Menubar className="border-none bg-transparent p-0 h-auto shadow-none">
              {renderDesktopNavigation(navigations)}
            </Menubar>
	    {facultyWork && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hover:text-blue-950"
              >
                <Link
                  href={facultyWork.href}
                  target={facultyWork.isExternal ? "_blank" : "_self"}
                  className="text-sm text-blue-900 font-medium"
                >
                  {facultyWork.text}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
