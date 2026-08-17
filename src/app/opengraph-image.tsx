import { ImageResponse } from "next/og";

export const alt = "VCG — 香港私人貸款及中小企融資比較平台";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0c2340 0%, #123a6b 45%, #1a5080 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8, #1e3a8a)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              fontWeight: 700,
              color: "white",
            }}
          >
            V
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{
                fontSize: 48,
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
              }}
            >
              VCG
            </span>
            <span style={{ fontSize: 22, color: "#93c5fd", marginTop: 4 }}>
              香港貸款配對平台
            </span>
          </div>
        </div>

        <p
          style={{
            fontSize: 40,
            fontWeight: 700,
            color: "white",
            lineHeight: 1.3,
            maxWidth: 900,
            margin: 0,
          }}
        >
          私人貸款 · 中小企融資 · 政府基金
        </p>
        <p
          style={{
            fontSize: 26,
            color: "#bfdbfe",
            marginTop: 20,
            maxWidth: 800,
            lineHeight: 1.4,
          }}
        >
          比較 APR · 免費專人配對 · 24 小時回覆
        </p>

        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: 16,
          }}
        >
          {["私人貸款", "稅季貸款", "八成擔保", "業主貸款"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.12)",
                color: "#fde68a",
                fontSize: 18,
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
