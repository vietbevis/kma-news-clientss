import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "https",
        hostname: "cntt.actvn.edu.vn",
      },
    ],
  },
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: false,
      hmrRefreshes: true,
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
