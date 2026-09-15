import type { SessionData } from '../types';

interface Props {
  session: SessionData;
  saveState: 'saving' | 'saved' | 'error';
  onRetry: () => void;
}

export default function CompletionScreen({ session, saveState, onRetry }: Props) {
  return (
    <div className="card">
      <h1>실험이 종료되었습니다</h1>
      <p className="lead">참여해 주셔서 감사합니다.</p>

      <div className="summary">
        <p>
          참가자 ID: <strong>{session.participantId}</strong>
        </p>
      </div>

      {saveState === 'saving' && <p className="hint">결과를 저장하는 중입니다...</p>}
      {saveState === 'saved' && <p className="hint">결과가 저장되었습니다.</p>}
      {saveState === 'error' && (
        <>
          <p className="hint error">
            결과 저장 중 문제가 발생했습니다. 인터넷 연결을 확인한 후 다시 시도해 주세요.
          </p>
          <button className="primary" onClick={onRetry}>
            다시 시도
          </button>
        </>
      )}
    </div>
  );
}
