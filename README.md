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

## 음성 파일 교체/추가

`public/audio/`에 파일을 넣고 [`src/data/stimuli.ts`](src/data/stimuli.ts)의 `AI_FILES`, `REAL_FILES` 배열을 수정하면 자동으로 모든 조합이 시행으로 생성됩니다.
