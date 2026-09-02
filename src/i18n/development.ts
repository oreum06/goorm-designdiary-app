import type { DevelopmentStatus } from "@/types";
import type { TranslationKey } from "@/i18n/translations";

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

const STATUS_LABEL_KEY: Record<DevelopmentStatus, TranslationKey> = {
  undeveloped: "status.undeveloped",
  developing: "status.developing",
  developed: "status.developed",
};

// 뱃지 텍스트: "미현상"/"현상중 63%"/"현상완료" (색상만으로 상태를 전달하지 않기 위함).
export function getStatusLabel(t: Translate, status: DevelopmentStatus, progress: number): string {
  if (status === "developing") return t("status.developingWithProgress", { progress });
  return t(STATUS_LABEL_KEY[status]);
}

// 필터 칩 등 진행률 없이 카테고리 이름만 필요한 곳(예: "미현상"/"현상중"/"현상완료").
export function getStatusName(t: Translate, status: DevelopmentStatus): string {
  return t(STATUS_LABEL_KEY[status]);
}

// 접근성: 이미지 alt에 현상 상태를 함께 안내한다.
export function withDevelopmentAlt(t: Translate, baseAlt: string, status: DevelopmentStatus): string {
  if (status === "undeveloped") return t("a11y.undevelopedAlt", { alt: baseAlt });
  if (status === "developing") return t("a11y.developingAlt", { alt: baseAlt });
  return baseAlt;
}
