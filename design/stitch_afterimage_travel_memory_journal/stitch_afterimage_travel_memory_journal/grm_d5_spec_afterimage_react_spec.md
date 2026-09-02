# Afterimage — 현상되는 여행 기억 React 앱 기술명세서

> 대상: 바이브코딩 입문자
> 문서 유형: MVP 기획·빌드 명세서 (기존 Travel Stamp Diary → 전면 리뉴얼)
> 버전: 2.0.0 · 2026-09-03

## 0. 리뉴얼 요약

| 항목 | 기존 (v1.0.0) | 신규 (v2.0.0) |
| --- | --- | --- |
| 앱 이름 | Travel Stamp Diary | **Afterimage** |
| 핵심 은유 | 우표 수집 | **필름 현상 (Developing Memory)** |
| 기록 상태 | 저장 즉시 완성 | **미현상 → 현상중 → 현상완료** 3단계로 서서히 선명해짐 |
| 컬렉션 명칭 | 스탬프 컬렉션 | **Trip Book** (사진집 형태) |
| 지도 마커 | 고정 마커 | **현상 상태에 따라 흑백→컬러로 변화하는 마커** |
| 디자인 톤 | 종이 질감 + 톱니 스탬프 | **크림 화이트 배경, 사진 중심 카드, 콜라주·워시테이프 느낌** (참고 이미지 반영) |

### 확정된 설계 결정 (가정 명시)

- **현상 진행 방식은 하이브리드**로 가정했습니다: 시간이 지나면 자동으로 진행되고, 사용자가 다시 열어보거나 메모/사진을 수정하면 더 빨리 진행됩니다. 다른 방식을 원하시면 8.1의 공식만 수정하면 됩니다.
- 완전 현상까지 기본 24시간을 기준으로 설계했습니다. 더 빠르게/느리게 원하시면 상수 하나만 바꾸면 됩니다.

## 1. 프로젝트 개요

### 1.1 프로젝트 한 줄 정의

사용자가 세계 주요 도시의 사진을 검색하고 여행 기록을 남기면, 그 기록이 실제 필름처럼 **흐릿한 잔상 상태에서 서서히 선명하게 "현상"되는** 모바일 우선 React 여행 다이어리 앱이다.

### 1.2 문제 정의

여행 사진은 찍는 순간엔 특별하지만 스마트폰 앨범에 묻히면 금방 잊힌다. 대부분의 여행 기록 앱은 저장 즉시 완성된 결과물을 보여주기 때문에, "기억이 다시 떠오르는 과정" 자체가 주는 감성적 경험이 없다.

### 1.3 해결 방식

```text
도시 선택 → Unsplash 사진 탐색 → 대표 사진 선택
→ 날짜·제목·메모 작성 → 기록은 "미현상" 상태로 저장
→ 시간 경과 또는 재방문·수정으로 현상 진행
→ 완전히 현상된 기억을 Trip Book·지도에서 다시 보기
```

### 1.4 목표 사용자

- 여행의 순간을 감성적이고 기억에 남는 방식으로 정리하고 싶은 사용자
- 실제 사진이 없어도 가고 싶은 도시로 샘플 다이어리를 만들어보고 싶은 사용자
- React, 시간 기반 파생 상태 계산, API 호출, CRUD를 한 프로젝트에서 연습하려는 바이브코딩 입문자

### 1.5 MVP 성공 기준

- 사용자가 3분 안에 첫 여행 기록을 만들 수 있다.
- 새로고침 후에도 저장한 기록과 현상 진행 상태가 유지된다.
- 국가·도시별 사진 검색과 선택이 정상 동작한다.
- 기록의 현상 상태(미현상/현상중/현상완료)가 시각적으로 명확히 구분된다.
- 기록 추가·조회·수정·삭제의 CRUD 흐름이 완성된다.
- 모바일 375px부터 데스크톱 1440px까지 핵심 기능을 사용할 수 있다.

## 2. 참고 이미지에서 추출한 디자인 방향

### 핵심 콘셉트 (사용자 제공 참고 이미지 기반)

- 크림 화이트 배경 위에 사진이 주인공이 되는 넓은 여백
- 헤드라인은 세리프+이탤릭 조합("Relive your *Trips*"), 본문은 산세리프
- 여행 커버 카드(도시명 + 대표 사진)가 휴대폰 화면 안에 크게 표시되는 히어로 연출
- 사진을 콜라주처럼 겹쳐 배치하고 워시테이프로 붙인 듯한 스크랩북 느낌
- 지도 위에 사진이 담긴 말풍선형 카드 마커, "Open Trip Book" 오렌지 CTA 버튼
- 하단 아이콘 내비게이션 (기록집 / 추가 / 지도 / 프로필)

### Afterimage에 맞춘 변형

| 참고 이미지 요소 | Afterimage 적용 |
| --- | --- |
| 선명한 커버 사진 | **현상 진행률에 따라 흑백→컬러, 블러→선명으로 변하는 커버 카드** |
| 콜라주 사진첩 | Trip Book 상세 페이지의 사진·메모 레이아웃에 적용 |
| 지도 말풍선 카드 | 현상완료 기록만 컬러 카드, 미현상 기록은 흑백 실루엣 카드로 표시 |
| 오렌지 CTA | "Open Trip Book" → "기억 다시 꺼내보기" 버튼에 적용 |
| 하단 아이콘 내비 | Home / Explore / Add / Trip Book / Map 5탭 구조로 재구성 |

### MVP에서 조정할 요소

| 요소 | MVP 적용 | 후속 버전 |
| --- | --- | --- |
| 현상 애니메이션 | CSS filter(blur, grayscale) 전환 | 실제 필름 그레인 셰이더, 사운드 효과 |
| Trip Book | 카드 목록 + 상세 페이지 | 페이지 넘김 애니메이션·공동 편집("Build it Together") |
| 지도 | 도시 좌표 + 현상 상태별 색상 마커 | 현재 위치·여행 경로·클러스터링 |
| 사진 | Unsplash 사진 선택으로 대체 | 사용자 사진 업로드·실제 필름 스캔 필터 |
| 통계 | 방문 국가·도시·평균 현상률 | 배지·레벨·친구 기능 |

## 3. 범위

### 3.1 MVP 필수 기능

1. 홈 대시보드 (현상 진행 중인 기억 우선 노출)
2. 국가 및 도시 탐색
3. Unsplash 도시 사진 검색
4. 여행 기록 생성·조회·수정·삭제
5. **현상 시스템** (미현상 → 현상중 → 현상완료, 시간 + 재방문/수정 기반 진행)
6. Trip Book 컬렉션 (구 스탬프 컬렉션)
7. 여행 기록 상세 (현상 진행률 표시)
8. Memory Map (현상 상태별 마커 색상)
9. 통계 요약 (평균 현상률 포함)
10. LocalStorage 저장
11. 로딩·빈 화면·API 오류 처리

### 3.2 MVP 제외 기능

- 회원가입 및 소셜 로그인
- 여러 사용자 간 공동 기록("Build it Together")
- 사용자 사진 업로드 및 클라우드 저장
- GPS 자동 방문 인증
- 항공·숙박 예약 연동
- AI 여행기 자동 생성
- 푸시 알림과 결제

## 4. 기본 국가·도시 데이터

도시명은 UI에 한글과 영문을 함께 저장하고, Unsplash 검색에는 영문 검색어를 사용한다. (기존 명세서와 동일한 6개국 데이터를 그대로 사용)

| 국가 | 국가 코드 | 주요 도시 | 대표 검색어 예시 |
| --- | --- | --- | --- |
| 대한민국 | KR | 서울, 부산, 제주, 경주, 전주 | `Seoul Korea travel` |
| 포르투갈 | PT | 리스본, 포르투, 신트라, 파루, 브라가 | `Lisbon Portugal travel` |
| 일본 | JP | 도쿄, 교토, 오사카, 삿포로, 후쿠오카, 나라 | `Kyoto Japan travel` |
| 중국 | CN | 베이징, 상하이, 시안, 청두, 항저우, 광저우 | `Shanghai China travel` |
| 노르웨이 | NO | 오슬로, 베르겐, 트롬쇠, 스타방에르, 올레순 | `Tromso Norway travel` |
| 아이슬란드 | IS | 레이캬비크, 비크, 아쿠레이리, 후사비크, 셀포스 | `Vik Iceland travel` |

각 도시 객체는 `id`, `countryCode`, `nameKo`, `nameEn`, `latitude`, `longitude`, `searchQuery`, `emoji`를 가진다.

## 5. 핵심 사용자 시나리오

### 시나리오 A — 첫 기억 남기기

1. 사용자가 홈에서 `새 기억 남기기`를 누른다.
2. 국가와 도시를 선택한다.
3. 앱이 해당 도시의 Unsplash 사진을 검색한다.
4. 사용자가 대표 사진 한 장을 선택한다.
5. 여행 날짜, 제목, 짧은 메모, 평점, 태그를 입력한다.
6. 미리보기에서 **미현상 상태(흑백·블러)**의 카드를 확인한다.
7. 저장하면 Trip Book과 지도에 흑백 실루엣으로 즉시 반영된다.

### 시나리오 B — 기억이 현상되는 과정 지켜보기

1. 사용자가 홈 또는 Trip Book에서 현상 진행 중인 기억 카드를 본다. 진행률 링(%)이 표시된다.
2. 카드를 열어 "다시 꺼내보기"를 하면 진행률이 즉시 조금 올라간다.
3. 24시간이 지나면 자동으로 현상완료 상태(풀 컬러)가 되고, 토스트로 "OO의 기억이 현상되었습니다"가 표시된다.
4. 현상완료된 기억은 Trip Book에서 컬러 카드로, 지도에서 컬러 마커로 표시된다.

### 시나리오 C — Memory Map 보기

1. 사용자가 지도 화면을 연다.
2. 저장된 기록의 도시 좌표에 마커가 나타나며, 현상완료는 컬러, 현상중/미현상은 흑백 톤으로 구분된다.
3. 마커를 선택하면 사진·도시·날짜·현상 진행률이 표시된다.
4. `기억 열기`로 상세 화면으로 이동한다.

## 6. 화면 및 라우팅

| 경로 | 화면 | 핵심 구성요소 |
| --- | --- | --- |
| `/` | 홈 | Hero, 현상 진행 중인 기억, 통계, 새 기억 CTA |
| `/explore` | 도시 탐색 | 국가 탭, 도시 카드, 검색 |
| `/diaries/new` | 기억 작성 | 단계형 폼, 사진 선택, 미현상 미리보기 |
| `/diaries/:id` | 기억 상세 | 대표 사진(현상 필터 적용), 진행률, 메모, 수정·삭제 |
| `/diaries/:id/edit` | 기억 수정 | 기존 데이터가 채워진 폼 |
| `/tripbook` | Trip Book | 그리드, 국가 필터, 현상 상태 필터 |
| `/map` | Memory Map | 지도, 상태별 색상 마커, 기록 팝업 |
| `*` | Not Found | 홈 이동 버튼 |

### 모바일 하단 내비게이션

`Home / Explore / Add / Trip Book / Map`

## 7. 기능 요구사항

### FR-01 국가·도시 탐색

- 기본 6개 국가와 주요 도시를 로컬 데이터로 제공한다.
- 국가 선택 시 해당 도시만 필터링한다.
- 한글·영문 도시명으로 검색할 수 있다.
- 도시 카드에는 대표 사진, 국가, 도시명, 기록 수를 표시한다.

### FR-02 Unsplash 사진 검색

- 검색식: `${city.nameEn} ${country.nameEn} travel landmark`
- `orientation=landscape`, `content_filter=high`, `per_page=12`를 기본값으로 사용한다.
- 검색 중 스켈레톤, 결과 없음, 네트워크 오류, 요청 한도 초과 상태를 구분한다.
- 사진에는 작가명과 Unsplash 링크를 노출한다.
- 선택한 사진의 `photoId`, URL, 대체 텍스트, 작가 정보, 관련 링크를 기록에 저장한다.
- 같은 도시의 검색 결과는 메모리에 캐싱하여 불필요한 요청을 줄인다.

### FR-03 기억 작성

- 필수: 국가, 도시, 시작일, 제목, 대표 사진
- 선택: 종료일, 메모, 평점 1~5, 동행자, 태그
- 제목 2~50자, 메모 최대 1,000자, 태그 최대 5개로 검증한다.
- 종료일은 시작일보다 빠를 수 없다.
- 저장 직전 **미현상 상태의 카드 미리보기**(그레이스케일 + 블러)를 제공한다.
- 저장 시 `createdAt`을 현상 진행의 기준 시각으로 함께 기록한다.

### FR-04 CRUD

- 생성 시 UUID와 `createdAt`, `updatedAt`을 기록한다.
- 상세 화면에서 수정과 삭제를 제공한다.
- 삭제 전 확인 대화상자를 표시한다.
- 저장·수정·삭제 완료 시 토스트 메시지를 표시한다.
- 수정 시 `editCount`를 1 증가시켜 현상 진행에 반영한다 (8.1 공식 참고, 최대 2회까지만 가산).

### FR-05 현상 시스템 (신규 핵심 기능)

- 모든 기억은 `undeveloped`(미현상) → `developing`(현상중) → `developed`(현상완료) 3단계 상태를 가진다.
- 상태와 진행률(%)은 **저장하지 않고 매번 파생 계산**한다 (8.1 공식).
- 상세 화면 진입 시 `revisitCount`를 1 증가시킨다 (최대 4회까지만 가산, 세션당 1회 제한으로 무한 클릭 방지).
- 진행률에 따라 카드 이미지에 `grayscale()`, `blur()` CSS 필터를 실시간 계산해 적용한다.
- 상태가 `developing` → `developed`로 처음 전환되는 순간, 토스트 "OO의 기억이 현상되었습니다"를 1회만 표시한다. 이를 위해 `developedNotifiedAt` 필드만 저장 시점에 기록한다.
- 현상 진행 중인 기억은 홈 화면 상단에 진행률 순으로 우선 노출한다.

### FR-06 Trip Book 컬렉션 (구 스탬프 컬렉션)

- 저장된 기록을 반응형 그리드로 표시한다.
- 사진(현상 필터 적용), 도시, 국가, 방문 날짜, 진행률을 표시한다.
- 국가별 필터, 현상 상태별 필터(전체/미현상/현상중/현상완료), 최신순·오래된순 정렬을 제공한다.
- 기록이 없는 도시는 빈 실루엣 카드로 표현할 수 있다.

### FR-07 Memory Map

- 저장된 도시의 위도·경도로 마커를 만든다.
- 현상완료 기록은 컬러 마커, 현상중/미현상 기록은 흑백 톤 마커로 구분한다.
- 동일 도시에 여러 기록이 있으면 개수를 표시한다.
- 지도 라이브러리는 `react-leaflet`과 OpenStreetMap 타일을 사용한다.
- 지도 로딩 실패 시 방문 도시 목록을 대체 UI로 제공한다.

### FR-08 통계

- 총 기록 수, 방문 국가 수, 방문 도시 수, **평균 현상률(%)**을 계산한다.
- 현상완료된 기록 수 / 전체 기록 수를 함께 표시한다.
- 최근 여행 날짜를 표시한다.
- 계산값이므로 별도 저장하지 않고 기록 배열에서 파생한다.

## 8. 데이터 모델

### 8.1 현상 진행률 계산 공식

```ts
const DEVELOP_HOURS = 24;          // 완전 자동 현상까지 걸리는 시간
const MAX_REVISIT_BOOST = 20;      // 재방문으로 얻을 수 있는 최대 보너스(%)
const MAX_EDIT_BOOST = 10;         // 수정으로 얻을 수 있는 최대 보너스(%)
const REVISIT_STEP = 5;            // 재방문 1회당 보너스(%)
const EDIT_STEP = 5;               // 수정 1회당 보너스(%)

function getDevelopmentProgress(diary: TravelDiary, now: Date = new Date()): number {
  const hoursElapsed =
    (now.getTime() - new Date(diary.createdAt).getTime()) / (1000 * 60 * 60);

  const timeProgress = Math.min(70, (hoursElapsed / DEVELOP_HOURS) * 70);
  const revisitBoost = Math.min(MAX_REVISIT_BOOST, diary.revisitCount * REVISIT_STEP);
  const editBoost = Math.min(MAX_EDIT_BOOST, diary.editCount * EDIT_STEP);

  return Math.min(100, Math.round(timeProgress + revisitBoost + editBoost));
}

function getDevelopmentStatus(progress: number): "undeveloped" | "developing" | "developed" {
  if (progress < 20) return "undeveloped";
  if (progress < 80) return "developing";
  return "developed";
}

// 카드 이미지에 적용할 CSS 필터 값
function getDevelopmentFilter(progress: number) {
  const grayscale = 1 - progress / 100;       // 0(완전 컬러) ~ 1(완전 흑백)
  const blurPx = (1 - progress / 100) * 8;    // 0px ~ 8px
  return `grayscale(${grayscale}) blur(${blurPx}px)`;
}
```

### 8.2 타입 정의

```ts
type DevelopmentStatus = "undeveloped" | "developing" | "developed";

type TravelDiary = {
  id: string;
  countryCode: "KR" | "PT" | "JP" | "CN" | "NO" | "IS";
  cityId: string;
  title: string;
  startDate: string;       // YYYY-MM-DD
  endDate?: string;
  note: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  companions?: string;
  tags: string[];
  photo: {
    id: string;
    imageUrl: string;
    thumbUrl: string;
    altDescription: string;
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
  // 현상 시스템 관련 필드 (모두 원본 값만 저장, 상태/진행률은 파생 계산)
  revisitCount: number;          // 상세 열람 횟수 (최대 4까지만 진행에 반영)
  editCount: number;             // 수정 횟수 (최대 2까지만 진행에 반영)
  developedNotifiedAt?: string;  // 현상완료 토스트를 이미 보여줬는지 판단용
  createdAt: string;
  updatedAt: string;
};

type City = {
  id: string;
  countryCode: TravelDiary["countryCode"];
  nameKo: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  searchQuery: string;
  emoji: string;
};
```

### LocalStorage

- Key: `afterimage:v1`
- Value: `{ version: 1, diaries: TravelDiary[] }`
- JSON 파싱 실패 시 빈 배열로 복구하고 사용자에게 안내한다.
- 저장 구조가 바뀔 경우 `version` 기반 마이그레이션 함수를 둔다.
- 기존 `travel-stamp-diary:v1` 데이터가 남아있다면 최초 실행 시 자동 이전(마이그레이션)하고 `revisitCount: 0, editCount: 0`으로 초기화한다.

## 9. 기술 스택

| 영역 | 선택 기술 | 선택 이유 |
| --- | --- | --- |
| 앱 | React + Vite + TypeScript | 빠른 시작과 명확한 타입 학습 |
| 라우팅 | React Router | 화면별 URL과 상세 페이지 구성 |
| 스타일 | CSS Modules 또는 단일 `styles.css` | 입문자가 구조를 쉽게 이해 |
| 폼 | React Hook Form + Zod | 입력 상태와 검증 단순화 |
| 아이콘 | Lucide React | 가볍고 일관된 아이콘 |
| 전환 애니메이션 | Framer Motion (선택) | 현상 진행 시 blur/grayscale 부드러운 전환 |
| 지도 | React Leaflet + Leaflet | 공개 지도 기반 MVP 구현 |
| API | Unsplash REST API | 도시별 사진 검색 |
| 저장 | LocalStorage | 백엔드 없이 CRUD 경험 |
| 배포 | Vercel | Vite 정적 앱 배포가 간단 |

## 10. 권장 아키텍처와 파일 구조

```text
src/
├─ app/
│  ├─ App.tsx
│  └─ router.tsx
├─ components/
│  ├─ layout/AppLayout.tsx
│  ├─ diary/DiaryForm.tsx
│  ├─ diary/DiaryCard.tsx          // 현상 필터 적용된 카드
│  ├─ diary/DevelopmentBadge.tsx   // 상태/진행률 뱃지
│  ├─ photo/PhotoPicker.tsx
│  └─ common/EmptyState.tsx
├─ pages/
│  ├─ HomePage.tsx
│  ├─ ExplorePage.tsx
│  ├─ DiaryCreatePage.tsx
│  ├─ DiaryDetailPage.tsx
│  ├─ DiaryEditPage.tsx
│  ├─ TripBookPage.tsx             // 구 StampsPage
│  └─ MapPage.tsx
├─ services/
│  └─ unsplash.ts
├─ store/
│  └─ DiaryContext.tsx
├─ hooks/
│  ├─ useDiaries.ts
│  ├─ useUnsplashPhotos.ts
│  └─ useDevelopment.ts            // 진행률·상태·필터 계산 훅
├─ data/
│  ├─ countries.ts
│  └─ cities.ts
├─ types/
│  └─ index.ts
├─ utils/
│  ├─ storage.ts
│  ├─ format.ts
│  └─ development.ts               // 8.1 공식 구현
└─ styles/
   ├─ globals.css
   └─ tokens.css
```

### 상태 흐름

```text
Page → Custom Hook → Context/Reducer → LocalStorage
Page → useUnsplashPhotos → Unsplash Service → Unsplash API
DiaryCard → useDevelopment(diary) → { status, progress, filter } 파생
```

UI 컴포넌트에서 직접 LocalStorage나 외부 API를 호출하지 않는다.

## 11. Unsplash API 설계

### 환경 변수

```bash
VITE_UNSPLASH_ACCESS_KEY=your_access_key
```

`.env`는 Git에 커밋하지 않고 `.env.example`만 제공한다. Vite의 `VITE_` 변수는 빌드 결과에서 노출될 수 있으므로 **Access Key만 사용하고 Secret Key는 절대 프런트엔드에 넣지 않는다**. 학습용 MVP 이후에는 서버리스 프록시로 전환한다.

### 요청 예시

```http
GET https://api.unsplash.com/search/photos
  ?query=Lisbon%20Portugal%20travel%20landmark
  &orientation=landscape
  &content_filter=high
  &page=1
  &per_page=12
Authorization: Client-ID {ACCESS_KEY}
Accept-Version: v1
```

### 앱 내부 응답 모델

```ts
type UnsplashPhoto = {
  id: string;
  width: number;
  height: number;
  altDescription: string;
  urls: { regular: string; small: string; thumb: string };
  photographer: { name: string; profileUrl: string };
  links: { html: string; downloadLocation: string };
};
```

외부 응답 전체를 UI에 전달하지 말고 `mapUnsplashPhoto()`에서 필요한 필드만 변환한다.

### 이용 규칙과 성능

- API가 반환한 Unsplash 이미지 URL을 직접 사용하고 임의 재호스팅하지 않는다.
- 이미지 URL의 `ixid` 파라미터를 유지한다.
- 사진 작가와 Unsplash 출처를 클릭 가능한 링크로 표시한다.
- 사용자가 사진을 실제 선택·저장하는 행위를 다운로드로 간주하는 경우 `download_location` 호출 정책을 적용한다.
- Demo 상태의 요청 한도를 고려해 검색 버튼 방식, 캐시, 디바운스를 사용한다.
- 썸네일 그리드는 `small` 또는 `thumb`, 상세 화면은 `regular`을 사용한다.

## 12. UI 디자인 시스템 (참고 이미지 반영)

### 스타일 원칙

- `Mobile First`, 사진이 주인공이 되는 크림 화이트 배경과 넓은 여백
- 헤드라인은 세리프+이탤릭 조합, 본문은 산세리프로 대비를 준다
- 카드와 사진은 부드러운 그림자와 큰 라운드 코너로 스크랩북·콜라주 느낌을 낸다
- **현상 진행률이 낮을수록 그레이스케일 + 블러가 강해지고, 진행될수록 컬러와 선명도가 살아나는 시각적 전환이 핵심 인터랙션**이다
- 과도한 애니메이션 대신 300~500ms의 부드러운 filter 전환(현상 애니메이션은 예외적으로 조금 더 길게)을 사용한다

### 디자인 토큰

```css
:root {
  --color-bg: #f7f4ee;
  --color-surface: #ffffff;
  --color-ink: #161616;
  --color-muted: #77736d;
  --color-accent: #ff6b35;
  --color-sky: #49bff2;
  --color-border: #e8e2d8;
  --radius-card: 24px;
  --shadow-card: 0 12px 30px rgba(35, 28, 20, 0.10);

  /* 현상 시스템 전용 토큰 */
  --develop-transition: 400ms ease-out;
  --develop-max-blur: 8px;
  --badge-undeveloped-bg: #2a2a2a;
  --badge-developing-bg: #8a8578;
  --badge-developed-bg: var(--color-accent);
}
```

### 반응형 기준

- 0~639px: 하단 내비게이션, 2열 Trip Book 그리드
- 640~1023px: 3열 카드, 넓은 폼
- 1024px 이상: 상단 내비게이션, 4열 Trip Book 그리드, 지도·목록 분할

### 접근성

- 모든 이미지에 의미 있는 `alt` 제공 (현상 상태도 텍스트로 함께 안내: 예 "미현상 상태의 흐릿한 사진")
- 아이콘 단독 버튼에 `aria-label` 제공
- 키보드로 모든 기능 사용 가능
- 포커스 스타일 제거 금지
- 일반 텍스트 명암비 4.5:1 이상
- **현상 상태를 색상만으로 전달하지 않고, 뱃지 텍스트("미현상"/"현상중 63%"/"현상완료")를 함께 표시한다**

## 13. 오류 및 예외 처리

| 상황 | 사용자 메시지 | 처리 |
| --- | --- | --- |
| API Key 없음 | 사진 서비스를 설정해 주세요 | 기본 플레이스홀더와 설정 안내 |
| 401/403 | 사진 서비스 인증을 확인해 주세요 | 재시도 비활성화, 로그 기록 |
| 429 | 잠시 후 다시 검색해 주세요 | 남은 시간 안내, 캐시 결과 유지 |
| 네트워크 오류 | 인터넷 연결을 확인해 주세요 | 재시도 버튼 |
| 검색 결과 없음 | 다른 도시명이나 검색어를 사용해 보세요 | 기본 도시 이미지 옵션 |
| LocalStorage 손상 | 저장 데이터를 복구하지 못했습니다 | 안전한 초기화 전 확인 |
| 지도 실패 | 지도를 불러오지 못했습니다 | 방문 도시 목록 표시 |

## 14. 비기능 요구사항

- 첫 화면의 주요 콘텐츠는 일반적인 모바일 네트워크에서 3초 내 표시를 목표로 한다.
- 이미지에 `loading="lazy"`, 고정 `aspect-ratio`, 적절한 크기의 URL을 적용한다.
- 현상 필터(grayscale/blur) 계산은 렌더링마다 재계산하지 않고 `useMemo`로 캐싱한다.
- Lighthouse 목표: Performance 80+, Accessibility 90+, Best Practices 90+.
- TypeScript `strict` 모드를 사용하고 `any` 사용을 피한다.
- 환경변수, 저장 데이터, API 응답을 신뢰하지 않고 검증한다.
- 사용자 입력을 HTML로 직접 렌더링하지 않는다.
- 모바일 Safari와 최신 Chrome에서 핵심 흐름을 확인한다.

## 15. 구현 단계

### Step 01 — 프로젝트 초기화

- Vite React TypeScript 프로젝트 생성
- 라우터, 글로벌 스타일, 디자인 토큰 구성
- 국가·도시 정적 데이터 작성
- 완료 기준: 모든 빈 페이지 URL이 정상 렌더링됨

### Step 02 — 정적 UI (참고 이미지 톤 반영)

- 홈, 탐색, 작성 폼, Trip Book, 상세, 지도 레이아웃 구현
- 샘플 데이터로 모바일 반응형 확인
- 완료 기준: 외부 API 없이 전체 화면 이동 가능

### Step 03 — 데이터와 CRUD

- 타입, Context/Reducer, LocalStorage 저장 모듈 구현
- 생성·상세·수정·삭제 연결
- 완료 기준: 새로고침 후에도 CRUD 결과 유지

### Step 04 — 현상 시스템 구현

- `utils/development.ts`에 8.1 공식 구현
- `useDevelopment` 훅으로 상태/진행률/필터 값을 파생
- 상세 진입 시 `revisitCount` 증가, 수정 시 `editCount` 증가 로직 연결
- 현상완료 전환 시 1회성 토스트 구현
- 완료 기준: 시간 조작(테스트용 mock Date) 시 상태가 3단계로 정확히 전환됨

### Step 05 — Unsplash 연동

- 서비스 모듈, 검색 훅, 로딩·오류·빈 상태 구현
- 사진 선택과 출처 표시 연결
- 완료 기준: 6개 국가의 각 1개 도시 이상에서 사진 검색 성공

### Step 06 — Trip Book과 Memory Map

- 필터·정렬·통계 파생값 구현
- 도시 좌표 기반 지도 마커 + 현상 상태별 색상 구현
- 완료 기준: 기록 저장 즉시 Trip Book·통계·지도 동기화

### Step 07 — 품질 개선

- 폼 검증, 삭제 확인, 토스트, 접근성, 이미지 최적화
- 오류 시나리오 테스트
- 완료 기준: 콘솔 오류 없이 테스트셋 통과

### Step 08 — 배포

- GitHub 저장소 생성, README와 `.env.example` 작성
- Vercel 환경변수 설정 및 배포
- 모바일 실기기에서 확인
- 완료 기준: 공개 URL에서 End-to-End 흐름 성공

## 16. 테스트 계획

### 핵심 테스트셋

1. 서울 사진을 검색하고 새 기록을 저장한 뒤 미현상(흑백·블러) 상태로 보이는지 확인한다.
2. 저장 직후 상세 화면을 4회 이상 열어 재방문 보너스가 20%에서 더 오르지 않는지 확인한다.
3. 시스템 시간을 24시간 뒤로 조작(또는 mock)했을 때 자동으로 현상완료 상태가 되는지 확인한다.
4. 현상완료 전환 시 토스트가 정확히 1회만 표시되는지 확인한다.
5. 리스본 기록에 종료일·평점·태그를 추가한다.
6. 교토 기록을 수정(editCount 증가)하고 새로고침 후 진행률이 유지되는지 확인한다.
7. 베이징 기록 삭제 시 취소와 확인을 각각 시험한다.
8. 트롬쇠와 레이캬비크 기록이 지도에 각각의 현상 상태 색상으로 표시되는지 확인한다.
9. 한 국가에 여러 도시 기록이 있을 때 통계(평균 현상률 포함)를 확인한다.
10. 필수값이 비어 있을 때 저장이 차단되는지 확인한다.
11. 종료일이 시작일보다 빠를 때 오류가 표시되는지 확인한다.
12. 잘못된 API Key, 오프라인, 429 상태의 안내를 확인한다.
13. LocalStorage가 비어 있거나 손상된 경우 앱이 중단되지 않는지 확인한다.
14. 375px 화면에서 하단 내비게이션과 2열 Trip Book을 확인한다.
15. 키보드만으로 사진 선택과 폼 저장이 가능한지 확인한다.

### 평가 기준

| 항목 | 목표 |
| --- | ---: |
| 기능 정확성 | 5점 만점 중 4점 이상 |
| 현상 시스템 정확성 | 4점 이상 |
| 화면 완성도 | 4점 이상 |
| 오류 처리 | 4점 이상 |
| 접근성 | 4점 이상 |
| 모바일 사용성 | 4점 이상 |

## 17. 완료 정의

- [ ] 주요 6개 국가와 도시 데이터가 제공된다.
- [ ] Unsplash 사진 검색·선택·출처 표시가 동작한다.
- [ ] 여행 기록 CRUD와 LocalStorage 영속화가 동작한다.
- [ ] 현상 시스템(3단계 상태, 진행률, 필터, 1회성 토스트)이 정확히 동작한다.
- [ ] Trip Book, 기록 상세, 통계, Memory Map이 연결된다.
- [ ] 모바일·태블릿·데스크톱에 대응한다.
- [ ] 로딩·빈 화면·오류 상태가 구현된다.
- [ ] 테스트셋을 통과하고 공개 URL에 배포된다.
- [ ] README에 설치, 환경변수, 실행, 배포 방법이 정리된다.

## 18. V2 확장 로드맵

1. Supabase 로그인·PostgreSQL·사진 업로드
2. 사용자 사진으로 실제 필름 스캔 필터 적용
3. "Build it Together or Solo" — 커플/친구와 공동으로 하나의 기억을 함께 현상하는 기능
4. AI 여행기·제목·태그 생성
5. 여행 경로와 일정 타임라인
6. 공개 Trip Book 링크 및 현상 과정을 담은 타임랩스 영상/이미지 내보내기
7. PWA 설치, 현상완료 푸시 알림, 오프라인 작성, 다국어 지원

## 19. 바이브코딩 에이전트용 시작 프롬프트

```text
첨부된 Afterimage 기술명세서를 기준으로 React + Vite + TypeScript 앱을 구현해줘.

이 앱의 핵심 차별점은 "현상 시스템"이야. 모든 여행 기록은 저장 직후 바로 선명하게 보이지 않고,
시간이 지나거나(기본 24시간) 사용자가 다시 열어보고 수정할 때마다 서서히 컬러/선명도가 올라가서
"현상완료" 상태가 되는 방식이야. 상태와 진행률은 저장하지 말고 createdAt, revisitCount, editCount로부터
매번 계산해줘 (명세서 8.1 공식을 그대로 구현).

디자인은 참고 이미지 톤을 따라줘: 크림 화이트 배경, 사진이 주인공인 넓은 여백, 세리프+산세리프 조합
타이포, 오렌지 CTA, 부드러운 그림자의 라운드 카드. 현상 진행률이 낮을수록 grayscale+blur가 강하게
적용되고 진행될수록 자연스럽게 컬러/선명도가 올라오는 전환 효과가 이 앱에서 가장 중요한 인터랙션이야.

우선 전체를 한 번에 만들지 말고 다음 순서로 작업해줘.
1. 현재 작업환경과 명세 확인
2. 구현 계획 및 파일 구조 제안
3. 프로젝트 초기화와 라우팅
4. 샘플 데이터 기반 정적 UI (현상 필터 없이 우선 레이아웃만)
5. LocalStorage 기반 CRUD
6. 현상 시스템 구현 (utils/development.ts, useDevelopment 훅, 상태별 필터·뱃지·1회성 토스트)
7. Unsplash API 연동
8. Trip Book 컬렉션과 Memory Map (현상 상태별 색상 마커)
9. 오류 처리·테스트·배포 준비

각 단계마다 변경 파일, 실행 방법, 확인 결과를 알려주고 실제 빌드 오류를 해결한 뒤 다음 단계로 진행해줘.
UI 컴포넌트에서 API나 LocalStorage를 직접 호출하지 말고 service, hook, store 계층을 분리해줘.
현상 진행률/상태는 절대 별도로 저장하지 말고 항상 파생 계산해줘.
모바일 우선으로 구현하고 Unsplash 작가 출처와 API 이용 규칙을 지켜줘.
```

## 20. 참고 자료

- Unsplash API 공식 문서: https://unsplash.com/documentation
- React 공식 문서: https://react.dev/
- Vite 공식 문서: https://vite.dev/
- React Router 공식 문서: https://reactrouter.com/
- Leaflet 공식 문서: https://leafletjs.com/
- Framer Motion 공식 문서: https://www.framer.com/motion/

---

Developed by Jun · NextPlatform | React · Vite · TypeScript · Vercel
Built with Cursor · SPEC with Claude | Version 2.0.0 · © 2026
