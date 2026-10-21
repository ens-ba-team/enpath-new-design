'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { Gap } from './mock-data';

const CENTER = 160;
const RADIUS = 112;
const point = (index: number, count: number, ratio: number) => {
  const angle = index * Math.PI * 2 / count - Math.PI / 2;
  return { x: CENTER + Math.cos(angle) * RADIUS * ratio, y: CENTER + Math.sin(angle) * RADIUS * ratio };
};
const coordinates = (points: { x: number; y: number }[]) => points.map(({ x, y }) => `${x},${y}`).join(' ');

export function CompetencyOverview({ gaps, roleName, open, onOpenChange, onSelect, onCloseAutoFocus }: {
  gaps: Gap[];
  roleName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
  onCloseAutoFocus: (event: Event) => void;
}) {
  const assessed = gaps.filter((gap) => gap.current != null).length;
  const comparable = gaps.filter((gap) => gap.current != null && gap.required != null).length;
  const sameScale = new Set(gaps.map((gap) => gap.scaleSize)).size === 1;
  const available = gaps.length >= 3 && gaps.length <= 8 && comparable >= 3 && sameScale;
  const maximum = gaps[0]?.scaleSize ?? 5;
  const [selected, setSelected] = React.useState<string | null>(null);
  const active = gaps.find((gap) => gap.id === selected);
  const select = (id: string) => { onSelect(id); onOpenChange(false); };
  const series = (key: 'current' | 'required', color: string, dashed: boolean) => {
    const complete = gaps.every((gap) => gap[key] != null);
    return <g stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? '6 4' : undefined}>
      {complete ? <polygon points={coordinates(gaps.map((gap, index) => point(index, gaps.length, gap[key]! / maximum)))} fill={dashed ? 'none' : color} fillOpacity={dashed ? undefined : 0.08} /> : gaps.map((gap, index) => {
        const next = gaps[(index + 1) % gaps.length];
        if (gap[key] == null || next[key] == null) return null;
        const a = point(index, gaps.length, gap[key]! / maximum);
        const b = point((index + 1) % gaps.length, gaps.length, next[key]! / maximum);
        return <line key={gap.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
      })}
      {gaps.map((gap, index) => gap[key] != null ? <circle key={gap.id} {...(() => { const p = point(index, gaps.length, gap[key]! / maximum); return { cx: p.x, cy: p.y }; })()} r={dashed ? 5 : 3} fill={dashed ? 'var(--color-background-default)' : color} /> : null)}
    </g>;
  };
  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[90dvh] max-w-[760px] overflow-y-auto" onCloseAutoFocus={onCloseAutoFocus}>
      <DialogHeader>
        <DialogTitle>Competency overview</DialogTitle>
        <DialogDescription>{roleName}. Your approved scores compared with this role’s requirements.</DialogDescription>
      </DialogHeader>
      <p className="text-body-sm">{assessed}/{gaps.length} competencies assessed · Scale: 0–{maximum}</p>
      <p className="text-body-xs text-[var(--color-text-secondary)]">{gaps.filter((gap) => gap.status === 'growth').length} growth areas · {gaps.filter((gap) => gap.status === 'ready').length} ready · {gaps.filter((gap) => gap.current == null).length} not assessed</p>
      {available ? <>
        <div className="flex flex-wrap gap-[var(--spacing-component-lg)] text-body-sm" aria-label="Chart legend">
          <span className="inline-flex items-center gap-[var(--spacing-component-sm)]"><span className="w-6 border-t-2 border-[var(--color-brand-primary)]" />Your score · solid</span>
          <span className="inline-flex items-center gap-[var(--spacing-component-sm)]"><span className="w-6 border-t-2 border-dashed border-[var(--color-text-secondary)]" />Role requires · dashed</span>
        </div>
        <div className="grid items-start gap-[var(--spacing-component-lg)] sm:grid-cols-2">
          <div>
            <svg viewBox="0 0 320 320" className="w-full" role="img" aria-label={`Competency radar. ${assessed} of ${gaps.length} assessed. Numbered axes correspond to the competency buttons. Missing scores have no point or connecting line. Exact values are listed alongside.`}>
              {Array.from({ length: maximum }, (_, index) => <polygon key={index} points={coordinates(gaps.map((_, axis) => point(axis, gaps.length, (index + 1) / maximum)))} fill="none" stroke="var(--color-border-default)" />)}
              {gaps.map((gap, index) => {
                const end = point(index, gaps.length, 1);
                const label = point(index, gaps.length, 1.22);
                return <g key={gap.id}><line x1={CENTER} y1={CENTER} x2={end.x} y2={end.y} stroke="var(--color-border-default)" /><g role="button" tabIndex={0} aria-label={`View ${gap.name} in competency list`} className="cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-ring)]" onClick={() => select(gap.id)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select(gap.id); } }}><circle cx={label.x} cy={label.y} r="16" fill="var(--color-background-default)" stroke="var(--color-border-default)" /><text x={label.x} y={label.y} dy="0.35em" textAnchor="middle" fill="var(--color-text-secondary)" className="text-body-sm">{index + 1}</text></g></g>;
              })}
              {series('required', 'var(--color-text-secondary)', true)}
              {series('current', 'var(--color-brand-primary)', false)}
            </svg>
            <p className="text-body-xs text-[var(--color-text-secondary)]">Missing values are left unplotted, never treated as zero. Incomplete series have no filled area. Chart area is not a readiness score.</p>
          </div>
          <ul className="flex flex-col gap-[var(--spacing-component-xs)]" aria-label="Competency values">
            {gaps.map((gap, index) => <li key={gap.id}><Button variant="ghost" className="h-auto w-full justify-start whitespace-normal py-[var(--spacing-component-sm)] text-left" onMouseEnter={() => setSelected(gap.id)} onFocus={() => setSelected(gap.id)} onClick={() => select(gap.id)} aria-label={`View ${gap.name} in competency list`}>
              <span className="flex flex-col gap-[var(--spacing-component-xs)]"><span>{index + 1}. {gap.name}</span><span className="text-body-xs text-[var(--color-text-secondary)]">You: {gap.current ?? 'Not assessed'} · Required: {gap.required ?? 'Not set'}</span></span>
            </Button></li>)}
          </ul>
        </div>
        {active && <p className="text-body-xs text-[var(--color-text-secondary)]">{active.name}: {active.meaning ?? 'No requirement set for this role.'}</p>}
      </> : <div role="status" className="flex flex-col gap-[var(--spacing-component-sm)]">
        <h3 className="text-heading-xs">Not enough comparable data for a radar chart</h3>
        <p className="text-body-sm text-[var(--color-text-secondary)]">A useful radar needs 3–8 competencies on the same scale, with both an approved score and a role requirement for at least 3. You currently have {comparable} comparable competencies. Your competency list remains available below.</p>
        <div className="flex flex-wrap gap-[var(--spacing-component-xs)]">{gaps.map((gap) => <Button key={gap.id} variant="outline" size="sm" onClick={() => select(gap.id)}>{gap.name}</Button>)}</div>
      </div>}
      <p className="text-body-xs text-[var(--color-text-secondary)]">Select a competency to return to its details and actions. Scores come from approved assessments; records and actions do not change them.</p>
    </DialogContent>
  </Dialog>;
}
