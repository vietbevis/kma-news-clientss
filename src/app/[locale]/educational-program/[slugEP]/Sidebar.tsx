"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export default function Sidebar({ headings }: { headings: string[] }) {
  const [activeSection, setActiveSection] = useState<number>(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const t = useTranslations("Common");

  useEffect(() => {
    observer.current?.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            setActiveSection(index);
          }
        });
      },
      {
        root: null,
        rootMargin: "-72px 0px -70% 0px",
        threshold: 0,
      }
    );

    headings.forEach((_, idx) => {
      const el = document.getElementById(`heading-${idx}`);
      if (el) observer.current!.observe(el);
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [headings]);

  return (
    <div className="lg:sticky top-16 mb-8 col-span-1">
      <h3 className="font-semibold text-blue-900 text-xl uppercase tracking-wide mb-4">
        {t("content")}
      </h3>
      <div className="flex flex-col">
        {headings.map((heading, index) => (
          <Link
            key={index}
            href={`#heading-${index}`}
            className={`
              text-left text-sm py-3 px-4 uppercase border-l-4 transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:bg-gray-50
              ${
                activeSection === index
                  ? "text-blue-900 font-semibold border-l-blue-900 bg-blue-50"
                  : "text-gray-600 border-l-gray-200 hover:border-l-gray-300 hover:text-gray-800"
              }
            `}
          >
            <span className="line-clamp-2">{heading}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
