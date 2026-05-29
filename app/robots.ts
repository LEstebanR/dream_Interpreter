import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/es/", "/en/"],
        disallow: [
          "/es/journal",
          "/en/journal",
          "/es/profile",
          "/en/profile",
          "/es/billing",
          "/en/billing",
          "/api/",
        ],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL}/sitemap.xml`,
  };
}
