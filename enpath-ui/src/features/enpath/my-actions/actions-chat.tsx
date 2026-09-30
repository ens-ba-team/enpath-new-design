'use client';
// My Actions' AI chat — the shared AssistantPanel with an Action plan script. MOCK replies (UI only).
// The AI proposes, a person adds: a suggested action is a proposal card; "Add to plan" opens the Add
// action dialog prefilled, where the employee picks a due date and confirms. Replies name what
// they read and never promise a score or a promotion.

import * as React from 'react';
import { AssistantPanel, type AssistantReply, type AssistantScript } from '../chat/assistant-panel';
import { growthAreas, neededLabel, pointsLine, targetName, type Proposal } from './mock-data';

/** One ready idea per growth area; the chat offers it when that area is named. */
const ideas: Record<string, Omit<Proposal, 'id' | 'competencyId'>> = {
  code: { title: 'Refactor one legacy checkout module with tests first', outcome: 'A module the team can change without fear, with tests that show why' },
  deliv: { title: 'Plan the next feature as five releasable slices', outcome: 'Each slice ships on its own within a week' },
  ment: { title: 'Run a weekly code walkthrough for two junior engineers', outcome: 'They explain a change in their own words after four weeks' },
};

function reply(input: string, onPropose: (p: Omit<Proposal, 'id'>) => void): AssistantReply {
  const q = input.toLowerCase();
  const area = growthAreas.find((g) => q.includes(g.name.toLowerCase()) || q.includes(g.id));
  if (area && ideas[area.id]) {
    const idea = ideas[area.id];
    return {
      tool: 'Read your assessment, your action plan and your target',
      text: `For **${area.name}** (${pointsLine(area)}), **${neededLabel(area)}** looks like this:\n\n> ${area.meaning ?? 'See the matrix for this level.'}\n\nHere's an action that practises it:`,
      proposal: {
        label: 'Proposed action',
        body: <><strong>{idea.title}</strong><br />Outcome: {idea.outcome}</>,
        accept: 'Add to plan',
        accepted: 'Opened in Add action',
        onAccept: () => onPropose({ ...idea, competencyId: area.id }),
      },
    };
  }
  if (/where|start|first|focus|priorit/.test(q)) {
    return {
      tool: 'Read your action plan',
      text: `Your plan toward **${targetName}** covers ${growthAreas.map((g) => `**${g.name}**`).join(', ')}. Start with the action that's overdue, then the growth area with no actions yet. Ask me for an idea for any growth area.`,
    };
  }
  return {
    text: `I can suggest actions for a growth area (${growthAreas.map((g) => g.name).join(', ')}) or help you choose where to start. Adding anything to your plan stays your choice.`,
  };
}

export function ActionsChat({ onPropose, onClose }: { onPropose: (p: Omit<Proposal, 'id'>) => void; onClose: () => void }) {
  const script: AssistantScript = React.useMemo(() => ({
    emptyTitle: 'Plan your next step',
    emptyText: `Ask for action ideas for a growth area toward ${targetName}. Nothing joins your plan until you add it.`,
    suggestions: growthAreas.map((g) => `Suggest an action for ${g.name}`).concat('Where should I start?'),
    context: 'Action plan',
    placeholder: 'Ask about your action plan',
    reply: (input) => reply(input, onPropose),
  }), [onPropose]);
  return <AssistantPanel script={script} onClose={onClose} />;
}
