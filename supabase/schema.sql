-- Supabase SQL editor에서 실행하세요.

create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  participant_id text not null,
  started_at timestamptz not null,
  finished_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists trial_results (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references sessions(id) on delete cascade,
  trial_index int not null,
  ai_file text not null,
  real_file text not null,
  ai_position text not null check (ai_position in ('A', 'B')),
  choice text not null check (choice in ('A', 'B')),
  is_correct boolean not null,
  confidence int not null check (confidence between 1 and 5),
  response_time_ms int not null,
  play_count_a int not null,
  play_count_b int not null,
  created_at timestamptz not null default now()
);

alter table sessions enable row level security;
alter table trial_results enable row level security;

-- 익명 참가자가 자신의 응답을 저장할 수만 있도록 허용 (조회/수정/삭제는 불가)
create policy "anon can insert sessions"
  on sessions for insert
  to anon
  with check (true);

create policy "anon can insert trial_results"
  on trial_results for insert
  to anon
  with check (true);

-- RLS 정책만으로는 부족하며, 테이블 단위 권한도 별도로 부여해야 합니다.
grant usage on schema public to anon;
grant insert on sessions to anon;
grant insert on trial_results to anon;
