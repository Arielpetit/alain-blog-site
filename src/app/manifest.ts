import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/db";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const p = await getProfile();
  return {
    name: p.name,
    short_name: "Dr Gnassoumari",
    description: p.bioShort,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf7",
    theme_color: "#14233a",
    lang: "fr",
    icons: [
      { src: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192", purpose: "any" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512", purpose: "any" },
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/apple-icon", type: "image/png", sizes: "180x180" },
    ],
  };
}
