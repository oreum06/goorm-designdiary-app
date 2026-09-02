# Afterimage — 현상되는 여행 기억

사용자가 세계 주요 도시의 사진을 검색하고 여행 기록을 남기면, 그 기록이 실제 필름처럼
**미현상 → 현상중 → 현상완료** 3단계로 서서히 선명해지는 모바일 우선 React 여행 다이어리 앱입니다.

기술명세서: [`eew/GRM_D5_SPEC_afterimage-react-spec.md`](./eew/GRM_D5_SPEC_afterimage-react-spec.md)
디자인 시스템: [`design/.../afterimage/DESIGN.md`](./design/stitch_afterimage_travel_memory_journal/stitch_afterimage_travel_memory_journal/afterimage/DESIGN.md)

## 핵심 기능

- 국가·도시 탐색 및 Unsplash 사진 검색
- 여행 기록 생성·조회·수정·삭제 (LocalStorage 영속화)
- **현상 시스템**: 상태/진행률을 저장하지 않고 `createdAt`·`revisitCount`·`editCount`로부터 매번 파생 계산
- Trip Book 컬렉션(국가/상태 필터, 정렬), Memory Map(react-leaflet + OpenStreetMap), 통계 요약
- 모바일(하단 탭) ↔ 데스크톱(상단 내비, 4열 그리드, 지도·목록 분할) 반응형
- **다국어(한국어/영어) 지원**: 화면 좌측 상단 버튼으로 즉시 전환, 선택한 언어는 유지됨

## 설치

```bash
npm install
```

## 환경변수 (Unsplash API)

사진 검색 기능을 사용하려면 Unsplash Access Key가 필요합니다.

1. https://unsplash.com/developers 에서 계정을 만들고 **New Application**을 생성합니다.
2. 발급된 **Access Key**(Secret Key 아님)를 복사합니다.
3. 프로젝트 루트에 `.env` 파일을 만들고 `.env.example`을 참고해 값을 채웁니다.

```bash
cp .env.example .env
```

```bash
# .env
VITE_UNSPLASH_ACCESS_KEY=여기에_Access_Key_붙여넣기
```

`.env`는 Git에 커밋하지 마세요(`.gitignore`에 이미 포함되어 있습니다). `VITE_` 접두사가 붙은
값은 빌드 결과물에 그대로 노출되므로 **Access Key만 사용**하고 Secret Key는 절대 넣지 않습니다.

키가 없어도 앱의 나머지 기능(현상 시스템, CRUD, Trip Book, Map 등)은 정상 동작하며, 사진 검색
단계에서만 "사진 서비스를 설정해 주세요." 안내가 표시됩니다.

## 실행

```bash
npm run dev       # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 (tsc -b && vite build)
npm run preview    # 빌드 결과 로컬 미리보기
npm run lint       # TypeScript 타입 검사만 실행
```

## 기술 스택

React 19 · Vite 8 · TypeScript 5(strict) · React Router 7 · React Hook Form + Zod ·
Tailwind CSS 3 · react-leaflet + Leaflet · Material Symbols Outlined · LocalStorage

## 배포 (Vercel)

이 프로젝트는 아직 Git 저장소로 초기화되어 있지 않습니다. 배포하려면:

1. `git init` 후 GitHub 저장소를 만들어 푸시합니다.
2. [Vercel](https://vercel.com)에서 저장소를 Import 합니다. (Framework Preset: Vite)
3. Vercel 프로젝트 설정 → Environment Variables에 `VITE_UNSPLASH_ACCESS_KEY`를 등록합니다.
4. Deploy 후 공개 URL에서 모바일 실기기로 핵심 흐름(기록 작성 → Trip Book → Map)을 확인합니다.

## 프로젝트 구조

```text
src/
├─ app/            # App 루트, 라우터
├─ components/      # layout / diary / photo / common 컴포넌트
├─ pages/           # 화면 단위 페이지 (라우트와 1:1)
├─ services/        # Unsplash API 연동
├─ store/           # DiaryContext, ToastContext, LanguageContext
├─ hooks/           # useDiaries, useDevelopment, useUnsplashPhotos, useTranslation 등
├─ data/            # 국가·도시 정적 데이터
├─ i18n/            # 번역 사전(translations.ts)과 언어별 텍스트 헬퍼
├─ types/           # 공용 타입 정의
├─ utils/           # storage / format / development(현상 공식, 언어 비의존)
└─ styles/          # Tailwind 전역 스타일
```

UI 컴포넌트는 LocalStorage나 외부 API를 직접 호출하지 않고 항상 `hooks`/`services`/`store`를
거칩니다. 현상 진행률·상태는 어디에도 저장하지 않고 `utils/development.ts`에서 항상 파생 계산합니다.
언어에 따라 달라지는 문구(상태 뱃지, alt 텍스트 등)는 `utils/development.ts`가 아니라
`i18n/development.ts`처럼 별도 계층에서 `t()`를 받아 조합합니다.

## 업데이트 내역

### 다국어(한국어/영어) 지원 추가

- 화면 좌측 상단 언어 전환 버튼으로 한국어 ↔ 영어를 즉시 전환할 수 있습니다. 선택한 언어는
  `localStorage`(`afterimage:lang`)에 저장되어 새로고침·재방문 후에도 유지됩니다.
- 영어 문구는 원본 디자인 목업의 카피를 그대로 사용했습니다("Relive your *Trips*", "Add Memory",
  "Save to Trip Book" 등). 하단 탭 라벨(Home/Explore/Add/Trip/Map)은 두 언어 모두에서 항상
  영문 그대로 유지됩니다.
- `src/i18n/translations.ts`는 한국어 사전을 기준으로 영어 사전의 타입을
  `Record<TranslationKey, string>`으로 강제해, 번역이 하나라도 누락되면 TypeScript 컴파일이
  실패하도록 설계했습니다.
- 도시/국가 이름, 날짜 형식(`Intl.DateTimeFormat` locale 전환), 현상 상태 뱃지·alt 텍스트,
  폼 검증 메시지(Zod 스키마를 언어별로 재생성), Unsplash 오류 메시지, 토스트 문구까지 UI 전반의
  문구를 언어별로 분리했습니다.

### 이번 세션에서 발견·수정한 버그

- **현상완료 토스트 중복 표시**: 시드 데이터로 실제 브라우저 검증 중, React StrictMode의 effect
  이중 실행 때문에 같은 기록에 대한 "OO의 기억이 현상되었습니다" 토스트가 두 번 표시되는 것을
  발견했습니다. `markDevelopedNotified()`가 상태에 반영되어 되돌아오기 전에 다음 체크가 한 번 더
  실행되는 타이밍 문제로, `useDevelopmentWatcher`에 세션 한정 in-memory 가드(`notifiedIdsRef`)를
  추가해 idempotent하게 만들었습니다.
- **Memory Map에서 마커가 화면 밖으로 벗어나는 문제**: 지도를 고정된 center/zoom(세계 전체 보기)로만
  렌더링하면, 서로 멀리 떨어진 도시(예: 서울·교토 vs 리스본)의 마커가 좁은 모바일 화면에 동시에
  들어오지 않는 것을 확인했습니다. 마운트 시 1회 `fitBounds()`로 저장된 모든 기록의 도시가 화면 안에
  들어오도록 시야를 자동 조정하는 `FitAllMarkers` 컴포넌트를 추가했습니다(이후 사용자가 직접
  이동·확대한 시야는 존중하여 다시 자동 조정하지 않음).

### 기타 변경

- 의존성은 Vite 8 / TypeScript 5(strict) / Tailwind CSS 3 조합으로 고정했습니다. 설치 시점의
  최신 버전인 TypeScript 7·Tailwind 4는 API가 크게 달라져(Tailwind 4는 JS 설정 대신 CSS `@theme`
  방식) 안정성을 위해 의도적으로 배제했습니다.
- 라우트별 코드 스플리팅(`React.lazy` + `Suspense`)을 적용해 Memory Map이 물고 오는
  react-leaflet 청크(약 100KB gzip)를 지도 화면 진입 시에만 내려받도록 분리했습니다.
- 헤드리스 Chrome(Playwright)으로 전 화면 렌더링, CRUD/수정/삭제 확인 다이얼로그, 언어 전환·유지,
  Memory Map 마커 표시까지 실제 브라우저 인터랙션으로 검증했습니다(콘솔 에러 0건).
