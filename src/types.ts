export type TrialChoice = 'A' | 'B';

export interface TrialConfig {
  trialIndex: number;
  aiFile: string;
  realFile: string;
  /** AI 음성이 배치된 위치 (참가자별/시행별로 무작위 배정) */
  aiPosition: TrialChoice;
}

export interface TrialResult extends TrialConfig {
  choice: TrialChoice;
  isCorrect: boolean;
  confidence: number; // 1~5
  responseTimeMs: number;
  playCountA: number;
  playCountB: number;
}

export interface SessionData {
  participantId: string;
  startedAt: string;
  finishedAt: string | null;
  trials: TrialResult[];
}

export type Screen = 'consent' | 'instructions' | 'trial' | 'complete';
