import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL!;
  const locales = ["es", "en"];
  const publicRoutes = ["", "/pricing", "/sign-in", "/sign-up", "/support", "/privacy", "/terms"];

  return locales.flatMap((locale) =>
    publicRoutes.map((route) => ({
      url: `${base}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1.0 : 0.8,
    }))
  );
}
