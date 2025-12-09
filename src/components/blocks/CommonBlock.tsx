import { CommonBlock as CommonBlockType } from "@/global";
import { Link } from "@/i18n/navigation";
import { ArrowRight, BookOpen } from "lucide-react";
import CardArticle from "../CardArticle";
import Container from "../Container";
import { Button } from "../ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import Image from "../ui/image";

export default function CommonBlock(data: CommonBlockType<"news">) {
  const displayArticles = data?.articles || [];

  if (displayArticles.length === 0) {
    return null;
  }

  return (
    <section
      className={`overflow-hidden group ${
        data.isBackgroundHighlight ? "bg-blue-100" : ""
      }`}
    >
      <div className="relative">
        {data.backgroundImage && (
          <div className="absolute inset-0">
            <Image
              image={data.backgroundImage}
              className="object-cover w-full h-full object-center"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>
        )}
        <Container className="relative space-y-12 z-10 py-18">
          {/* Section Header */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3">
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
              <div className="relative">
                <h2
                  className={`xl:text-4xl text-3xl uppercase font-bold ${
                    data.backgroundImage ? "text-white" : ""
                  }`}
                >
                  {data.title}
                </h2>
                <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-[3px] bg-gradient-to-r from-red-500/60 to-red-500 rounded-full"></div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent flex-1"></div>
            </div>
            {data.summary && (
              <p
                className={`mt-6 text-base lg:text-md ${
                  data.backgroundImage ? "text-white/90" : ""
                } max-w-2xl mx-auto leading-relaxed`}
              >
                {data.summary}
              </p>
            )}
          </div>
          {/* Events Grid */}
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2 md:-ml-4">
                {data.articles.map((article) => (
                  <CarouselItem
                    key={article.slug}
                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <CardArticle {...article} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 md:-left-12 md:hidden md:group-hover:flex" />
              <CarouselNext className="-right-4 md:-right-12 md:hidden md:group-hover:flex" />
            </Carousel>
          </div>
          {/* View More Link */}
          {data.link && !data.isLinkFullWidth && (
            <div className="text-center">
              <Button
                size="lg"
                asChild
                className="group bg-blue-900 hover:bg-blue-950 text-white hover:text-white"
              >
                <Link
                  href={
                    data.link.isExternal ? data.link.href : `/${data.link.href}`
                  }
                  target={data.link.isExternal ? "_blank" : undefined}
                  rel={data.link.isExternal ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  {data.link.text}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          )}
        </Container>
      </div>
      {/* View More Button */}
      {data.link && data.isLinkFullWidth && (
        <div className="text-center">
          <Button
            asChild
            className="group w-full rounded-none relative bg-blue-900 hover:bg-blue-950 text-white border-blue-900 hover:text-white"
          >
            <Link
              href={data.link.href}
              target={data.link.isExternal ? "_blank" : undefined}
              rel={data.link.isExternal ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2"
            >
              {data.link.text}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      )}
    </section>
  );
}
