'use client';
// Create record — one Record (title) with one or more feedback blocks, each about one person
// (PRD-023 RQ-02/03/04, PO feedback §2; layout ours: records-build.md → Create record). Two
// segmented tabs, "Write feedback manually" · "Analyze files with AI":
//   Write       every field shows on open; each block is a flat Card. Recipient = a searchable
//               Combobox (name or email, avatars) with "You" first (explicit, never a default); once
//               chosen, the manager who will be asked shows under it (PRD: seen before sending).
//   From files  add PDF / DOCX / TXT (10 files, 10 MB each, 50 MB total) → Draft feedback → the form
//               locks while AI reads → AI drafts come back as the same blocks, marked "AI draft" until
//               sent, with their source (file · page · quote). A person AI isn't sure of is never
//               picked for you: the block names the candidates and you choose. A file that can't be
//               read → Retry or Write instead. MOCK: any upload returns the same drafts; a file
//               named "damaged" fails (user, 2026-10-15).
// Save draft needs a title only; Save and submit checks every block and sends them all, or none
// (BR-23), with no second preview step. Also edits a record's drafts (same form, no tabs).

import * as React from 'react';
import { FileTextIcon, PencilSimpleIcon, PlusIcon, SparkleIcon, TrashIcon, UploadSimpleIcon, WarningCircleIcon, XIcon } from '@phosphor-icons/react/ssr';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ComboboxField } from '@/components/ui/combobox';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Empty } from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  FILE_LIMITS, FILE_TYPES, ME, managerOf, mockAiDrafts, nameOf, people, type RecordItem, type SourceRef,
} from './mock-data';

export interface RecordDraft {
  /** Set when editing an existing record's drafts */
  recordId?: string;
  title: string;
  blocks: { id?: string; recipientId: string; content: string; aiDraft?: boolean; source?: SourceRef }[];
  submit: boolean;
}

interface Block {
  key: number; id?: string; recipientId: string; content: string;
  aiDraft?: boolean; source?: SourceRef; unsure?: { said: string; candidates: string[] };
}
interface PickedFile { name: string; size: number }
type FilesStep = 'add' | 'reading' | 'review' | 'error';

const recipientOptions = [
  { value: ME, label: 'You', avatar: people[ME].initials, hint: people[ME].email },
  ...Object.values(people).filter((p) => p.id !== ME).sort((a, b) => a.name.localeCompare(b.name))
    .map((p) => ({ value: p.id, label: p.name, avatar: p.initials, hint: p.email })),
];

let nextKey = 1;
const emptyBlock = (): Block => ({ key: nextKey++, recipientId: '', content: '' });
const isBlank = (b: Block) => b.recipientId === '' && b.content.trim() === '';
const mb = (bytes: number) => bytes / (1024 * 1024);
const sizeLabel = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${mb(bytes).toFixed(1)} MB`);
const err = 'text-body-xs text-[var(--color-text-invalid)]';
const muted = 'text-body-xs text-[var(--color-text-secondary)]';

export function CreateRecordDialog({ open, editing, onOpenChange, onSave }: {
  open: boolean;
  /** Edit a record's drafts instead of creating one */
  editing?: { recordId: string; title: string; drafts: RecordItem[] };
  onOpenChange: (o: boolean) => void;
  onSave: (d: RecordDraft) => void;
}) {
  const [mode, setMode] = React.useState<'write' | 'files'>('write');
  const [title, setTitle] = React.useState(editing?.title ?? '');
  const [blocks, setBlocks] = React.useState<Block[]>(() =>
    editing?.drafts.length
      ? editing.drafts.map((d) => ({ key: nextKey++, id: d.id, recipientId: d.recipientId, content: d.content, aiDraft: d.aiDraft, source: d.source }))
      : [emptyBlock()]);
  const [tried, setTried] = React.useState<'draft' | 'submit' | 'files' | null>(null);
  const [files, setFiles] = React.useState<PickedFile[]>([]);
  const [fileErrors, setFileErrors] = React.useState<string[]>([]);
  const [step, setStep] = React.useState<FilesStep>('add');
  const [failed, setFailed] = React.useState('');
  const browse = React.useRef<HTMLInputElement>(null);

  const titleMissing = title.trim() === '';
  const blockErrors = (b: Block) => ({ recipient: b.recipientId === '', content: b.content.trim() === '' });
  const update = (key: number, patch: Partial<Block>) => setBlocks((list) => list.map((b) => (b.key === key ? { ...b, ...patch } : b)));

  // AI reading (mock): 1.5s, then drafts or the error. The form is locked meanwhile.
  React.useEffect(() => {
    if (step !== 'reading') return;
    const t = setTimeout(() => {
      const bad = files.find((f) => f.name.toLowerCase().includes('damaged'));
      if (bad) { setFailed(bad.name); setStep('error'); return; }
      const drafts = mockAiDrafts(files.map((f) => f.name)).map((d) => ({ key: nextKey++, ...d, aiDraft: true }));
      setBlocks((list) => [...list.filter((b) => !isBlank(b)), ...drafts]);
      setStep('review');
    }, 1500);
    return () => clearTimeout(t);
  }, [step, files]);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const problems: string[] = [];
    const next = [...files];
    for (const f of Array.from(list)) {
      const ext = f.name.split('.').pop()?.toLowerCase() ?? '';
      if (!FILE_TYPES.includes(ext)) problems.push(`${f.name}: only PDF, DOCX or TXT`);
      else if (mb(f.size) > FILE_LIMITS.eachMB) problems.push(`${f.name} is over ${FILE_LIMITS.eachMB} MB`);
      else if (next.length >= FILE_LIMITS.count) problems.push(`Up to ${FILE_LIMITS.count} files`);
      else if (mb(next.reduce((n, x) => n + x.size, 0) + f.size) > FILE_LIMITS.totalMB) problems.push(`Up to ${FILE_LIMITS.totalMB} MB in total`);
      else if (!next.some((x) => x.name === f.name)) next.push({ name: f.name, size: f.size });
    }
    setFiles(next);
    setFileErrors([...new Set(problems)]);
  };

  const draftFromFiles = () => {
    setTried('files');
    if (titleMissing || files.length === 0) return;
    setStep('reading');
  };

  const save = (submit: boolean) => {
    setTried(submit ? 'submit' : 'draft');
    if (titleMissing) return;
    if (submit && blocks.some((b) => { const e = blockErrors(b); return e.recipient || e.content; })) return;
    // A block left completely empty isn't saved as a draft.
    const kept = blocks.filter((b) => !isBlank(b));
    onSave({
      recordId: editing?.recordId,
      title: title.trim(),
      blocks: kept.map((b) => ({ id: b.id, recipientId: b.recipientId, content: b.content.trim(), aiDraft: b.aiDraft, source: b.source })),
      submit,
    });
  };

  const showFileStep = mode === 'files' && step !== 'review';
  const locked = step === 'reading';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] max-w-[560px]" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit record' : 'Create record'}</DialogTitle>
        </DialogHeader>

        {!editing && (
          <Tabs value={mode} onValueChange={(v) => { if (!locked && (v === 'write' || v === 'files')) setMode(v); }}>
            {/* Segmented tabs (Tabs default), labels as the current product (user, 2026-10-15) */}
            <TabsList className="w-full">
              <TabsTrigger value="write" disabled={locked} className="flex-1"><PencilSimpleIcon aria-hidden="true" />Write feedback manually</TabsTrigger>
              <TabsTrigger value="files" disabled={locked} className="flex-1"><SparkleIcon aria-hidden="true" />Analyze files with AI</TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        <div className="-mx-[var(--spacing-component-xs)] flex min-h-0 flex-1 flex-col gap-[var(--spacing-component-lg)] overflow-y-auto px-[var(--spacing-component-xs)] pb-[var(--spacing-component-xs)]">
          {step === 'reading' ? (
            <div className="flex flex-col items-center justify-center gap-[var(--spacing-component-sm)] py-[var(--spacing-layout-md)]" aria-live="polite">
              <Spinner className="size-6 text-[var(--color-icon-brand)]" />
              <p className="text-body-sm text-[var(--color-surface-overlay-foreground)]">Reading {files.length} {files.length === 1 ? 'file' : 'files'}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                <Label htmlFor="record-title">Title</Label>
                <Input id="record-title" value={title} autoFocus aria-invalid={(tried !== null && titleMissing) || undefined}
                  onChange={(e) => setTitle(e.target.value)} />
                {tried !== null && titleMissing && <p className={err}>Enter a title</p>}
              </div>

              {showFileStep && step === 'error' ? (
                <div className="flex flex-col gap-[var(--spacing-component-md)]">
                  <Alert variant="destructive" icon={<WarningCircleIcon aria-hidden="true" />}>
                    <AlertTitle>Couldn’t read {failed}</AlertTitle>
                    <AlertDescription>The file is empty or damaged.</AlertDescription>
                  </Alert>
                  <div className="flex gap-[var(--spacing-component-sm)]">
                    {/* Retry without the file that failed; back to Add if nothing is left */}
                    <Button variant="outline" size="sm" onClick={() => { const left = files.filter((f) => f.name !== failed); setFiles(left); setStep(left.length ? 'reading' : 'add'); }}>Retry</Button>
                    <Button variant="outline" size="sm" onClick={() => { setStep('add'); setMode('write'); }}>Write instead</Button>
                  </div>
                </div>
              ) : showFileStep ? (
                <div className="flex flex-col gap-[var(--spacing-component-sm)]">
                  {/* Drop zone: Empty outline (its spec: "dropzone areas") */}
                  <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
                    <Empty variant="outline" icon={<UploadSimpleIcon className="h-5 w-5" aria-hidden="true" />}
                      title="Drop files here" description={`PDF, DOCX, TXT · up to ${FILE_LIMITS.count} files, ${FILE_LIMITS.eachMB} MB each`}
                      primaryAction={<Button variant="outline" size="sm" onClick={() => browse.current?.click()}>Browse files</Button>} />
                  </div>
                  <input ref={browse} type="file" multiple accept=".pdf,.docx,.txt" className="sr-only" tabIndex={-1} aria-hidden="true"
                    onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
                  {fileErrors.map((m) => <p key={m} className={err}>{m}</p>)}
                  {tried === 'files' && files.length === 0 && <p className={err}>Add at least one file</p>}
                  {files.length > 0 && (
                    <ul className="flex flex-col gap-[var(--spacing-component-xs)]" aria-label="Files">
                      {files.map((f) => (
                        <li key={f.name} className="flex items-center gap-[var(--spacing-component-sm)] text-body-sm text-[var(--color-surface-overlay-foreground)]">
                          <FileTextIcon className="h-4 w-4 shrink-0 text-[var(--color-icon-default)]" aria-hidden="true" />
                          <span className="min-w-0 flex-1 truncate">{f.name}</span>
                          <span className={muted}>{sizeLabel(f.size)}</span>
                          <Button variant="ghost" size="icon-sm" aria-label={`Remove ${f.name}`} onClick={() => setFiles((l) => l.filter((x) => x.name !== f.name))}>
                            <XIcon aria-hidden="true" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <>
                  {blocks.map((b, i) => {
                    const e = blockErrors(b);
                    const show = tried === 'submit';
                    const managerId = b.recipientId ? managerOf[b.recipientId] : undefined;
                    const unsure = b.unsure && b.recipientId === '' ? b.unsure : undefined;
                    const recipientMsg = unsure
                      ? `Not sure who “${unsure.said}” is: ${unsure.candidates.map(nameOf).join(' or ')}. Choose one.`
                      : show && e.recipient ? 'Choose a recipient' : undefined;
                    return (
                      // One block = a flat Card (it sits in a Dialog, which already floats)
                      <Card key={b.key} size="compact" elevation="flat" role="group" aria-label={`Feedback ${i + 1}`}>
                        <div className="flex items-center justify-between gap-[var(--spacing-component-sm)]">
                          <h3 className="text-heading-xs text-[var(--color-surface-default-foreground)]">Feedback {i + 1}</h3>
                          <div className="flex items-center gap-[var(--spacing-component-xs)]">
                            {b.aiDraft && <Badge variant="outline" shape="pill"><SparkleIcon aria-hidden="true" />AI draft</Badge>}
                            {blocks.length > 1 && (
                              <Button variant="ghost" size="sm" onClick={() => setBlocks((list) => list.filter((x) => x.key !== b.key))}>
                                <TrashIcon aria-hidden="true" />Remove
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                          <ComboboxField id={`recipient-${b.key}`} label="Recipient" type="search" placeholder="Search by name or email"
                            options={recipientOptions} defaultValue={b.recipientId || undefined}
                            aria-invalid={recipientMsg ? true : undefined} description={recipientMsg}
                            onValueChange={(v) => update(b.key, { recipientId: typeof v === 'string' ? v : '' })} />
                          {managerId && <p className={muted}>Manager: {managerId === ME ? 'You' : nameOf(managerId)}</p>}
                        </div>
                        <div className="flex flex-col gap-[var(--spacing-component-xs)]">
                          <Label htmlFor={`content-${b.key}`}>Feedback</Label>
                          <Textarea id={`content-${b.key}`} rows={3} value={b.content}
                            aria-invalid={(show && e.content) || undefined}
                            onChange={(ev) => update(b.key, { content: ev.target.value })} />
                          {show && e.content && <p className={err}>Write the feedback</p>}
                          {b.source && (
                            <p className={`flex min-w-0 items-center gap-[var(--spacing-component-xxs)] ${muted}`}>
                              <FileTextIcon className="h-3 w-3 shrink-0" aria-hidden="true" />
                              <span className="truncate">
                                {b.source.file}{b.source.page ? ` · p. ${b.source.page}` : ''}{b.source.quote ? ` · “${b.source.quote}…”` : ''}
                              </span>
                            </p>
                          )}
                        </div>
                      </Card>
                    );
                  })}
                  <Button variant="outline" size="sm" className="self-start" onClick={() => setBlocks((list) => [...list, emptyBlock()])}>
                    <PlusIcon aria-hidden="true" />Add feedback
                  </Button>
                </>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => (locked ? setStep('add') : onOpenChange(false))}>Cancel</Button>
          {showFileStep && step === 'add' && (
            <Button onClick={draftFromFiles}><SparkleIcon aria-hidden="true" />Draft feedback</Button>
          )}
          {!showFileStep && !locked && (
            <>
              <Button variant="outline" onClick={() => save(false)}>Save draft</Button>
              <Button onClick={() => save(true)}>Save and submit</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
