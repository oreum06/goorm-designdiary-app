import type { Language, TravelDiary } from "@/types";
import { getDevelopmentProgress, getDevelopmentStatus } from "@/utils/development";

const LOCALE: Record<Language, string> = { ko: "ko-KR", en: "en-US" };

function dateFormatter(language: Language): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(LOCALE[language], { year: "numeric", month: "long", day: "numeric" });
}

function dateFormatterShort(language: Language): Intl.DateTimeFormat {
  return new Intl.DateTimeFormat(LOCALE[language], { month: "short", day: "numeric" });
}

export function formatDate(dateIso: string, language: Language = "ko"): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return dateIso;
  return dateFormatter(language).format(date);
}

export function formatDateShort(dateIso: string, language: Language = "ko"): string {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) return dateIso;
  return dateFormatterShort(language).format(date);
}

export function formatDateRange(startDate: string, endDate?: string, language: Language = "ko"): string {
  if (!endDate || endDate === startDate) return formatDate(startDate, language);
  return `${formatDate(startDate, language)} – ${formatDate(endDate, language)}`;
}

export type DiaryStats = {
  totalCount: number;
  countryCount: number;
  cityCount: number;
  averageProgress: number;
  developedCount: number;
  latestTripDate: string | null;
};

export function getStats(diaries: TravelDiary[], now: Date = new Date()): DiaryStats {
  if (diaries.length === 0) {
    return {
      totalCount: 0,
      countryCount: 0,
      cityCount: 0,
      averageProgress: 0,
      developedCount: 0,
      latestTripDate: null,
    };
  }

  const countryCount = new Set(diaries.map((d) => d.countryCode)).size;
  const cityCount = new Set(diaries.map((d) => d.cityId)).size;

  const progresses = diaries.map((d) => getDevelopmentProgress(d, now));
  const averageProgress = Math.round(
    progresses.reduce((sum, p) => sum + p, 0) / progresses.length,
  );
  const developedCount = progresses.filter((p) => getDevelopmentStatus(p) === "developed").length;

  const latestTripDate = diaries
    .map((d) => d.startDate)
    .sort()
    .at(-1) ?? null;

  return {
    totalCount: diaries.length,
    countryCount,
    cityCount,
    averageProgress,
    developedCount,
    latestTripDate,
  };
}
