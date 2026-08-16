interface ProductLogoProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

/** 貸款機構 logo：完整顯示不裁切，尺寸可由後台設定 */
export default function ProductLogo({
  src,
  alt,
  width = 88,
  height = 44,
  className = "",
}: ProductLogoProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 ${className}`}
      style={{ width, height }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
      />
    </div>
  );
}
