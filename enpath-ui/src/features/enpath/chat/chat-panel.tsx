'use client';
import * as React from 'react';
import { ArrowsClockwiseIcon, ClockCounterClockwiseIcon, CopyIcon, MagnifyingGlassIcon, PlusIcon, SparkleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { Conversation, ConversationContent, ConversationEmptyState, ConversationScrollButton } from '@/components/ai-elements/conversation';
import { Message, MessageAction, MessageActions, MessageContent, MessageResponse } from '@/components/ai-elements/message';
import {
  PromptInput, PromptInputBody, PromptInputFooter, PromptInputSelect, PromptInputSelectContent, PromptInputSelectItem,
  PromptInputSelectTrigger, PromptInputSelectValue, PromptInputSubmit, PromptInputTextarea, PromptInputTools,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { Suggestion } from '@/components/ai-elements/suggestion';
import { Shimmer } from '@/components/ai-elements/shimmer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tip } from '../tip';

// AI chat panel (VS Code-style), right of the page panel. Built on AI Elements, bound to Enpath tokens:
//   panel = background/default + border/default + radius/panel + shadow/surface
//   user turn = chat/user/* (blue/50 block) · assistant = plain chat/assistant/fg
//   composer = chat/composer/* · proposal = card (surface/overlay + border/default + radius/surface)
// MOCK: no backend. Replies stream word by word from a small script. The AI never saves:
// Edit mode drafts a proposal that opens in "Edit position" (the human confirms and publishes).

export interface ChatContext {
  positionName: string;
  levelNames: string[];
  unsetCells: string[];
}
export interface LevelProposal { levelName: string }

type Status = 'ready' | 'submitted' | 'streaming';
interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  tool?: string;
  proposal?: LevelProposal & { state: 'open' | 'discarded' | 'reviewing' };
}

const MODELS = [{ id: 'claude-sonnet-5', name: 'Claude Sonnet 5' }];
const MODES = ['Ask', 'Edit'] as const;

function reply(input: string, mode: (typeof MODES)[number], ctx: ChatContext): Omit<Turn, 'id' | 'role'> {
  const q = input.toLowerCase();
  const levels = ctx.levelNames.map((n, i) => `L${i + 1} · ${n}`).join(', ');
  if (mode === 'Edit' || /\b(add|new)\b.*\blevel\b|principal/.test(q)) {
    return {
      tool: `Read ${ctx.positionName} (${ctx.levelNames.length} levels)`,
      text: `${ctx.positionName} currently has **${levels}**.\n\nI drafted a new top level. Its expectations start as *Not set* — review it in the editor, then fill the grid and publish when ready.`,
      proposal: { levelName: 'Principal', state: 'open' },
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
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [status, setStatus] = React.useState<Status>('ready');
  const [model, setModel] = React.useState(MODELS[0].id);
  const [mode, setMode] = React.useState<(typeof MODES)[number]>('Ask');
  const [text, setText] = React.useState('');
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = React.useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setStatus('ready');
  }, []);
  React.useEffect(() => () => stop(), [stop]);

  const send = (input: string) => {
    const value = input.trim();
    if (!value || status !== 'ready') return;
    const id = `${Date.now()}`;
    const full = reply(value, mode, context);
    setTurns((t) => [...t, { id: `u${id}`, role: 'user', text: value }, { id: `a${id}`, role: 'assistant', text: '', tool: full.tool }]);
    setText('');
    setStatus('submitted');
    const words = full.text.split(/(\s+)/);
    let i = 0;
    setTimeout(() => {
      setStatus('streaming');
      timer.current = setInterval(() => {
        i += 2;
        const done = i >= words.length;
        setTurns((t) => t.map((x) => (x.id === `a${id}` ? { ...x, text: words.slice(0, i).join(''), proposal: done ? full.proposal : undefined } : x)));
        if (done) stop();
      }, 35);
    }, 500);
  };

  const onSubmit = (m: PromptInputMessage) => {
    if (status !== 'ready') { stop(); return; }
    send(m.text ?? '');
  };

  const setProposal = (id: string, state: 'discarded' | 'reviewing') =>
    setTurns((t) => t.map((x) => (x.id === id && x.proposal ? { ...x, proposal: { ...x.proposal, state } } : x)));

  const suggestions = [`What levels does ${context.positionName} have?`, 'Which cells are not set?', 'Add a Principal level'];

  return (
    <aside
      aria-label="AI chat"
      className="flex w-[380px] shrink-0 flex-col overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-border-default)] bg-[var(--color-background-default)] shadow-[var(--shadow-surface)]"
    >
      <header className="flex items-center gap-[var(--spacing-component-xs)] border-b border-[var(--color-border-default)] px-[var(--spacing-component-md)] py-[var(--spacing-component-sm)]">
        <SparkleIcon className="h-4 w-4 text-[var(--color-icon-brand)]" aria-hidden="true" />
        <h2 className="flex-1 text-sm font-semibold text-[var(--color-background-default-foreground)]">Chat</h2>
        <Tip label="New chat">
          <Button variant="ghost" size="icon" aria-label="New chat" onClick={() => { stop(); setTurns([]); }}><PlusIcon className="h-4 w-4" /></Button>
        </Tip>
        <Tip label="Chat history — coming next">
          <Button variant="ghost" size="icon" aria-label="Chat history"><ClockCounterClockwiseIcon className="h-4 w-4" /></Button>
        </Tip>
        <Tip label="Close chat (⌘I)">
          <Button variant="ghost" size="icon" aria-label="Close chat" onClick={onClose}><XIcon className="h-4 w-4" /></Button>
        </Tip>
      </header>

      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="gap-[var(--spacing-component-lg)] p-[var(--spacing-component-md)]">
          {turns.length === 0 ? (
            <ConversationEmptyState className="gap-[var(--spacing-component-lg)] p-[var(--spacing-component-lg)]">
              <SparkleIcon className="h-8 w-8 text-[var(--color-icon-brand)]" aria-hidden="true" />
              <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                <h3 className="text-sm font-semibold text-[var(--color-background-default-foreground)]">Ask about your career structure</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">I can explain positions and levels, find gaps, and draft changes. You review and publish — I never save on my own.</p>
              </div>
            </ConversationEmptyState>
          ) : (
            turns.map((t) => (
              <Message key={t.id} from={t.role}>
                {t.role === 'assistant' && t.tool && (
                  <p className="flex items-center gap-[var(--spacing-component-xs)] text-xs text-[var(--color-text-secondary)]">
                    <MagnifyingGlassIcon className="h-3 w-3" aria-hidden="true" />{t.tool}
                  </p>
                )}
                <MessageContent>
                  {t.role === 'assistant' && !t.text ? <Shimmer>Thinking…</Shimmer> : t.role === 'assistant' ? <MessageResponse>{t.text}</MessageResponse> : t.text}
                </MessageContent>
                {t.proposal && t.proposal.state !== 'discarded' && (
                  <div className="flex flex-col gap-[var(--spacing-component-sm)] rounded-[var(--radius-surface)] border border-[var(--color-border-default)] bg-[var(--color-surface-overlay)] p-[var(--spacing-component-md)] shadow-[var(--shadow-surface)]">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">Proposed change</p>
                    <p className="text-sm text-[var(--color-background-default-foreground)]">
                      <span className="font-semibold">+ L{context.levelNames.length + 1} · {t.proposal.levelName}</span> in {context.positionName} — expectations start Not set
                    </p>
                    <div className="flex justify-end gap-[var(--spacing-component-sm)]">
                      {t.proposal.state === 'reviewing' ? (
                        <Badge variant="secondary">Opened in editor</Badge>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setProposal(t.id, 'discarded')}>Discard</Button>
                          <Button size="sm" onClick={() => { setProposal(t.id, 'reviewing'); onReviewProposal({ levelName: t.proposal!.levelName }); }}>Review in editor</Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                {t.role === 'assistant' && t.text && status === 'ready' && (
                  <MessageActions>
                    <MessageAction tooltip="Copy" label="Copy" onClick={() => navigator.clipboard?.writeText(t.text)}><CopyIcon className="h-4 w-4" /></MessageAction>
                    <MessageAction tooltip="Retry" label="Retry" onClick={() => { const i = turns.findIndex((x) => x.id === t.id); const q = turns[i - 1]?.text; if (q) { setTurns((all) => all.slice(0, i - 1)); send(q); } }}><ArrowsClockwiseIcon className="h-4 w-4" /></MessageAction>
                  </MessageActions>
                )}
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="flex flex-col gap-[var(--spacing-component-sm)] p-[var(--spacing-component-md)] pt-0">
        {turns.length === 0 && (
          <div className="flex flex-col items-start gap-[var(--spacing-component-xs)]" aria-label="Suggestions">
            {suggestions.map((s) => <Suggestion key={s} suggestion={s} onClick={send} />)}
          </div>
        )}
        <PromptInput onSubmit={onSubmit} className="[&_[data-slot=input-group]]:rounded-[var(--chat-composer-radius)] [&_[data-slot=input-group]]:border-[var(--chat-composer-border)] [&_[data-slot=input-group]]:bg-[var(--chat-composer-bg)]">
          <PromptInputBody>
            <div className="flex w-full flex-wrap gap-[var(--spacing-component-xs)] px-[var(--spacing-component-md)] pt-[var(--spacing-component-sm)]">
              <Tip label="Current context">
                <span className="inline-flex"><Badge variant="secondary">{context.positionName}</Badge></span>
              </Tip>
            </div>
            <PromptInputTextarea value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === 'Edit' ? 'Describe a change to draft…' : 'Ask Enpath…'} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputSelect value={mode} onValueChange={(v) => setMode(v as (typeof MODES)[number])}>
                <PromptInputSelectTrigger aria-label="Mode" className="h-7 w-auto gap-[var(--spacing-component-xs)] border-none px-[var(--spacing-component-sm)] text-xs shadow-none"><PromptInputSelectValue /></PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {MODES.map((m) => <PromptInputSelectItem key={m} value={m}>{m}</PromptInputSelectItem>)}
                </PromptInputSelectContent>
              </PromptInputSelect>
              <PromptInputSelect value={model} onValueChange={setModel}>
                <PromptInputSelectTrigger aria-label="Model" className="h-7 w-auto gap-[var(--spacing-component-xs)] border-none px-[var(--spacing-component-sm)] text-xs shadow-none"><PromptInputSelectValue /></PromptInputSelectTrigger>
                <PromptInputSelectContent>
                  {MODELS.map((m) => <PromptInputSelectItem key={m.id} value={m.id}>{m.name}</PromptInputSelectItem>)}
                </PromptInputSelectContent>
              </PromptInputSelect>
            </PromptInputTools>
            <PromptInputSubmit status={status === 'ready' ? undefined : status} onStop={stop} disabled={status === 'ready' && !text.trim()} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </aside>
  );
}
