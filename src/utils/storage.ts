import type { CountryCode, TravelDiary } from "@/types";
import { cities } from "@/data/cities";

const STORAGE_KEY = "afterimage:v1";
const LEGACY_KEY = "travel-stamp-diary:v1";
const COUNTRY_CODES: CountryCode[] = ["KR", "PT", "JP", "CN", "NO", "IS"];

type StoredData = { version: 1; diaries: TravelDiary[] };

export type LoadResult = {
  diaries: TravelDiary[];
  recovered: boolean; // JSON 파싱에 실패해 빈 배열로 복구했는지 여부
};

function isValidDiary(value: unknown): value is TravelDiary {
  if (typeof value !== "object" || value === null) return false;
  const d = value as Partial<TravelDiary>;
  return (
    typeof d.id === "string" &&
    typeof d.title === "string" &&
    typeof d.countryCode === "string" &&
    COUNTRY_CODES.includes(d.countryCode as CountryCode) &&
    typeof d.cityId === "string" &&
    cities.some((c) => c.id === d.cityId) &&
    typeof d.createdAt === "string" &&
    typeof d.photo === "object" &&
    d.photo !== null
  );
}

// 구버전(Travel Stamp Diary)의 항목을 최대한 살려서 새 구조로 옮긴다.
// 필수 필드가 없거나 형태가 다르면 해당 항목은 안전하게 건너뛴다.
function coerceLegacyDiary(raw: unknown): TravelDiary | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const countryCode = COUNTRY_CODES.includes(r.countryCode as CountryCode)
    ? (r.countryCode as CountryCode)
    : null;
  const cityId = typeof r.cityId === "string" && cities.some((c) => c.id === r.cityId)
    ? r.cityId
    : null;
  if (!countryCode || !cityId) return null;

  const title = typeof r.title === "string" && r.title.length > 0 ? r.title : null;
  if (!title) return null;

  const photo = r.photo as Partial<TravelDiary["photo"]> | undefined;
  if (!photo || typeof photo.imageUrl !== "string") return null;

  const now = new Date().toISOString();
  return {
    id: typeof r.id === "string" ? r.id : crypto.randomUUID(),
    countryCode,
    cityId,
    title,
    startDate: typeof r.startDate === "string" ? r.startDate : now.slice(0, 10),
    endDate: typeof r.endDate === "string" ? r.endDate : undefined,
    note: typeof r.note === "string" ? r.note : "",
    rating: typeof r.rating === "number" ? (r.rating as TravelDiary["rating"]) : undefined,
    companions: typeof r.companions === "string" ? r.companions : undefined,
    tags: Array.isArray(r.tags) ? r.tags.filter((t): t is string => typeof t === "string") : [],
    photo: {
      id: typeof photo.id === "string" ? photo.id : crypto.randomUUID(),
      imageUrl: photo.imageUrl,
      thumbUrl: typeof photo.thumbUrl === "string" ? photo.thumbUrl : photo.imageUrl,
      altDescription: typeof photo.altDescription === "string" ? photo.altDescription : title,
      photographerName: typeof photo.photographerName === "string" ? photo.photographerName : "Unknown",
      photographerUrl: typeof photo.photographerUrl === "string" ? photo.photographerUrl : "",
      unsplashUrl: typeof photo.unsplashUrl === "string" ? photo.unsplashUrl : "",
    },
    revisitCount: 0,
    editCount: 0,
    developedNotifiedAt: undefined,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : now,
    updatedAt: typeof r.updatedAt === "string" ? r.updatedAt : now,
  };
}

function migrateLegacyData(): TravelDiary[] | null {
  const raw = window.localStorage.getItem(LEGACY_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as unknown;
    const rawList = Array.isArray(parsed)
      ? parsed
      : Array.isArray((parsed as { diaries?: unknown })?.diaries)
        ? (parsed as { diaries: unknown[] }).diaries
        : [];

    const migrated = rawList
      .map(coerceLegacyDiary)
      .filter((d): d is TravelDiary => d !== null);

    window.localStorage.removeItem(LEGACY_KEY);
    return migrated;
  } catch {
    window.localStorage.removeItem(LEGACY_KEY);
    return null;
  }
}

export function load(): LoadResult {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    const migrated = migrateLegacyData();
    if (migrated) {
      save(migrated);
      return { diaries: migrated, recovered: false };
    }
    return { diaries: [], recovered: false };
  }

  try {
    const parsed = JSON.parse(raw) as StoredData;
    const diaries = Array.isArray(parsed?.diaries) ? parsed.diaries.filter(isValidDiary) : [];
    return { diaries, recovered: false };
  } catch {
    return { diaries: [], recovered: true };
  }
}

export function save(diaries: TravelDiary[]): boolean {
  const payload: StoredData = { version: 1, diaries };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    // 저장 공간 초과 등 쓰기 실패 — 호출 측에서 사용자에게 안내한다.
    return false;
  }
}
