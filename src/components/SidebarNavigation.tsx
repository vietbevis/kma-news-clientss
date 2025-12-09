import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationItemProps } from "@/global";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";
import { Button } from "./ui/button";

export default function SidebarNavigation(data: NavigationItemProps) {
  return (
    <Card className="p-0 overflow-hidden gap-2 sticky top-15">
      <CardHeader className="border-b border-border !py-3 px-4 bg-blue-900 text-white gap-0">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileText className="h-5 w-5 text-white" />
          {data.navigation?.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <nav className="flex flex-col gap-2">
          {data.navigation?.navigations?.map((item) => {
            const isActive = item.slug === data.slug;
            return (
              <Button
                key={item.slug}
                asChild
                variant="ghost"
                className="w-full"
              >
                <Link
                  href={`/${
                    item.slug === "home"
                      ? ""
                      : item.slug === "educational-program"
                      ? `educational-program/${item.navigations[0].slug}`
                      : item.slug
                  }`}
                  className={cn(
                    isActive
                      ? "text-blue-900 hover:text-blue-900 bg-accent"
                      : ""
                  )}
                >
                  <span className="flex-1 text-left">{item.text}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </CardContent>
    </Card>
  );
}
