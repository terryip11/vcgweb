import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
        }}
      >
        <svg
          width="180"
          height="180"
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="vcg-apple-gradient"
              x1="6"
              y1="4"
              x2="42"
              y2="44"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#3b82f6" />
              <stop stopColor="#1d4ed8" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
          <rect width="48" height="48" rx="13" fill="url(#vcg-apple-gradient)" />
          <circle cx="24" cy="13" r="3.5" fill="#fbbf24" />
          <path
            d="M15 18.5L24 35L33 18.5"
            stroke="white"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M24 16.5V18.5"
            stroke="#fde68a"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M17 32H31"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.35"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
