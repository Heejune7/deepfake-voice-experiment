export interface TrialResultRow {
  trial_index: number;
  ai_file: string;
  real_file: string;
  ai_position: 'A' | 'B';
  choice: 'A' | 'B';
  is_correct: boolean;
  confidence: number;
  response_time_ms: number;
  play_count_a: number;
  play_count_b: number;
}

export interface SessionWithTrials {
  id: string;
  participant_id: string;
  started_at: string;
  finished_at: string | null;
  trial_results: TrialResultRow[];
}

export interface FlatResultRow extends TrialResultRow {
  session_id: string;
  participant_id: string;
  started_at: string;
  finished_at: string | null;
}

export function flattenSessions(sessions: SessionWithTrials[]): FlatResultRow[] {
  const rows: FlatResultRow[] = [];
  for (const session of sessions) {
    const sortedTrials = [...session.trial_results].sort(
      (a, b) => a.trial_index - b.trial_index,
    );
    for (const trial of sortedTrials) {
      rows.push({
        session_id: session.id,
        participant_id: session.participant_id,
        started_at: session.started_at,
        finished_at: session.finished_at,
        ...trial,
      });
    }
  }
  return rows;
}
