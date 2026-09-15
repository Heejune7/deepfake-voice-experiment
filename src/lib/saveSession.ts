import { supabase } from './supabaseClient';
import type { SessionData } from '../types';

export async function saveSession(session: SessionData): Promise<void> {
  if (!supabase) {
    console.warn('[saveSession] Supabase가 설정되지 않아 콘솔에만 기록합니다.', session);
    return;
  }

  const sessionId = crypto.randomUUID();

  const { error: sessionError } = await supabase.from('sessions').insert({
    id: sessionId,
    participant_id: session.participantId,
    started_at: session.startedAt,
    finished_at: session.finishedAt,
  });

  if (sessionError) {
    throw sessionError;
  }

  const trialRows = session.trials.map((trial) => ({
    session_id: sessionId,
    trial_index: trial.trialIndex,
    ai_file: trial.aiFile,
    real_file: trial.realFile,
    ai_position: trial.aiPosition,
    choice: trial.choice,
    is_correct: trial.isCorrect,
    confidence: trial.confidence,
    response_time_ms: trial.responseTimeMs,
    play_count_a: trial.playCountA,
    play_count_b: trial.playCountB,
  }));

  const { error: trialsError } = await supabase.from('trial_results').insert(trialRows);

  if (trialsError) {
    throw trialsError;
  }
}
