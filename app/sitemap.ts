import type { MetadataRoute } from "next";

const routes = ["", "/listings", "/agents", "/open-houses", "/neighborhoods", "/market", "/for-realtors", "/financing", "/about", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `https://90210estate.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/listings" ? "daily" : "weekly",
    priority: route === "" ? 1 : route === "/listings" ? 0.9 : 0.7,
  }));
}
