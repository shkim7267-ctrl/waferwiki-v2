# WaferWiki v2 — Semiconductor Learning Hub

Phase 0은 일반인(비전공) 기준의 **10분 안에 큰그림을 이해**하는 MVP입니다. Phase 1(Investor), Phase 2(Student), Phase 3(Jobseeker) 기본 기능이 구현되어 있습니다.

## Phase 0 (현재 구현 범위)

- `/start` — 10분 스타터(6~8 카드)
- `/map` — 공정 큰그림 지도(단계 클릭 → 우측 패널)
- `/glossary` — 쉬운 용어사전(검색 + 태그 필터 + 상세 페이지)
- `/articles` — 입문용 글 리스트 + 상세

### Phase 0 완료 조건

- Map 클릭 시 상세 패널과 관련 용어/글 추천이 동작한다.
- Glossary 검색이 glossary + articles를 통합 인덱싱하고 audience 필터가 적용된다.
- `sources >= 2` 검증으로 빌드 실패가 실제로 발생한다.
- placeholder 라우트(`/invest`, `/learn`, `/career`)는 존재하되 기능은 없다.

## Phase 1 (Investor) — 구현 완료

- `/invest` — 투자자용 맥락 허브
- `/invest/themes` — 테마/기술 목록 및 상세
- `/invest/companies` — 회사 목록 및 상세
- `/invest/briefs` — 브리핑 목록 및 상세
- 핵심 기능: 테마→공급망 매핑, 타임라인 이벤트, 브리핑

## Phase 2 (Student) — 구현 완료

- `/learn` — 학습 허브 홈
- `/learn/paths` — 학습 경로 목록/상세 (체크리스트 + 진행률 저장)
- `/learn/concepts` — 개념 카드 + 선수/후속 연결
- `/learn/quiz` — 퀴즈 허브/실행

## Phase 3 (Jobseeker) — 구현 완료

- `/career` — 직무맵/면접/프로젝트 허브
- `/career/roles` — 직무 목록 및 상세 (스킬 매트릭스 + 체크)
- `/career/questions` — 면접 Q뱅크
- `/career/projects` — 미니 프로젝트 템플릿
- `/career/checklist` — 직무별 체크리스트 통합 관리

## 콘텐츠 저장 방식

모든 콘텐츠는 Git에 저장되는 Markdown/MDX입니다.

**Frontmatter 공통 필드**
- `title` 또는 `term`
- `summary_3lines` (optional)
- `tags` (string[])
- `audiences` ("general" | "investor" | "student" | "jobseeker")[]
- `updated_at` (ISO)
- `sources` (URL[])

**파일 경로**
- `content/glossary/*.md`
- `content/articles/*.mdx`
- `content/start/*.mdx`
- `content/map/*.md`

## 추천 로직

- tags + audiences 매칭 우선, 동점 시 최신 `updated_at` 우선.

## 검색

- 클라이언트에서 glossary + articles 통합 인덱싱 (flexsearch).
- 결과에 audiences 필터 적용 (기본 `general`).

## 검증 규칙 (빌드 실패)

- `articles`, `start`, `map` 문서는 `sources >= 2` 미만이면 빌드 실패.
- `invest`(themes/companies/briefs) 문서는 `sources >= 2` 미만이면 빌드 실패.
- `invest/events`는 `sources >= 1` 미만이면 빌드 실패.
- `glossary`는 0~2 허용(권장 1)이며 경고만 출력.
- `learn` 콘텐츠는 sources 권장(특히 concepts)이나 빌드 실패 조건에는 포함하지 않음.
- `career` 콘텐츠는 sources 0~2 허용. 회사/제도/수치 주장에는 sources 권장.
- 투자 조언/종목 추천/가격 전망 문구 금지.

## 디스클레이머

- 본 사이트는 투자 조언, 종목 추천, 가격 전망을 제공하지 않습니다.
- 기업 내부정보/전형 유출/허위 사실 단정은 제공하지 않습니다.

## 자동 생성 파이프라인 (향후)

향후 GitHub Actions 크론으로 콘텐츠 자동 생성 예정.
- 스텝 1: 자동 생성 스크립트가 `content/` 아래에 MD/MDX 파일 생성
- 스텝 2: PR 생성 → 리뷰 후 머지
- 스텝 3: `sources` 검증 통과 시 배포

## 개발

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

## 배포

Cloudflare Pages 기준 정적 export(`output: 'export'`) 설정.

## 로그인 + AI 대화 + 맞춤 추천 (Supabase)

### 필수 환경변수
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (Edge Functions용)
- `UPSTAGE_API_KEY`

### 테이블/정책
`supabase/schema.sql`을 Supabase SQL Editor에 실행하세요.

### Edge Functions
Supabase Functions에 아래 함수를 배포합니다.
- `supabase/functions/chat`
- `supabase/functions/recommend`

### 라우트
- `/login` 이메일 매직링크 로그인
- `/chat` AI 질문 + 요약 저장
- `/me` 개인 기록 + 맞춤 추천
