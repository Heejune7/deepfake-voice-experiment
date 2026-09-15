import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { flattenSessions, type FlatResultRow, type SessionWithTrials } from './types';
import { toCsv, downloadCsv } from './csv';

export default function AdminDashboard() {
  const [rows, setRows] = useState<FlatResultRow[]>([]);
  const [sessionCount, setSessionCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase 설정이 되어 있지 않습니다.');
      setLoading(false);
      return;
    }

    supabase
      .from('sessions')
      .select(
        'id, participant_id, started_at, finished_at, trial_results(trial_index, ai_file, real_file, ai_position, choice, is_correct, confidence, response_time_ms, play_count_a, play_count_b)',
      )
      .order('started_at', { ascending: false })
      .then(({ data, error: fetchError }) => {
        if (fetchError) {
          setError('데이터를 불러오지 못했습니다: ' + fetchError.message);
        } else {
          const sessions = (data ?? []) as SessionWithTrials[];
          setSessionCount(sessions.length);
          setRows(flattenSessions(sessions));
        }
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    supabase?.auth.signOut();
  };

  const handleDownload = () => {
    const csv = toCsv(rows);
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(csv, `voice-experiment-results-${date}.csv`);
  };

  const correctCount = rows.filter((r) => r.is_correct).length;

  return (
    <div className="card card-wide">
      <div className="admin-header">
        <h1>실험 결과</h1>
        <button className="secondary" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      {loading && <p className="hint">불러오는 중...</p>}
      {error && <p className="hint error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-value">{sessionCount}</div>
              <div className="stat-label">참가자 수</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">{rows.length}</div>
              <div className="stat-label">총 시행 수</div>
            </div>
            <div className="stat-box">
              <div className="stat-value">
                {rows.length > 0 ? Math.round((correctCount / rows.length) * 100) : 0}%
              </div>
              <div className="stat-label">정답률</div>
            </div>
          </div>

          <button className="primary" onClick={handleDownload} disabled={rows.length === 0}>
            CSV 다운로드
          </button>

          <div className="table-wrap">
            <table className="results-table">
              <thead>
                <tr>
                  <th>참가자 ID</th>
                  <th>시행</th>
                  <th>AI 파일</th>
                  <th>Real 파일</th>
                  <th>AI 위치</th>
                  <th>선택</th>
                  <th>정답</th>
                  <th>확신도</th>
                  <th>반응시간(ms)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={`${row.session_id}-${row.trial_index}-${i}`}>
                    <td>{row.participant_id}</td>
                    <td>{row.trial_index + 1}</td>
                    <td>{row.ai_file}</td>
                    <td>{row.real_file}</td>
                    <td>{row.ai_position}</td>
                    <td>{row.choice}</td>
                    <td>{row.is_correct ? 'O' : 'X'}</td>
                    <td>{row.confidence}</td>
                    <td>{row.response_time_ms}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
