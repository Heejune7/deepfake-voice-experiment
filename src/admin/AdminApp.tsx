import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import '../App.css';

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (!supabase) {
      setLoggedIn(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  return (
    <div className="app-shell">
      {loggedIn === null && <div className="card">로딩 중...</div>}
      {loggedIn === false && <AdminLogin onLogin={() => setLoggedIn(true)} />}
      {loggedIn === true && <AdminDashboard />}
    </div>
  );
}
