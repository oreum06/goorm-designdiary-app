import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/common/Icon";
import { EmptyState } from "@/components/common/EmptyState";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { DevelopmentBadge } from "@/components/diary/DevelopmentBadge";
import { useDiaries } from "@/hooks/useDiaries";
import { useDevelopment } from "@/hooks/useDevelopment";
import { useRevisitTracking } from "@/hooks/useRevisitTracking";
import { useToast } from "@/store/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getCity } from "@/data/cities";
import { getCountry } from "@/data/countries";
import { formatDateRange } from "@/utils/format";
import { getHoursRemaining } from "@/utils/development";
import { withDevelopmentAlt } from "@/i18n/development";
import { cityName, countryName } from "@/i18n/localizedNames";

const FALLBACK_DIARY = { createdAt: new Date().toISOString(), revisitCount: 0, editCount: 0 };

export function DiaryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { getDiary, removeDiary } = useDiaries();
  const { show } = useToast();
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const diary = id ? getDiary(id) : undefined;
  const info = useDevelopment(diary ?? FALLBACK_DIARY);
  useRevisitTracking(diary?.id);

  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!diary) {
    return (
      <AppLayout variant="focus" title={t("detail.notFoundHeaderTitle")}>
        <EmptyState
          icon="search_off"
          title={t("common.notFoundTitle")}
          description={t("common.notFoundDescription")}
          action={
            <Link
              to="/tripbook"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm"
            >
              {t("common.goToTripBook")}
            </Link>
          }
        />
      </AppLayout>
    );
  }

  const city = getCity(diary.cityId);
  const country = getCountry(diary.countryCode);
  const hoursRemaining = getHoursRemaining(diary);

  function handleDelete() {
    if (!diary) return;
    removeDiary(diary.id);
    show(t("toast.diaryDeleted"));
    navigate("/tripbook");
  }

  return (
    <AppLayout variant="focus" title={diary.title}>
      <div className="mx-auto flex w-full max-w-[480px] flex-col pb-32">
        <div className="relative h-[420px] w-full overflow-hidden sm:h-[480px]">
          <img
            className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out"
            src={diary.photo.imageUrl}
            alt={withDevelopmentAlt(t, diary.photo.altDescription, info.status)}
            style={{ filter: info.filter }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
          <div className="relative z-10 flex h-full flex-col justify-end gap-stack-sm p-margin-mobile text-on-background">
            <div className="flex items-center gap-2">
              <DevelopmentBadge status={info.status} progress={info.progress} />
              <span className="font-body-md text-caption tracking-wider text-on-background/70">
                {city ? cityName(city, language).toUpperCase() : t("common.unknownCity")}
                {country ? `, ${countryName(country, language)}` : ""}
              </span>
            </div>
            <h2 className="font-display-lg-mobile text-display-lg-mobile leading-none text-on-background">
              {diary.title}
            </h2>
            <p className="mt-2 font-body-md text-text-muted">
              {formatDateRange(diary.startDate, diary.endDate, language)}
            </p>
          </div>
        </div>

        <div className="relative z-20 -mt-6 flex flex-col gap-stack-lg px-margin-mobile">
          <div className="flex flex-col gap-stack-sm rounded-xl bg-surface p-stack-md shadow-[0_12px_30px_rgba(35,28,20,0.06)]">
            <div className="mb-1 flex items-end justify-between">
              <span className="font-label-md text-on-surface">{t("detail.progressStatus")}</span>
              <span className="font-headline-sm text-primary">{info.progress}%</span>
            </div>
            <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className="absolute left-0 top-0 h-full bg-tertiary-container transition-all duration-1000 ease-out"
                style={{ width: `${info.progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-caption text-text-muted">
              <span className="flex items-center gap-1">
                <Icon name="schedule" className="text-[14px]" />
                {info.status === "developed"
                  ? t("detail.completedText")
                  : t("detail.hoursRemaining", { hours: hoursRemaining })}
              </span>
              <span className="text-[11px]">
                {t("detail.revisitEditCount", { revisit: diary.revisitCount, edit: diary.editCount })}
              </span>
            </div>
          </div>

          {diary.rating ? (
            <div
              className="flex items-center gap-1 text-primary"
              role="img"
              aria-label={t("detail.ratingAria", { value: diary.rating })}
            >
              {[1, 2, 3, 4, 5].map((v) => (
                <Icon key={v} name="star" filled={v <= diary.rating!} className="text-[20px]" />
              ))}
            </div>
          ) : null}

          {diary.note ? (
            <div className="relative mt-stack-md rounded-lg bg-surface p-stack-lg shadow-[0_4px_20px_rgba(35,28,20,0.04)]">
              <div
                aria-hidden="true"
                className="absolute -left-3 -top-3 h-4 w-12 rounded-sm bg-secondary/20"
                style={{ transform: "rotate(-12deg)" }}
              />
              <Icon name="format_quote" className="absolute right-4 top-4 text-[32px] text-outline-variant opacity-50" />
              <p className="relative z-10 text-center font-body-lg italic leading-relaxed text-on-surface-variant">
                {diary.note}
              </p>
            </div>
          ) : null}

          {diary.companions ? (
            <p className="flex items-center gap-2 font-body-md text-body-md text-on-surface-variant">
              <Icon name="group" className="text-[18px] text-tertiary" />
              {diary.companions}
            </p>
          ) : null}

          {diary.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {diary.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-surface-container-high px-3 py-1.5 font-label-md text-sm text-on-surface"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}

          <p className="font-caption text-caption text-text-muted">
            {t("detail.photoCredit", { name: diary.photo.photographerName })}{" "}
            <a href={diary.photo.unsplashUrl} target="_blank" rel="noreferrer noopener" className="underline">
              {t("common.viewOnUnsplash")}
            </a>
          </p>

          <div className="mb-8 mt-4 flex flex-col gap-3">
            <Link
              to={`/diaries/${diary.id}/edit`}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-surface py-4 font-label-md text-label-md text-primary shadow-sm transition-transform active:scale-[0.98]"
            >
              <Icon name="edit_note" className="text-[20px]" />
              {t("detail.editNote")}
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-label-md text-label-md text-error/80 transition-transform hover:text-error active:scale-[0.98]"
            >
              <Icon name="delete" className="text-[20px]" />
              {t("detail.deleteMemory")}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={t("detail.deleteConfirmTitle")}
        description={t("detail.deleteConfirmDescription")}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </AppLayout>
  );
}
