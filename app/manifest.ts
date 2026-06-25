import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TradeEsportivo — Gestão de Trading Esportivo",
    short_name: "TradeEsportivo",
    description: "Registro de operações, performance e gestão de banca para trading esportivo.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0f1b35",
    theme_color: "#0f1b35",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
