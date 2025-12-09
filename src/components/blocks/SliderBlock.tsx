"use client";

import { SliderBlockProps } from "@/global";
import { Link } from "@/i18n/navigation";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import Tag from "../Tag";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "../ui/image";

export default function SliderBlock(data: SliderBlockProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const t = useTranslations("Common");

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (data.articles.length === 0) {
    return null;
  }

  return (
    <section
      className={`relative pb-8 group ${
        data.isBackgroundHighlight ? "bg-blue-100" : ""
      }`}
    >
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 5000,
          }),
          Fade(),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {data.articles.map((article, index) => (
            <CarouselItem key={article.slug}>
              <div className="relative h-[400px] xl:h-[550px] overflow-hidden">
                {/* Background Image */}
                <Image
                  image={article.thumbnail}
                  className="object-cover w-full h-full"
                  priority={index === 0}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-2xl">
                      {/* Tag */}
                      <div className="mb-4">
                        <Tag
                          {...article.tag}
                          className="bg-background/90 backdrop-blur-sm text-sm px-3 py-1"
                        />
                      </div>

                      {/* Title */}
                      <h1 className="text-2xl md:text-3xl line-clamp-3 lg:text-4xl font-bold text-white mb-4 leading-tight">
                        {article.title}
                      </h1>

                      {/* Description */}
                      <p className="text-sm sm:text-md md:text-lg text-white/90 mb-8 leading-relaxed line-clamp-3">
                        {article.shortDescription}
                      </p>

                      {/* CTA Button */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          size="lg"
                          asChild
                          className="group bg-blue-900 hover:bg-blue-950"
                        >
                          <Link href={`/news/${article.slug}`}>
                            {t("readMore")}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="hidden md:group-hover:flex absolute left-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-background/30" />
        <CarouselNext className="hidden md:group-hover:flex absolute right-4 top-1/2 -translate-y-1/2 bg-background/20 backdrop-blur-sm border-white/20 text-white hover:bg-background/30" />

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index + 1 === current
                  ? "bg-white scale-110"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </Carousel>

      {/* Thumbnail Preview */}
      <div className="hidden lg:block absolute bottom-6 right-6">
        <div className="flex space-x-2">
          {data.articles.slice(0, 3).map((article, index) => (
            <button
              key={article.slug}
              className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                index + 1 === current
                  ? "ring-2 ring-white scale-110"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => api?.scrollTo(index)}
            >
              <Image image={article.thumbnail} className="object-cover" />
              <div className="absolute inset-0 bg-black/20" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
