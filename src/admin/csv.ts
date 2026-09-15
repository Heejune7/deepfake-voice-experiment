import type { FlatResultRow } from './types';

const HEADERS: Array<keyof FlatResultRow> = [
  'participant_id',
  'session_id',
  'started_at',
  'finished_at',
  'trial_index',
  'ai_file',
  'real_file',
  'ai_position',
  'choice',
  'is_correct',
  'confidence',
  'response_time_ms',
  'play_count_a',
  'play_count_b',
];

function escapeCsvValue(value: unknown): string {
  const str = String(value ?? '');
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

export function toCsv(rows: FlatResultRow[]): string {
  const lines = [HEADERS.join(',')];
  for (const row of rows) {
    lines.push(HEADERS.map((h) => escapeCsvValue(row[h])).join(','));
  }
  return lines.join('\n');
}

export function downloadCsv(csv: string, filename: string) {
  // 앞에 BOM을 붙여야 엑셀에서 한글이 깨지지 않는다.
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
