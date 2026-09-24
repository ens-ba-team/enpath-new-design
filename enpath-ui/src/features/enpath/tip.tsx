'use client';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

// The design system's own Tooltip (300ms delay, styled dark pill) in place of the native `title`
// attribute — which is unstyled and pops up slow (~1000ms+, browser-dependent). Needs one
// <TooltipProvider> somewhere above it in the tree; SetupScreen mounts it once for the whole page.
// No label = no tooltip, so call sites can keep the same `condition ? 'text' : undefined` pattern
// they used with `title`.
export function Tip({ label, children }: { label?: string; children: React.ReactElement }) {
  if (!label) return children;
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
