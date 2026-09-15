import { supabase } from './supabaseClient';
import type { SessionData } from '../types';

export async function saveSession(session: SessionData): Promise<void> {
  if (!supabase) {
    console.warn('[saveSession] Supabase가 설정되지 않아 콘솔에만 기록합니다.', session);
    return;
  }

  const { data: sessionRow, error: sessionError } = await supabase
    .from('sessions')
    .insert({
      participant_id: session.participantId,
      started_at: session.startedAt,
      finished_at: session.finishedAt,
    })
    .select('id')
    .single();

  if (sessionError || !sessionRow) {
    throw sessionError ?? new Error('세션 저장에 실패했습니다.');
  }

  const trialRows = session.trials.map((trial) => ({
    session_id: sessionRow.id,
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
