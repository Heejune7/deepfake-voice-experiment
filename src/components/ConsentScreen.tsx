import { useState } from 'react';

interface Props {
  onStart: (participantId: string) => void;
}

function generateParticipantId(): string {
  return 'P-' + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function ConsentScreen({ onStart }: Props) {
  const [participantId, setParticipantId] = useState(generateParticipantId());
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="card">
      <h1>AI 음성 판별 실험</h1>
      <p className="lead">
        본 실험은 두 개의 음성 중 어느 것이 AI가 생성한 음성인지 판단하는 연구입니다.
        소요 시간은 약 5분이며, 수집된 응답은 연구 목적으로만 사용됩니다.
      </p>

      <label className="field">
        참가자 ID
        <input
          type="text"
          value={participantId}
          onChange={(e) => setParticipantId(e.target.value)}
        />
      </label>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        />
        연구 참여에 동의하며, 응답이 익명으로 저장되는 것에 동의합니다.
      </label>

      <button
        className="primary"
        disabled={!agreed || participantId.trim() === ''}
        onClick={() => onStart(participantId.trim())}
      >
        시작하기
      </button>
    </div>
  );
}
