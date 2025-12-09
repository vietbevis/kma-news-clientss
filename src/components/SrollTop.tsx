"use client";

import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      className={`
        fixed md:bottom-6 md:right-6 bottom-2 right-2 z-50
        transition-all duration-300 ease-in-out
        ${
          visible
            ? "opacity-100 scale-100"
            : "opacity-0 scale-75 pointer-events-none"
        }
      `}
    >
      <Button
        onClick={scrollToTop}
        className="rounded-full border-2 border-white bg-blue-900 text-white shadow-lg hover:bg-blue-900/90 dark:bg-blue-900 dark:hover:bg-blue-900/90"
        aria-label="Scroll to top"
        size="icon"
      >
        <ArrowUp className="size-5" />
      </Button>
    </div>
  );
}
