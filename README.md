# AI 음성 판별 실험

참가자가 AI 음성과 실제(real) 음성을 듣고 어느 쪽이 AI인지 선택한 뒤, 그 선택에 대한 확신도(1~5점)를 평가하는 웹 기반 지각 실험입니다.

## 실험 절차

1. 참가자 ID 입력 및 참여 동의
2. 안내사항 확인
3. `audio/ai_*.wav` × `audio/real_*.wav`의 모든 조합(현재 2×2 = 4시행)을 참가자마다 무작위 순서·좌우(A/B) 배치로 제시
4. 각 시행: A/B 음성을 모두 들은 후 AI 음성 선택 → 확신도(1~5점) 평가
5. 완료 후 결과를 Supabase에 저장

## 개발 환경 실행

```bash
npm install
npm run dev
```

## Supabase 연동

1. [supabase.com](https://supabase.com)에서 프로젝트를 생성합니다.
2. SQL Editor에서 [`supabase/schema.sql`](supabase/schema.sql)의 내용을 실행해 `sessions`, `trial_results` 테이블을 만듭니다.
3. 프로젝트 Settings > API에서 Project URL과 anon public key를 확인합니다.
4. `.env.example`을 `.env`로 복사하고 값을 채웁니다.

```bash
cp .env.example .env
```

`.env`는 `.gitignore`에 포함되어 있어 저장소에 커밋되지 않습니다. 배포 시에는 호스팅 플랫폼(Vercel 등)의 환경 변수에 동일한 값을 등록하세요.

## 배포

`master`에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 빌드해 GitHub Pages에 배포합니다. `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`는 저장소 Settings > Secrets and variables > Actions에 등록되어 있어야 합니다.

## 관리자 결과 화면

`/#admin` 경로(예: `https://<user>.github.io/deepfake-voice-experiment/#admin`)에서 이메일/비밀번호로 로그인하면 전체 결과를 표로 보고 CSV로 내려받을 수 있습니다.

설정 방법:

1. Supabase 대시보드 **Authentication > Users**에서 관리자 계정을 직접 추가합니다(이메일: `june@cup.ac.kr`, 비밀번호는 원하는 값). "Auto Confirm User"를 체크해 이메일 인증 없이 바로 로그인 가능하게 합니다.
2. SQL Editor에서 [`supabase/schema.sql`](supabase/schema.sql)의 `admin can select ...` 정책과 `grant ... to authenticated` 구문을 실행합니다(이미 실행했다면 생략).
3. 다른 이메일로 관리자를 추가/변경하려면 `schema.sql`의 `june@cup.ac.kr` 부분을 바꾸고 다시 실행하세요.
4. (권장) **Authentication > Providers > Email**에서 "Allow new users to sign up"을 꺼서 임의 가입을 막습니다. 데이터 조회 정책이 특정 이메일로 제한되어 있어 필수는 아니지만, 방어적으로 꺼두는 것이 안전합니다.

## 음성 파일 교체/추가

`public/audio/`에 파일을 넣고 [`src/data/stimuli.ts`](src/data/stimuli.ts)의 `AI_FILES`, `REAL_FILES` 배열을 수정하면 자동으로 모든 조합이 시행으로 생성됩니다.
