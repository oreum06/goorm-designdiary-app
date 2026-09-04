import { Link } from "react-router-dom";
import type { TravelDiary } from "@/types";
import { useDevelopment } from "@/hooks/useDevelopment";
import { useTranslation } from "@/hooks/useTranslation";
import { getCity } from "@/data/cities";
import { formatDateShort } from "@/utils/format";
import { withDevelopmentAlt } from "@/i18n/development";
import { cityName } from "@/i18n/localizedNames";
import { DevelopmentBadge } from "@/components/diary/DevelopmentBadge";
import { WashiTape } from "@/components/common/WashiTape";

type DiaryCardProps = {
  diary: TravelDiary;
  className?: string;
  aspect?: "square" | "portrait";
};

export function DiaryCard({ diary, className = "", aspect = "square" }: DiaryCardProps) {
  const { status, progress, filter } = useDevelopment(diary);
  const { t, language } = useTranslation();
  const city = getCity(diary.cityId);

  return (
    <Link
      to={`/diaries/${diary.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-[24px] bg-surface shadow-[0_12px_30px_rgba(35,28,20,0.10)] transition-transform duration-300 hover:-translate-y-1 ${className}`}
    >
      <WashiTape className="right-2 top-2 z-10" rotate={12} />
      <div
        className={`relative w-full overflow-hidden bg-surface-container-low ${
          aspect === "square" ? "aspect-square" : "aspect-[3/4]"
        }`}
      >
        <img
          src={diary.photo.thumbUrl}
          alt={withDevelopmentAlt(t, diary.photo.altDescription, status)}
          loading="lazy"
          className="h-full w-full object-cover transition-[filter] duration-[400ms] ease-out"
          style={{ filter }}
        />
        <div className="absolute left-2 right-16 top-2">
          <DevelopmentBadge status={status} progress={progress} />
        </div>
      </div>
      <div className="flex flex-col gap-0.5 p-3">
        <h3 className="truncate font-headline-sm text-[16px] leading-tight text-on-surface">
          {diary.title}
        </h3>
        <span className="font-caption text-caption text-text-muted">
          {city ? cityName(city, language) : t("common.unknownCity")} · {formatDateShort(diary.startDate, language)}
        </span>
      </div>
    </Link>
  );
}
