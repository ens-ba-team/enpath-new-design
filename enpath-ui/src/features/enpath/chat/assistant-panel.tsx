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

// AI assistant panel (VS Code-style), right of the page panel — shared by every screen. Built on
// AI Elements, bound to Enpath tokens:
//   panel = background/default + border/default + radius/panel + shadow/surface
//   user turn = chat/user/* · assistant = plain chat/assistant/fg
//   composer = chat/composer/* · proposal = card (surface/overlay + border/default + radius/surface)
// Each screen passes a script: what the empty state says, suggestions, the context chip, and how to
// reply. MOCK: no backend — replies stream word by word. The AI never saves: a proposal card needs
// the person to accept it, and the screen still runs its own Preview → Confirm where it applies.

export interface AssistantProposal {
  /** "Proposed change", "Proposed career vision" */
  label: string;
  /** What would change, in one or two lines */
  body: React.ReactNode;
  /** Accept button, e.g. "Review in editor", "Add to my map" */
  accept: string;
  /** Badge shown after accepting, e.g. "Opened in editor", "Added to your map" */
  accepted: string;
  onAccept: () => void;
}

export interface AssistantReply {
  /** What the assistant looked at, shown above the answer, e.g. "Read your records" */
  tool?: string;
  /** Markdown */
  text: string;
  proposal?: AssistantProposal;
}

export interface AssistantScript {
  emptyTitle: string;
  emptyText: string;
  suggestions: string[];
  /** Chip in the composer showing what the assistant is looking at */
  context: string;
  /** Composer placeholder — may depend on the mode */
  placeholder: string | ((mode: string | undefined) => string);
  /** Optional modes, e.g. Ask / Edit. Omit for a single mode. */
  modes?: string[];
  reply: (input: string, mode: string | undefined) => AssistantReply;
}

type Status = 'ready' | 'submitted' | 'streaming';
interface Turn {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  tool?: string;
  proposal?: AssistantProposal & { state: 'open' | 'discarded' | 'accepted' };
}

const MODELS = [{ id: 'claude-sonnet-5', name: 'Claude Sonnet 5' }];

export function AssistantPanel({ script, onClose }: { script: AssistantScript; onClose: () => void }) {
  const [turns, setTurns] = React.useState<Turn[]>([]);
  const [status, setStatus] = React.useState<Status>('ready');
  const [model, setModel] = React.useState(MODELS[0].id);
  const [mode, setMode] = React.useState(script.modes?.[0]);
  const [text, setText] = React.useState('');
  const timer = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const nextId = React.useRef(0);

  const stop = React.useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    setStatus('ready');
  }, []);
  React.useEffect(() => () => stop(), [stop]);

  const send = (input: string) => {
    const value = input.trim();
    if (!value || status !== 'ready') return;
    const id = String(++nextId.current);
    const full = script.reply(value, mode);
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
        setTurns((t) => t.map((x) => (x.id === `a${id}` ? { ...x, text: words.slice(0, i).join(''), proposal: done && full.proposal ? { ...full.proposal, state: 'open' } : undefined } : x)));
        if (done) stop();
      }, 35);
    }, 500);
  };

  const onSubmit = (m: PromptInputMessage) => {
    if (status !== 'ready') { stop(); return; }
    send(m.text ?? '');
  };

  const setProposal = (id: string, state: 'discarded' | 'accepted') =>
    setTurns((t) => t.map((x) => (x.id === id && x.proposal ? { ...x, proposal: { ...x.proposal, state } } : x)));

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
                <h3 className="text-sm font-semibold text-[var(--color-background-default-foreground)]">{script.emptyTitle}</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">{script.emptyText}</p>
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
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-secondary)]">{t.proposal.label}</p>
                    <div className="text-sm text-[var(--color-background-default-foreground)]">{t.proposal.body}</div>
                    <div className="flex justify-end gap-[var(--spacing-component-sm)]">
                      {t.proposal.state === 'accepted' ? (
                        <Badge variant="secondary">{t.proposal.accepted}</Badge>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => setProposal(t.id, 'discarded')}>Discard</Button>
                          <Button size="sm" onClick={() => { setProposal(t.id, 'accepted'); t.proposal!.onAccept(); }}>{t.proposal.accept}</Button>
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
            {script.suggestions.map((s) => <Suggestion key={s} suggestion={s} onClick={send} />)}
          </div>
        )}
        <PromptInput onSubmit={onSubmit} className="[&_[data-slot=input-group]]:rounded-[var(--chat-composer-radius)] [&_[data-slot=input-group]]:border-[var(--chat-composer-border)] [&_[data-slot=input-group]]:bg-[var(--chat-composer-bg)]">
          <PromptInputBody>
            <div className="flex w-full flex-wrap gap-[var(--spacing-component-xs)] px-[var(--spacing-component-md)] pt-[var(--spacing-component-sm)]">
              <Tip label="Current context">
                <span className="inline-flex"><Badge variant="secondary">{script.context}</Badge></span>
              </Tip>
            </div>
            <PromptInputTextarea value={text} onChange={(e) => setText(e.target.value)} placeholder={typeof script.placeholder === 'function' ? script.placeholder(mode) : script.placeholder} />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {script.modes && mode && (
                <PromptInputSelect value={mode} onValueChange={setMode}>
                  <PromptInputSelectTrigger aria-label="Mode" className="h-7 w-auto gap-[var(--spacing-component-xs)] border-none px-[var(--spacing-component-sm)] text-xs shadow-none"><PromptInputSelectValue /></PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    {script.modes.map((m) => <PromptInputSelectItem key={m} value={m}>{m}</PromptInputSelectItem>)}
                  </PromptInputSelectContent>
                </PromptInputSelect>
              )}
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
