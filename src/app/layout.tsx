import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Inter, Source_Serif_4 } from "next/font/google";
import { SITE_URL } from "@/lib/utils";
import { isLocale } from "@/i18n/config";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif-display",
  display: "swap",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Google exige un favicon en multiple de 48 px : PNG 48 px + ICO + SVG.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  // Balise de vérification Search Console (facultative : la vérification DNS suffit aussi).
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0b111a" },
  ],
};

/** Applique le thème avant le premier rendu (aucun flash). */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme')||'light';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const h = (await headers()).get("x-locale");
  const lang = isLocale(h) ? h : "fr";
  return (
    <html lang={lang} className={`${inter.variable} ${serif.variable}`} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-dvh">
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
