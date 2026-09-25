'use client';
// My Career's AI chat — the shared AssistantPanel with an employee script: suggest a career vision,
// explain what the target needs, compare two roles. MOCK replies (UI only). The AI never changes
// the map: a suggested vision is a proposal card, and "Add to my map" is the employee's choice.
// Replies name the data they use and never give a verdict or promise a promotion.

import * as React from 'react';
import { AssistantPanel, type AssistantReply, type AssistantScript } from '../chat/assistant-panel';
import { countGaps, gapsFor, pointLabel, recordCount, type PlanStep } from './mock-data';
import { levelName } from './plan-dialogs';

/** The direction the mock assistant suggests: from the Active target toward full-stack work. */
const SUGGESTED_FROM = 'BE-L3';
const SUGGESTED_ROUTE = ['FE-L3', 'FE-L4'];

function reply(input: string, target: PlanStep | undefined, onMap: Set<string>, onAddVision: (from: string, ids: string[]) => void): AssistantReply {
  const q = input.toLowerCase();

  if (/vision|suggest|direction|idea|explore/.test(q)) {
    const already = SUGGESTED_ROUTE.every((id) => onMap.has(id));
    return {
      tool: `Read your ${recordCount} records, your company paths and published roles`,
      text: already
        ? `The direction I'd suggest — **${SUGGESTED_ROUTE.map(levelName).join(' → ')}** — is already on your map. Ask me to *compare* it with your target.`
        : `Your code quality and delivery records carry over well to frontend work, so here's a direction you could explore:\n\n**${[SUGGESTED_FROM, ...SUGGESTED_ROUTE].map(levelName).join(' → ')}**\n\n- It isn't on a company path for your role, so it would be a **career vision** — only you see it until you send it to your manager.\n- Most of its competencies need evidence first. A record from a frontend task would be the first step.`,
      proposal: already ? undefined : {
        label: 'Proposed career vision',
        body: <>{[SUGGESTED_FROM, ...SUGGESTED_ROUTE].map(levelName).join(' → ')}</>,
        accept: 'Add to my map',
        accepted: 'Added to your map',
        onAccept: () => onAddVision(SUGGESTED_FROM, SUGGESTED_ROUTE),
      },
    };
  }

  if (target && /work on|improve|focus|need|target|next/.test(q)) {
    const gaps = gapsFor(target);
    const growth = gaps.filter((g) => g.status === 'growth');
    const evidence = gaps.filter((g) => g.status === 'evidence');
    return {
      tool: `Compared your records with ${levelName(target.id)}`,
      text: `For **${levelName(target.id)}**:\n\n`
        + (growth.length ? `**Growth areas**\n${growth.map((g) => `- ${g.name}: ${pointLabel(g.current!)} → ${pointLabel(g.required!)}`).join('\n')}\n\n` : '')
        + (evidence.length ? `**Need evidence** — not a gap, just no records yet\n${evidence.map((g) => `- ${g.name} (needs ${pointLabel(g.required!)})`).join('\n')}\n\n` : '')
        + 'A good next step: add a record from recent work for the ones that need evidence, so they can be assessed.',
    };
  }

  if (/compare|versus|vs\b|difference/.test(q) && target) {
    const a = countGaps(gapsFor(target));
    return {
      tool: `Compared ${levelName(target.id)} with Product Designer L2 · Senior`,
      text: `**${levelName(target.id)}** — ${a.ready} ready, ${a.growth} growth areas, ${a.evidence} need evidence.\n\n**Product Designer L2 · Senior** — mostly *needs evidence*: you have a research record, but nothing yet for visual or interaction design.\n\nThe backend move builds on what you already have; the design move is a bigger change and would need your manager's approval as a career vision.`,
    };
  }

  return {
    tool: 'Read your career map',
    text: `I can **suggest a career vision**, explain **what your target needs**, or **compare two roles**. I use your records, your company paths and the published roles — and I never change your map on my own.`,
  };
}

export function CareerChat({ target, context, onMap, onAddVision, onClose }: {
  target: PlanStep | undefined;
  /** What the chip in the composer shows, e.g. the selected role */
  context: string;
  onMap: Set<string>;
  onAddVision: (from: string, ids: string[]) => void;
  onClose: () => void;
}) {
  const script: AssistantScript = {
    emptyTitle: 'Ask about your career',
    emptyText: 'I can suggest career visions, explain what a role needs, and compare roles. You decide what goes on your map — I never change it on my own.',
    suggestions: ['Suggest a career vision for me', target ? `What should I work on for ${levelName(target.id)}?` : 'What should I work on next?', 'Compare my target with Product Designer L2'],
    context,
    placeholder: 'Ask about your career…',
    reply: (input) => reply(input, target, onMap, onAddVision),
  };
  return <AssistantPanel script={script} onClose={onClose} />;
}
