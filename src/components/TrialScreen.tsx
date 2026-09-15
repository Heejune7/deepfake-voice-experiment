import { useRef, useState } from 'react';
import type { TrialConfig, TrialChoice, TrialResult } from '../types';

interface Props {
  trial: TrialConfig;
  trialNumber: number;
  totalTrials: number;
  onSubmit: (result: TrialResult) => void;
}

const CONFIDENCE_LEVELS = [1, 2, 3, 4, 5];

export default function TrialScreen({ trial, trialNumber, totalTrials, onSubmit }: Props) {
  const [choice, setChoice] = useState<TrialChoice | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [playCountA, setPlayCountA] = useState(0);
  const [playCountB, setPlayCountB] = useState(0);
  const startTimeRef = useRef(performance.now());

  const fileForPosition = (position: TrialChoice) =>
    trial.aiPosition === position ? trial.aiFile : trial.realFile;

  const bothPlayed = playCountA > 0 && playCountB > 0;
  const canSubmit = bothPlayed && choice !== null && confidence !== null;

  const handleSubmit = () => {
    if (!canSubmit || choice === null || confidence === null) return;
    onSubmit({
      ...trial,
      choice,
      isCorrect: choice === trial.aiPosition,
      confidence,
      responseTimeMs: Math.round(performance.now() - startTimeRef.current),
      playCountA,
      playCountB,
    });
  };

  return (
    <div className="card">
      <div className="progress-label">
        시행 {trialNumber} / {totalTrials}
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${(trialNumber / totalTrials) * 100}%` }}
        />
      </div>

      <h2>두 음성을 모두 들어보세요</h2>

      <div className="audio-pair">
        <div className="audio-slot">
          <span className="audio-label">A</span>
          <audio
            controls
            src={fileForPosition('A')}
            onPlay={() => setPlayCountA((c) => c + 1)}
          />
        </div>
        <div className="audio-slot">
          <span className="audio-label">B</span>
          <audio
            controls
            src={fileForPosition('B')}
            onPlay={() => setPlayCountB((c) => c + 1)}
          />
        </div>
      </div>
      {!bothPlayed && (
        <p className="hint">선택하기 전에 A와 B 음성을 모두 재생해 주세요.</p>
      )}

      <fieldset className="question" disabled={!bothPlayed}>
        <legend>어느 쪽이 AI 음성이라고 생각하십니까?</legend>
        <div className="choice-row">
          {(['A', 'B'] as TrialChoice[]).map((option) => (
            <button
              key={option}
              type="button"
              className={`choice-button ${choice === option ? 'selected' : ''}`}
              onClick={() => setChoice(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="question" disabled={choice === null}>
        <legend>선택에 대해 얼마나 확신하십니까?</legend>
        <div className="confidence-row">
          <span className="confidence-endpoint">1 (확신 없음)</span>
          {CONFIDENCE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              className={`confidence-button ${confidence === level ? 'selected' : ''}`}
              onClick={() => setConfidence(level)}
            >
              {level}
            </button>
          ))}
          <span className="confidence-endpoint">5 (매우 확신)</span>
        </div>
      </fieldset>

      <button className="primary" disabled={!canSubmit} onClick={handleSubmit}>
        {trialNumber === totalTrials ? '제출하고 완료' : '다음 시행'}
      </button>
    </div>
  );
}
