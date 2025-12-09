import * as cheerio from "cheerio";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { Locale as DateLocale, enUS, vi } from "date-fns/locale";
import { Locale } from "next-intl";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LOCALES: Record<Locale, DateLocale> = {
  en: enUS,
  vi: vi,
};

/**
 * Format ngày giờ theo locale và pattern tuỳ chọn.
 *
 * @param date        - Date object, ISO string hoặc timestamp
 * @param pattern     - date-fns format pattern
 * @param localeCode  - Mã locale, hỗ trợ 'en' và 'vi'
 * @returns           - Chuỗi ngày giờ đã format
 */
export function formatDate(
  date: Date | string | number,
  pattern = "dd/MM/yyyy",
  localeCode: Locale = "vi"
): string {
  try {
    // Chuyển input thành Date instance
    const d =
      date instanceof Date
        ? date
        : typeof date === "number" || /^\d+$/.test(String(date))
        ? new Date(Number(date))
        : new Date(date);

    // Kiểm tra date hợp lệ
    if (isNaN(d.getTime())) {
      return "";
    }

    // Lấy locale tương ứng
    const locale = LOCALES[localeCode] || enUS;

    // Format và trả về
    return format(d, pattern, { locale });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}

/**
 * Format ngày cho badge hiển thị
 */
export function formatDateBadge(
  date: Date | string | number,
  localeCode: Locale = "vi"
) {
  const day = formatDate(date, "dd", localeCode);
  const month = formatDate(date, "MMM", localeCode);
  return { day, month };
}

/**
 * Format thời gian cho event detail
 */
export function formatEventTime(
  date: Date | string | number,
  localeCode: Locale = "vi"
) {
  return formatDate(date, "HH:mm - dd/MM/yyyy", localeCode);
}

export function processHeadings(html: string) {
  const $ = cheerio.load(html);
  $("h1, h2, h3, h4, h5, h6").each((i, el) => {
    const heading = $(el);
    if (!heading.attr("id")) {
      const text = heading.text();
      const id = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      heading.attr("id", id || `heading-${i}`);
    }
  });
  return $.html();
}

export function formatDateRange(startDate: string, endDate: string) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const startFormatted = start.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const endFormatted = end.toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  if (startFormatted === endFormatted) {
    return `${startFormatted} (${start.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })} - ${end.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })})`;
  }

  return `${startFormatted} - ${endFormatted}`;
}

export function checkIsHeading(html: string) {
  const $ = cheerio.load(html);
  return $("h1, h2, h3, h4, h5, h6").length > 0;
}
