'use client';
import * as React from 'react';
import { CheckCircleIcon, UploadSimpleIcon, WarningIcon } from '@phosphor-icons/react/ssr';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { departments as departmentOptions, type Expectations, type Level, type Matrix, type Position } from '../mock-data';

// Bulk position creation via pasted CSV — no real backend to upload a file to, so paste is the
// simplest input for the mock. Format: name,code,department,matrix,levels (levels ; separated).
// No quoted-field / escaped-comma support — a prototype-grade parser for a small, controlled
// format, not a general CSV parser. Every row is previewed before anything is created; invalid
// rows are skipped, not blocking the valid ones (same "warn, don't block where possible" spirit
// as the rest of Setup, though here an invalid row truly can't be created — no matrix to hang it on).

interface ParsedRow {
  line: number; name: string; code: string; department: string; matrixName: string; levelNames: string[];
  matrixId?: string; error?: string;
}

const SAMPLE = 'name,code,department,matrix,levels\nBackend Engineer,BE,Engineering,Northstar Engineering,Junior;Mid;Senior;Staff';

function parseCsv(text: string, matrices: Matrix[], existingCodes: Set<string>): ParsedRow[] {
  const lines = text.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  const body = lines[0]?.toLowerCase().startsWith('name,') ? lines.slice(1) : lines;
  const seenCodes = new Set<string>();
  return body.map((line, i) => {
    const [name = '', code = '', department = '', matrixName = '', levels = ''] = line.split(',').map((c) => c.trim());
    const levelNames = levels.split(';').map((l) => l.trim()).filter(Boolean);
    const row: ParsedRow = { line: i + 1, name, code: code.toUpperCase(), department, matrixName, levelNames };
    const matrix = matrices.find((m) => m.status === 'Active' && m.name.toLowerCase() === matrixName.toLowerCase());
    if (!name) row.error = 'Missing name';
    else if (!code) row.error = 'Missing code';
    else if (existingCodes.has(row.code) || seenCodes.has(row.code)) row.error = `Code "${row.code}" already used`;
    else if (!matrix) row.error = `Matrix "${matrixName}" not found or not Active`;
    else if (levelNames.length === 0) row.error = 'Needs at least one level';
    else row.matrixId = matrix.id;
    if (!row.error) seenCodes.add(row.code);
    return row;
  });
}

let seq = 0;

function buildPosition(r: ParsedRow, matrices: Matrix[]): Position {
  const matrix = matrices.find((m) => m.id === r.matrixId)!;
  const levels: Level[] = r.levelNames.map((n) => ({ id: `lvl-imp-${Date.now()}-${seq++}`, name: n, headcount: 0 }));
  const expectations: Expectations = Object.fromEntries(matrix.competencies.map((c) => [c.id, Object.fromEntries(levels.map((l) => [l.id, null]))]));
  return {
    id: `pos-imp-${Date.now()}-${seq++}`, name: r.name, code: r.code,
    department: r.department || departmentOptions[departmentOptions.length - 1],
    status: 'Draft', matrixId: r.matrixId!, levels, expectations, changes: 1,
    editedBy: 'Lan Nguyen', editedAt: 'just now',
    history: [{ who: 'Lan Nguyen', what: 'Imported from CSV', when: 'just now' }],
  };
}

export function ImportPositionsDialog({ open, onOpenChange, matrices, existingCodes, onImport }: {
  open: boolean; onOpenChange: (o: boolean) => void; matrices: Matrix[]; existingCodes: Set<string>;
  onImport: (positions: Position[]) => void;
}) {
  const [text, setText] = React.useState('');
  React.useEffect(() => { if (open) setText(''); }, [open]);

  const rows = React.useMemo(() => (text.trim() ? parseCsv(text, matrices, existingCodes) : []), [text, matrices, existingCodes]);
  const ready = rows.filter((r) => !r.error);

  const confirm = () => {
    if (ready.length === 0) return;
    onImport(ready.map((r) => buildPosition(r, matrices)));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import positions</DialogTitle>
          <DialogDescription>Paste CSV — one position per row. Header row optional.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-[var(--spacing-component-lg)]">
          <div className="flex flex-col gap-[var(--spacing-component-xs)]">
            <Label htmlFor="csv-text">CSV</Label>
            <Textarea id="csv-text" rows={5} value={text} placeholder={SAMPLE} onChange={(e) => setText(e.target.value)} className="font-mono text-xs" />
            <p className="text-xs text-[var(--color-text-secondary)]">
              Columns: name, code, department, matrix, levels (levels separated by <code>;</code>). Matrix must match an existing Active matrix by name.
            </p>
          </div>

          {rows.length > 0 && (
            <div className="flex flex-col gap-[var(--spacing-component-xs)]">
              <p className="text-sm font-semibold">{ready.length} of {rows.length} ready to import</p>
              <ul className="flex max-h-[220px] flex-col gap-[var(--spacing-component-xs)] overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border-default)] p-[var(--spacing-component-sm)] text-sm">
                {rows.map((r) => (
                  <li key={r.line} className="flex items-start gap-[var(--spacing-component-xs)]">
                    {r.error ? (
                      <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-status-warning-subtle-foreground)]" aria-hidden="true" />
                    ) : (
                      <CheckCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-status-success-subtle-foreground)]" aria-hidden="true" />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{r.name || `Row ${r.line}`}</span>
                      {r.error ? (
                        <span className="text-[var(--color-status-warning-subtle-foreground)]"> — {r.error}</span>
                      ) : (
                        <span className="text-[var(--color-text-secondary)]"> — {r.code} · {r.department} · {r.matrixName} · {r.levelNames.length} {r.levelNames.length === 1 ? 'level' : 'levels'}</span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button type="button" disabled={ready.length === 0} onClick={confirm}>
            <UploadSimpleIcon className="h-4 w-4" aria-hidden="true" />Import {ready.length > 0 ? ready.length : ''} {ready.length === 1 ? 'position' : 'positions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
