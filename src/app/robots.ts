import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/utils";

/** Robots d'IA et moteurs autorisés explicitement (le contenu est public et destiné à être cité). */
const AI_BOTS = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-User", "Claude-SearchBot", "PerplexityBot", "Google-Extended", "Applebot-Extended", "Bingbot", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/admin"] },
      { userAgent: AI_BOTS, allow: "/", disallow: ["/admin"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
