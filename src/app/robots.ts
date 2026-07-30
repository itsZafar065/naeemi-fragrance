import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/naeemi-fragrance-secure-vault-admin-portal",
        "/checkout",
        "/profile",
        "/wishlist",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
