"use client";

import { Link, usePathname } from "@/i18n/navigation";
import { ChevronDown, Globe } from "lucide-react";
import { Locale } from "next-intl";
import { ReadonlyURLSearchParams } from "next/navigation";
import { useState } from "react";
import SearchParamsLoader from "./SearchParamsLoader";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LanguageSwitcherProps {
  locale: Locale;
}

const buildFullUrl = (
  pathname: string,
  searchParams: ReadonlyURLSearchParams | undefined
) => {
  if (!searchParams || searchParams.size === 0) return pathname;
  return `${pathname}?${searchParams.toString()}`;
};

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [searchParams, setSearchParams] = useState<ReadonlyURLSearchParams>();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="hover:bg-blue-950 hover:text-white hover:cursor-pointer sm:size-auto size-10"
        >
          <Globe className="h-4 w-4 sm:mr-2 mr-0" />
          <span className="hidden sm:inline">
            {locale === "vi" ? "Tiếng Việt" : "English"}
          </span>
          <ChevronDown className="h-4 w-4 ml-2 hidden sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-(--radix-dropdown-menu-trigger-width)"
      >
        <SearchParamsLoader onParamsReceived={setSearchParams} />
        <DropdownMenuItem asChild>
          <Link href={buildFullUrl(pathname, searchParams)} locale="vi">
            <span className="mr-2">🇻🇳</span>
            Tiếng Việt
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={buildFullUrl(pathname, searchParams)} locale="en">
            <span className="mr-2">🇺🇸</span>
            English
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
