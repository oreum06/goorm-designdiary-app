import type { DevelopmentStatus } from "@/types";
import { Icon } from "@/components/common/Icon";
import { STATUS_BADGE_BG, STATUS_BADGE_TEXT } from "@/utils/development";
import { getStatusLabel } from "@/i18n/development";
import { useTranslation } from "@/hooks/useTranslation";

const STATUS_ICON: Record<DevelopmentStatus, string> = {
  undeveloped: "hourglass_empty",
  developing: "sync",
  developed: "done_all",
};

type DevelopmentBadgeProps = {
  status: DevelopmentStatus;
  progress: number;
  className?: string;
};

// 상태를 색상만으로 전달하지 않도록 아이콘 + 텍스트를 항상 함께 표시한다.
export function DevelopmentBadge({ status, progress, className = "" }: DevelopmentBadgeProps) {
  const { t } = useTranslation();
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-1 font-label-md text-[11px] font-semibold uppercase tracking-wider shadow-sm ${STATUS_BADGE_BG[status]} ${STATUS_BADGE_TEXT[status]} ${className}`}
    >
      <Icon
        name={STATUS_ICON[status]}
        className={`text-[13px] ${status === "developing" ? "animate-spin-slow" : ""}`}
      />
      {getStatusLabel(t, status, progress)}
    </span>
  );
}
