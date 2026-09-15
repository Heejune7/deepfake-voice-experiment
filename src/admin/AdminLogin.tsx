import { useState, type FormEvent } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Props {
  onLogin: () => void;
}

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!supabase) {
      setError('Supabase 설정이 되어 있지 않습니다.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError('로그인에 실패했습니다. 이메일/비밀번호를 확인해 주세요.');
      return;
    }
    onLogin();
  };

  return (
    <div className="card">
      <h1>관리자 로그인</h1>
      <form onSubmit={handleSubmit}>
        <label className="field">
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="field">
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="hint error">{error}</p>}
        <button className="primary" type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>
      </form>
    </div>
  );
}
