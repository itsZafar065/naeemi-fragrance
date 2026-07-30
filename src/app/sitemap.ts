import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site-url";

const routes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/shop", priority: 0.9, changeFrequency: "daily" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.6, changeFrequency: "monthly" },
  { path: "/shipping-policy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/returns-exchange", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy-policy", priority: 0.4, changeFrequency: "yearly" },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
