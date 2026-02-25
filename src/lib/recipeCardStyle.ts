const ICON_BRAND_STYLES = {
  iconBox:
    'border border-sage-300/70 bg-gradient-to-br from-sage-700 via-sage-700 to-sage-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_4px_12px_rgba(47,94,63,0.28)]',
  iconColor: 'text-cream',
} as const;

export function getCategoryAccent(): {
  iconBox: string;
  iconColor: string;
} {
  return ICON_BRAND_STYLES;
}
