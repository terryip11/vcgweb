import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
          borderRadius: 112,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: "white",
          }}
        >
          <div style={{ fontSize: 128, fontWeight: 700, letterSpacing: -4 }}>
            VCG
          </div>
          <div style={{ fontSize: 28, marginTop: 8, opacity: 0.9 }}>
            創健佳
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
