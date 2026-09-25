'use client';
import * as React from 'react';
import { useSidebar } from '@/components/ui/sidebar';

/** Opening the AI chat collapses the sidebar; closing it restores what the user had.
 *  Render inside EnpathAppShell (it needs the sidebar context). */
export function SidebarFollowsChat({ chatOpen }: { chatOpen: boolean }) {
  const { collapsed, setCollapsed } = useSidebar();
  const before = React.useRef(collapsed);
  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (chatOpen) { before.current = collapsed; setCollapsed(true); } else setCollapsed(before.current);
  }, [chatOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}

/** ⌘I / Ctrl+I toggles the chat. */
export function useChatShortcut(toggle: () => void) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') { e.preventDefault(); toggle(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);
}
