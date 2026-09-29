import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Text styles (text-body-sm, text-label-md …, generated in app/text-styles.css) are
// font sizes. Without this, tailwind-merge reads them as text colours and drops
// them when a colour class such as text-[var(--color-text-secondary)] follows.
const isTextStyle = (value: string) => /^(display|heading|body|label|code)-(xs|sm|md|lg|xl)$/.test(value)

const twMerge = extendTailwindMerge({ extend: { theme: { text: [isTextStyle] } } })

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
