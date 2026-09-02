import type { DevelopmentInfo, DevelopmentStatus, TravelDiary } from "@/types";

export const DEVELOP_HOURS = 24; // 완전 자동 현상까지 걸리는 시간
export const MAX_REVISIT_BOOST = 20; // 재방문으로 얻을 수 있는 최대 보너스(%)
export const MAX_EDIT_BOOST = 10; // 수정으로 얻을 수 있는 최대 보너스(%)
export const REVISIT_STEP = 5; // 재방문 1회당 보너스(%)
export const EDIT_STEP = 5; // 수정 1회당 보너스(%)
export const MAX_REVISIT_COUNT = MAX_REVISIT_BOOST / REVISIT_STEP; // 4
export const MAX_EDIT_COUNT = MAX_EDIT_BOOST / EDIT_STEP; // 2

export function getDevelopmentProgress(
  diary: Pick<TravelDiary, "createdAt" | "revisitCount" | "editCount">,
  now: Date = new Date(),
): number {
  const hoursElapsed =
    (now.getTime() - new Date(diary.createdAt).getTime()) / (1000 * 60 * 60);

  const timeProgress = Math.min(70, (hoursElapsed / DEVELOP_HOURS) * 70);
  const revisitBoost = Math.min(MAX_REVISIT_BOOST, diary.revisitCount * REVISIT_STEP);
  const editBoost = Math.min(MAX_EDIT_BOOST, diary.editCount * EDIT_STEP);

  return Math.max(0, Math.min(100, Math.round(timeProgress + revisitBoost + editBoost)));
}

export function getDevelopmentStatus(progress: number): DevelopmentStatus {
  if (progress < 20) return "undeveloped";
  if (progress < 80) return "developing";
  return "developed";
}

// 카드 이미지에 적용할 CSS 필터 값
export function getDevelopmentFilter(progress: number): string {
  const grayscale = 1 - progress / 100; // 0(완전 컬러) ~ 1(완전 흑백)
  const blurPx = (1 - progress / 100) * 8; // 0px ~ 8px
  return `grayscale(${grayscale}) blur(${blurPx}px)`;
}

// 시간 경과만으로 남은 시간을 추정한다(재방문/수정 보너스는 즉시 반영되므로 "남은 시간"
// 개념에 포함하지 않는다). 이미 현상완료라면 0을 반환한다.
export function getHoursRemaining(
  diary: Pick<TravelDiary, "createdAt" | "revisitCount" | "editCount">,
  now: Date = new Date(),
): number {
  if (getDevelopmentStatus(getDevelopmentProgress(diary, now)) === "developed") return 0;
  const hoursElapsed = (now.getTime() - new Date(diary.createdAt).getTime()) / (1000 * 60 * 60);
  return Math.max(0, Math.ceil(DEVELOP_HOURS - hoursElapsed));
}

export function getDevelopmentInfo(
  diary: Pick<TravelDiary, "createdAt" | "revisitCount" | "editCount">,
  now: Date = new Date(),
): DevelopmentInfo {
  const progress = getDevelopmentProgress(diary, now);
  return {
    progress,
    status: getDevelopmentStatus(progress),
    filter: getDevelopmentFilter(progress),
  };
}

// 상태 뱃지/alt 텍스트는 언어에 따라 달라지므로 여기(순수 계산 계층)에는 두지 않는다.
// src/i18n/development.ts의 getStatusLabel()/withDevelopmentAlt()를 사용한다.

// 정적 룩업: 동적 문자열 결합(`bg-status-${status}`)은 Tailwind 콘텐츠 스캐닝에
// 걸리지 않으므로, 실제 클래스 문자열이 소스에 존재하도록 룩업 테이블로 관리한다.
export const STATUS_BADGE_BG: Record<DevelopmentStatus, string> = {
  undeveloped: "bg-status-undeveloped",
  developing: "bg-status-developing",
  developed: "bg-primary",
};

export const STATUS_BADGE_TEXT: Record<DevelopmentStatus, string> = {
  undeveloped: "text-on-primary",
  developing: "text-on-primary",
  developed: "text-on-primary",
};
