"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      reset();
    }, 2000);
  };

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Máy chủ đang bảo trì</title>
      </head>
      <body className="m-0 p-0 font-sans">
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full space-y-6">
            {/* Main Error Card */}
            <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                {/* Icon Container */}
                <div className="relative mx-auto w-fit mb-4">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center">
                    <Settings
                      className="w-10 h-10 text-orange-500 animate-spin"
                      style={{ animationDuration: "3s" }}
                    />
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge
                      variant="destructive"
                      className="w-8 h-8 rounded-full p-0 flex items-center justify-center"
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold text-slate-800">
                  Máy chủ đang bảo trì
                </CardTitle>

                <CardDescription className="text-base leading-relaxed">
                  Chúng tôi đang thực hiện bảo trì hệ thống để cải thiện trải
                  nghiệm của bạn. Vui lòng thử lại sau ít phút.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Status Alert */}
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertDescription className="text-orange-700 font-medium">
                    Đang xử lý{dots}
                  </AlertDescription>
                </Alert>

                {/* Retry Button */}
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full text-white font-semibold bg-blue-900 hover:bg-blue-950 hover:text-white"
                  size="lg"
                >
                  <RefreshCw
                    className={`w-4 h-4 mr-2 ${
                      isRetrying ? "animate-spin" : ""
                    }`}
                  />
                  {isRetrying ? "Đang thử lại..." : "Thử lại"}
                </Button>

                {/* Additional Info */}
                <div className="pt-4 border-t border-slate-100 text-center">
                  <p className="text-sm text-slate-500 mb-2">
                    Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ bộ phận hỗ trợ
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Status Indicators */}
            <div className="flex justify-center gap-4">
              <Badge variant="outline" className="bg-white/50">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                Hệ thống cơ sở dữ liệu
              </Badge>
              <Badge variant="outline" className="bg-white/50">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse" />
                Máy chủ web
              </Badge>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
