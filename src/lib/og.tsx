import { ImageResponse } from "next/og";
import { LOGO_SVG } from "@/components/shared/Logo";

export const OG_SIZE = { width: 1200, height: 630 };

/** Police de titrage (Source Serif 4) — repli sur la police par défaut si indisponible. */
async function serif(weight: 400 | 600) {
  try {
    const css = await (await fetch(`https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@${weight}`)).text();
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null;
  }
}

/** Image de partage (Open Graph / X) aux couleurs du site. */
export async function brandImage({ eyebrow, title, subtitle, footer }: { eyebrow: string; title: string; subtitle: string; footer: string }) {
  const [regular, semibold] = await Promise.all([serif(400), serif(600)]);
  const logo = `data:image/svg+xml;base64,${Buffer.from(LOGO_SVG).toString("base64")}`;
  const fonts = [
    ...(regular ? [{ name: "Serif", data: regular, weight: 400 as const, style: "normal" as const }] : []),
    ...(semibold ? [{ name: "Serif", data: semibold, weight: 600 as const, style: "normal" as const }] : []),
  ];
  const size = title.length > 80 ? 50 : title.length > 34 ? 62 : 76;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0f1a2b 0%, #1b2b44 60%, #22324d 100%)",
          color: "#f3ead9",
          position: "relative",
        }}
      >
        <div style={{ position: "absolute", right: 72, top: 64, width: 120, height: 120, borderTop: "2px solid rgba(201,154,78,0.6)", borderRight: "2px solid rgba(201,154,78,0.6)", display: "flex" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} width={84} height={84} alt="" />
          <div style={{ display: "flex", fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "#c99a4e" }}>{eyebrow}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, maxWidth: 1000 }}>
          <div style={{ display: "flex", fontFamily: fonts.length ? "Serif" : undefined, fontWeight: 600, fontSize: size, lineHeight: 1.05, color: "#ffffff" }}>{title}</div>
          <div style={{ display: "flex", fontSize: 28, lineHeight: 1.35, color: "rgba(243,234,217,0.82)" }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "rgba(243,234,217,0.7)", borderTop: "1px solid rgba(201,154,78,0.45)", paddingTop: 26 }}>
          <div style={{ display: "flex" }}>{footer}</div>
          <div style={{ display: "flex", width: 56, height: 4, background: "#c99a4e", borderRadius: 4 }} />
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
