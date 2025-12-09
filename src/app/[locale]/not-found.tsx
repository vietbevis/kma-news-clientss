import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFoundPage");

  return (
    <div className="py-20 bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <CardTitle className="text-6xl font-bold text-gray-900 mb-2">
            404
          </CardTitle>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t("title")}
          </CardTitle>
          <CardDescription className="text-gray-600 mt-2">
            {t("description")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button asChild className="w-full" variant="default">
            <Link href="/">{t("goHome")}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
