'use client';
// Records' AI chat — the shared AssistantPanel with a Records script. MOCK replies (UI only). It
// reads the records Lan can see and never acknowledges, sends or scores anything itself.

import * as React from 'react';
import { AssistantPanel, type AssistantReply, type AssistantScript } from '../chat/assistant-panel';
import { counterpart, ME, myAction, people, statusOf, type RecordItem } from './mock-data';

function reply(input: string, records: RecordItem[]): AssistantReply {
  const q = input.toLowerCase();
  if (/need|respond|todo|to do|waiting/.test(q)) {
    const mine = records.filter((r) => myAction(r));
    if (mine.length === 0) return { tool: 'Read your records', text: 'Nothing needs you right now.' };
    const lines = mine.map((r) => {
      const { person, relation } = counterpart(r);
      const verb = myAction(r) === 'acknowledge' ? 'Acknowledge' : myAction(r) === 'submit' ? 'Submit' : 'Fix';
      return `- **${verb}**: ${person.name} (${relation}), “${r.content}”`;
    });
    return { tool: 'Read your records', text: `${mine.length} records need you:\n\n${lines.join('\n')}` };
  }
  if (/about me|said|summar/.test(q)) {
    const about = records.filter((r) => r.recipientId === ME && r.creatorId !== ME && statusOf(r) === 'acknowledged');
    if (about.length === 0) return { tool: 'Read records about you', text: 'No acknowledged records about you yet.' };
    return {
      tool: 'Read records about you',
      text: `From acknowledged records about you:\n\n${about.map((r) => `- ${people[r.creatorId].name}: “${r.content}”`).join('\n')}\n\nRecords never set a score. Your manager reads them at your next assessment.`,
    };
  }
  return { text: 'I can list what needs you, or summarise what acknowledged records say about you. I never acknowledge or send anything for you.' };
}

export function RecordsChat({ records, onClose }: { records: RecordItem[]; onClose: () => void }) {
  const script: AssistantScript = React.useMemo(() => ({
    emptyTitle: 'Ask about your records',
    emptyText: 'See what needs you, or what people have said about your work.',
    suggestions: ['What needs my response?', 'Summarise what people said about me'],
    context: 'Records',
    placeholder: 'Ask about your records',
    reply: (input) => reply(input, records),
  }), [records]);
  return <AssistantPanel script={script} onClose={onClose} />;
}
