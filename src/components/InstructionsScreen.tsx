interface Props {
  trialCount: number;
  onNext: () => void;
}

export default function InstructionsScreen({ trialCount, onNext }: Props) {
  return (
    <div className="card">
      <h1>안내사항</h1>
      <ol className="instructions">
        <li>각 시행마다 A와 B, 두 개의 음성이 제시됩니다.</li>
        <li>두 음성을 모두 들은 후, 어느 쪽이 AI가 생성한 음성이라고 생각하는지 선택해 주세요.</li>
        <li>선택에 대한 확신 정도를 1점(전혀 확신 없음)~5점(매우 확신함)으로 평가해 주세요.</li>
        <li>총 {trialCount}개의 시행이 진행되며, 중간에 이전 시행으로 돌아갈 수 없습니다.</li>
        <li>이어폰 또는 헤드폰 사용을 권장합니다.</li>
      </ol>
      <button className="primary" onClick={onNext}>
        시행 시작
      </button>
    </div>
  );
}
