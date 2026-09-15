import type { TrialConfig, TrialChoice } from '../types';

export const AI_FILES = ['audio/ai_01.wav', 'audio/ai_02.wav'];
export const REAL_FILES = ['audio/real_01.wav', 'audio/real_02.wav'];

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** AI 파일 x 실제 파일의 모든 조합으로 시행을 생성하고, 순서와 좌우 배치를 무작위화한다. */
export function buildTrials(): TrialConfig[] {
  const pairs: Array<{ aiFile: string; realFile: string }> = [];
  for (const aiFile of AI_FILES) {
    for (const realFile of REAL_FILES) {
      pairs.push({ aiFile, realFile });
    }
  }

  const shuffledPairs = shuffle(pairs);

  return shuffledPairs.map((pair, index) => {
    const aiPosition: TrialChoice = Math.random() < 0.5 ? 'A' : 'B';
    return {
      trialIndex: index,
      aiFile: pair.aiFile,
      realFile: pair.realFile,
      aiPosition,
    };
  });
}
