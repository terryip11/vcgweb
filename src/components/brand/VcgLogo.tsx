import { useId } from "react";

const MARK_SIZES = { sm: 32, md: 36, lg: 48, xl: 56 } as const;

export type VcgLogoSize = keyof typeof MARK_SIZES;
export type VcgLogoVariant = "default" | "light" | "admin";

export function VcgLogoMark({
  size = 36,
  gradientId = "vcg-logo-gradient",
  className,
}: {
  size?: number;
  gradientId?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientId}
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
      <rect width="48" height="48" rx="13" fill={`url(#${gradientId})`} />
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
  );
}

/** 供 favicon / apple-icon 等靜態場景使用（固定 gradient id） */
export function VcgLogoMarkStatic({ size = 48 }: { size?: number }) {
  return <VcgLogoMark size={size} gradientId="vcg-logo-gradient-static" />;
}

export default function VcgLogo({
  size = "md",
  variant = "default",
  showWordmark = true,
  showTagline = false,
  markOnly = false,
  responsive = false,
  title,
  subtitle,
  className = "",
}: {
  size?: VcgLogoSize;
  variant?: VcgLogoVariant;
  showWordmark?: boolean;
  showTagline?: boolean;
  markOnly?: boolean;
  /** 小螢幕隱藏字標，僅顯示圖標 */
  responsive?: boolean;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  const gradientId = useId().replace(/:/g, "");
  const markPx = MARK_SIZES[size];

  const tagClass =
    variant === "light" ? "text-slate-400" : "text-slate-400";

  const wordSize =
    size === "xl"
      ? "text-xl"
      : size === "lg"
        ? "text-lg"
        : "text-sm";

  const tagline = subtitle ?? (showTagline ? "香港貸款配對平台" : null);
  const showText = showWordmark && !markOnly;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <VcgLogoMark size={markPx} gradientId={gradientId} />
      {showText && (
        <div
          className={`min-w-0 leading-tight ${responsive ? "hidden sm:block" : ""}`}
        >
          <p className={`${wordSize} font-bold tracking-tight text-slate-900`}>
            {title ? (
              <span className={variant === "light" ? "text-white" : "text-slate-900"}>
                {title}
              </span>
            ) : (
              <>
                <span className={variant === "light" ? "text-white" : "text-slate-900"}>
                  VC
                </span>
                <span className={variant === "light" ? "text-blue-400" : "text-blue-600"}>
                  G
                </span>
              </>
            )}
          </p>
          {tagline && (
            <p
              className={`mt-0.5 ${tagClass} ${size === "sm" ? "text-[10px]" : "text-xs"}`}
            >
              {tagline}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
