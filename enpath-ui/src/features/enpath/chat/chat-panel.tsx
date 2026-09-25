'use client';
// Setup's AI chat — the shared AssistantPanel with Setup's script: explain positions and levels,
// find unset expectations, and (Edit mode) draft a new level that opens in "Edit position".
// MOCK replies. The human confirms and publishes; the AI never saves.

import * as React from 'react';
import { AssistantPanel, type AssistantReply, type AssistantScript } from './assistant-panel';

export interface ChatContext {
  positionName: string;
  levelNames: string[];
  unsetCells: string[];
}
export interface LevelProposal { levelName: string }

function reply(input: string, mode: string | undefined, ctx: ChatContext, onReviewProposal: (p: LevelProposal) => void): AssistantReply {
  const q = input.toLowerCase();
  const levels = ctx.levelNames.map((n, i) => `L${i + 1} · ${n}`).join(', ');
  if (mode === 'Edit' || /\b(add|new)\b.*\blevel\b|principal/.test(q)) {
    return {
      tool: `Read ${ctx.positionName} (${ctx.levelNames.length} levels)`,
      text: `${ctx.positionName} currently has **${levels}**.\n\nI drafted a new top level. Its expectations start as *Not set* — review it in the editor, then fill the grid and publish when ready.`,
      proposal: {
        label: 'Proposed change',
        body: <><span className="font-semibold">+ L{ctx.levelNames.length + 1} · Principal</span> in {ctx.positionName} — expectations start Not set</>,
        accept: 'Review in editor',
        accepted: 'Opened in editor',
        onAccept: () => onReviewProposal({ levelName: 'Principal' }),
      },
    };
  }
  if (/not set|missing|gap|unset|incomplete/.test(q)) {
    return {
      tool: `Checked ${ctx.positionName} expectations`,
      text: ctx.unsetCells.length
        ? `**${ctx.unsetCells.length} ${ctx.unsetCells.length === 1 ? 'cell is' : 'cells are'} not set** in ${ctx.positionName}:\n\n${ctx.unsetCells.map((c) => `- ${c}`).join('\n')}\n\nYou can still publish — employees see these as *Not set*.`
        : `Every expectation in ${ctx.positionName} is set. It's ready to publish.`,
    };
  }
  return {
    tool: `Read ${ctx.positionName}`,
    text: `**${ctx.positionName}** has ${ctx.levelNames.length} levels (${levels}).\n\nExpectations must not go down as levels go up. Ask me to *check for gaps*, or switch to **Edit** to draft a change.`,
  };
}

export function ChatPanel({ context, onClose, onReviewProposal }: {
  context: ChatContext;
  onClose: () => void;
  onReviewProposal: (p: LevelProposal) => void;
}) {
  const script: AssistantScript = {
    emptyTitle: 'Ask about your career structure',
    emptyText: 'I can explain positions and levels, find gaps, and draft changes. You review and publish — I never save on my own.',
    suggestions: [`What levels does ${context.positionName} have?`, 'Which cells are not set?', 'Add a Principal level'],
    context: context.positionName,
    placeholder: (mode) => (mode === 'Edit' ? 'Describe a change to draft…' : 'Ask Enpath…'),
    modes: ['Ask', 'Edit'],
    reply: (input, mode) => reply(input, mode, context, onReviewProposal),
  };
  return <AssistantPanel script={script} onClose={onClose} />;
}
