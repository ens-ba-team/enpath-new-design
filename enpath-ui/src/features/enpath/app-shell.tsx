'use client';
// Enpath app shell — floating sidebar + page panel. Used by the prototype (app/setup) and the stories.
import type React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider, Sidebar, SidebarHeader, SidebarLogo, SidebarBrand, SidebarContent,
  SidebarGroup, SidebarGroupLabel, SidebarMenuItem, SidebarFooter, SidebarToggle, useSidebar,
} from '@/components/ui/sidebar';
import { BellIcon, BuildingsIcon, CaretDownIcon, ClipboardTextIcon, ListChecksIcon, ListIcon, PathIcon, PlugsIcon, TargetIcon, UsersIcon, UsersThreeIcon } from '@phosphor-icons/react/ssr';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

// ─── Enpath app sidebar (Type=Floating, collapsible) ─────────────────────────
// Shell: color/background/app behind the panels · spacing/shell/inset + gap (8px) · radius/panel (12px).
// The product's navigation, rebuilt from the old prototype (set-up/set-up-current-ui/app-sidebar.png).
// Collapse with the toggle or ⌘B — the toggle icon switches (collapse ↔ expand).

const workspaceItems = [
  { icon: <PathIcon className="h-4 w-4" />, label: 'My Career' },
  { icon: <ClipboardTextIcon className="h-4 w-4" />, label: 'Records' },
  { icon: <TargetIcon className="h-4 w-4" />, label: 'My Actions' },
];
// Pages that exist as routes. Anything else is handled by the screen's onNavigate (a placeholder).
const routes: Record<string, string> = { 'My Career': '/me/career', Setup: '/setup' };

const operationsItems = [
  { icon: <UsersThreeIcon className="h-4 w-4" />, label: 'Directory' },
  { icon: <UsersIcon className="h-4 w-4" />, label: 'Team' },
  { icon: <ListChecksIcon className="h-4 w-4" />, label: 'Reviews' },
  { icon: <BuildingsIcon className="h-4 w-4" />, label: 'Setup' },
];

function EnpathLogo() {
  // Branding slot — NOT token-bound (sidebar spec). 28×28.
  return (
    <SidebarLogo>
      <div className="h-7 w-7 rounded-[var(--radius-md)] bg-[var(--color-brand-primary)] flex items-center justify-center text-[var(--color-brand-primary-foreground)]">
        <PathIcon className="h-4 w-4" aria-hidden="true" />
      </div>
    </SidebarLogo>
  );
}

function EnpathSidebarHeader() {
  const { collapsed } = useSidebar();
  return (
    <SidebarHeader className={collapsed ? 'flex-col gap-[var(--spacing-component-sm)] px-0' : ''}>
      <EnpathLogo />
      <SidebarBrand title="Enpath" caption="Career intelligence" className="flex-1" />
      <SidebarToggle />
    </SidebarHeader>
  );
}

// Account row: same 8px left padding as nav items, so the avatar's left edge lines up with the icons above.
// Collapsed: no side padding — the 32px avatar needs the full 32px row.
function EnpathUserRow() {
  const { collapsed } = useSidebar();
  return (
    <button
      type="button"
      aria-label="Lan Nguyen, Admin — account menu"
      className={`flex w-full items-center gap-[var(--spacing-component-sm)] rounded-[var(--radius-md)] py-[var(--spacing-component-xs-plus)] text-left hover:bg-[var(--color-sidebar-accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-sidebar-ring)] ${collapsed ? 'justify-center px-0' : 'px-[var(--spacing-component-sm)]'}`}
    >
      <Avatar size="sm" name="Lan Nguyen" fallback="LN" />
      {!collapsed && (
        <>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-semibold text-[var(--color-sidebar-foreground)]">Lan Nguyen</span>
            <span className="truncate text-xs text-[var(--color-text-secondary)]">Admin</span>
          </span>
          <CaretDownIcon className="h-4 w-4 shrink-0 text-[var(--color-sidebar-foreground)]" aria-hidden="true" />
        </>
      )}
    </button>
  );
}

function EnpathSidebarFooter() {
  const { collapsed } = useSidebar();
  // Collapsed: 4px side padding (not 12px) so the 32px avatar fits the 56px rail.
  return (
    <SidebarFooter className={`flex flex-col gap-[var(--spacing-component-xs)] ${collapsed ? 'px-[var(--spacing-component-xs)]' : 'px-[var(--spacing-component-md)]'}`}>
      <SidebarMenuItem icon={<PlugsIcon className="h-4 w-4" />} label="MCP access" href="#" className={collapsed ? 'justify-center' : ''} />
      <SidebarMenuItem icon={<BellIcon className="h-4 w-4" />} label="Notifications" badge="1" href="#" className={collapsed ? 'justify-center' : ''} />
      {/* Account block: set apart from the nav rows above */}
      <Separator className="my-[var(--spacing-component-sm)] bg-[var(--color-sidebar-border)]" />
      <EnpathUserRow />
    </SidebarFooter>
  );
}

export function EnpathAppShell({ defaultCollapsed = false, active = 'Setup', onNavigate, sidebarClassName, rightPanel, children }: { defaultCollapsed?: boolean; active?: string; onNavigate?: (label: string) => void; sidebarClassName?: string; rightPanel?: React.ReactNode; children?: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const go = (label: string) => {
    const href = routes[label];
    if (href && href !== pathname) router.push(href);
    else onNavigate?.(label);
  };
  const item = (i: { icon: React.ReactNode; label: string }) => (
    <SidebarMenuItem key={i.label} {...i} active={i.label === active} href={routes[i.label] ?? '#'} onClick={(e: React.MouseEvent) => { e.preventDefault(); go(i.label); }} />
  );
  return (
    <SidebarProvider defaultCollapsed={defaultCollapsed}>
      {/* App background: flat background/app + two soft background/app-glow glows on the right, behind the page panel — never behind sidebar text */}
      <div
        className="flex h-dvh min-h-0 flex-col gap-[var(--spacing-shell-gap)] bg-[var(--color-background-app)] p-[var(--spacing-shell-inset)] lg:flex-row"
        style={{ backgroundImage: 'radial-gradient(600px circle at 100% 0%, var(--color-background-app-glow), transparent 85%), radial-gradient(720px circle at 70% 100%, var(--color-background-app-glow), transparent 85%)' }}
      >
        <div className="flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-[var(--spacing-component-sm)]">
            <EnpathLogo />
            <span className="text-base font-semibold text-[var(--color-sidebar-foreground)]">Enpath</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Open navigation"><ListIcon /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="max-w-[320px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>Move between Enpath workspaces.</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-1 flex-col gap-[var(--spacing-layout-xs)] overflow-y-auto p-[var(--spacing-component-lg)]" aria-label="Mobile navigation">
                <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                  <p className="px-[var(--spacing-component-sm)] text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Workspace</p>
                  {workspaceItems.map((entry) => (
                    <SheetClose asChild key={entry.label}>
                      <Button variant={entry.label === active ? 'secondary' : 'ghost'} className="justify-start" onClick={() => go(entry.label)}>{entry.icon}{entry.label}</Button>
                    </SheetClose>
                  ))}
                </div>
                <Separator />
                <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                  <p className="px-[var(--spacing-component-sm)] text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Operations</p>
                  {operationsItems.map((entry) => (
                    <SheetClose asChild key={entry.label}>
                      <Button variant={entry.label === active ? 'secondary' : 'ghost'} className="justify-start" onClick={() => go(entry.label)}>{entry.icon}{entry.label}</Button>
                    </SheetClose>
                  ))}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <Sidebar type="floating" collapsible="icon" className={`hidden lg:flex ${sidebarClassName ?? ''}`}>
          <EnpathSidebarHeader />
          <SidebarContent className="gap-0">
            <nav aria-label="Workspace">
              <SidebarGroup>
                <SidebarGroupLabel>Workspace</SidebarGroupLabel>
                {workspaceItems.map(item)}
              </SidebarGroup>
            </nav>
            <Separator className="mx-[var(--spacing-component-md)] w-auto bg-[var(--color-sidebar-border)]" />
            <nav aria-label="Operations">
              <SidebarGroup>
                <SidebarGroupLabel>Operations</SidebarGroupLabel>
                {operationsItems.map(item)}
              </SidebarGroup>
            </nav>
          </SidebarContent>
          <EnpathSidebarFooter />
        </Sidebar>
        <main className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] shadow-[var(--shadow-surface)]">
          {children ?? (
            <p className="p-[var(--spacing-component-xl)] text-sm text-[var(--color-text-secondary)]">Setup — page content. Collapse the sidebar with the toggle or ⌘B.</p>
          )}
        </main>
        {rightPanel && <div className="hidden lg:contents">{rightPanel}</div>}
      </div>
    </SidebarProvider>
  );
}
