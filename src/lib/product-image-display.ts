import type { Product, ProductImageSizePreset } from "@/types";

export const PRODUCT_IMAGE_SIZE_PRESET_OPTIONS: {
  value: ProductImageSizePreset;
  label: string;
  description: string;
  width: number;
  height: number;
}[] = [
  {
    value: "sm",
    label: "小",
    description: "寬扁 logo、字較大時",
    width: 72,
    height: 36,
  },
  {
    value: "md",
    label: "標準",
    description: "預設大小",
    width: 88,
    height: 44,
  },
  {
    value: "lg",
    label: "大",
    description: "方形或小字 logo",
    width: 112,
    height: 56,
  },
  {
    value: "wide",
    label: "寬幅",
    description: "超寬橫向 logo",
    width: 128,
    height: 40,
  },
  {
    value: "tall",
    label: "高形",
    description: "直向或方形 logo",
    width: 56,
    height: 72,
  },
  {
    value: "custom",
    label: "自訂",
    description: "自行輸入寬高 (px)",
    width: 88,
    height: 44,
  },
];

const PRESET_MAP = Object.fromEntries(
  PRODUCT_IMAGE_SIZE_PRESET_OPTIONS.filter((o) => o.value !== "custom").map(
    (o) => [o.value, { width: o.width, height: o.height }],
  ),
) as Record<
  Exclude<ProductImageSizePreset, "custom">,
  { width: number; height: number }
>;

const MIN_PX = 24;
const MAX_PX = 200;

function clampPx(value: number | undefined | null, fallback: number): number {
  if (value == null || Number.isNaN(value)) return fallback;
  return Math.min(MAX_PX, Math.max(MIN_PX, Math.round(value)));
}

export function resolveProductImageDisplay(product: {
  imageSizePreset?: ProductImageSizePreset;
  imageDisplayWidth?: number | null;
  imageDisplayHeight?: number | null;
}): { width: number; height: number } {
  const preset = product.imageSizePreset ?? "md";

  if (preset === "custom") {
    return {
      width: clampPx(product.imageDisplayWidth, PRESET_MAP.md.width),
      height: clampPx(product.imageDisplayHeight, PRESET_MAP.md.height),
    };
  }

  return PRESET_MAP[preset] ?? PRESET_MAP.md;
}

export function productImageDisplayFromProduct(
  product: Pick<
    Product,
    "imageSizePreset" | "imageDisplayWidth" | "imageDisplayHeight"
  >,
) {
  return resolveProductImageDisplay(product);
}
