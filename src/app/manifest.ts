import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "VCG — 香港貸款配對平台",
    short_name: "VCG",
    description:
      "比較私人貸款、中小企融資、政府基金申請及業主貸款。VCG 專人免費跟進。",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#1d4ed8",
    lang: "zh-HK",
    dir: "ltr",
    categories: ["finance", "business"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "私人貸款比較",
        short_name: "比較",
        url: "/compare",
        icons: [{ src: "/icon", sizes: "512x512" }],
      },
      {
        name: "中小企融資",
        short_name: "SME",
        url: "/sme",
        icons: [{ src: "/icon", sizes: "512x512" }],
      },
      {
        name: "基金申請",
        short_name: "基金",
        url: "/funds",
        icons: [{ src: "/icon", sizes: "512x512" }],
      },
      {
        name: "會員中心",
        short_name: "會員",
        url: "/member",
        icons: [{ src: "/icon", sizes: "512x512" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}
