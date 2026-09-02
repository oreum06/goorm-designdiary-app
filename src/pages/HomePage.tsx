import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/common/Icon";
import { WashiTape } from "@/components/common/WashiTape";
import { ProgressRing } from "@/components/diary/ProgressRing";
import { EmptyState } from "@/components/common/EmptyState";
import { useDiaries } from "@/hooks/useDiaries";
import { useTranslation } from "@/hooks/useTranslation";
import { getCity } from "@/data/cities";
import { getDevelopmentInfo } from "@/utils/development";
import { withDevelopmentAlt } from "@/i18n/development";
import { cityName } from "@/i18n/localizedNames";
import { getStats } from "@/utils/format";

export function HomePage() {
  const { diaries } = useDiaries();
  const { t, language } = useTranslation();

  const withDevelopment = useMemo(
    () => diaries.map((diary) => ({ diary, info: getDevelopmentInfo(diary) })),
    [diaries],
  );

  const developing = useMemo(
    () =>
      withDevelopment
        .filter((x) => x.info.status !== "developed")
        .sort((a, b) => a.info.progress - b.info.progress),
    [withDevelopment],
  );

  const hero = developing[0];
  const heroCity = hero ? getCity(hero.diary.cityId) : undefined;

  const stats = useMemo(() => getStats(diaries), [diaries]);

  return (
    <AppLayout variant="main" title="Home">
      <div className="flex w-full flex-col lg:mx-auto lg:max-w-3xl">
        <section className="flex flex-col items-center px-margin-mobile pb-stack-lg pt-stack-md">
          {hero ? (
            <Link
              to={`/diaries/${hero.diary.id}`}
              className="relative w-full rounded-xl bg-surface-container-low p-4 shadow-[0_12px_30px_rgba(35,28,20,0.10)]"
            >
              <WashiTape className="-right-3 -top-3 z-10" rotate={6} />
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-status-undeveloped">
                <img
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-1000 ease-in-out"
                  src={hero.diary.photo.imageUrl}
                  alt={withDevelopmentAlt(t, hero.diary.photo.altDescription, hero.info.status)}
                  style={{ filter: hero.info.filter }}
                />
                <div className="absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="flex items-center justify-between text-on-primary">
                    <div>
                      <p className="mb-1 font-label-md uppercase tracking-widest text-on-primary/80">
                        {t("home.heroDeveloping")}
                      </p>
                      <h2 className="font-headline-sm text-headline-sm">
                        {heroCity ? cityName(heroCity, language) : t("common.unknownCity")}
                      </h2>
                    </div>
                    <ProgressRing progress={hero.info.progress} />
                  </div>
                  <div className="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-on-primary/20">
                    <div
                      className="h-full bg-tertiary-fixed-dim"
                      style={{ width: `${hero.info.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="w-full rounded-xl bg-surface-container-low p-8 text-center shadow-[0_12px_30px_rgba(35,28,20,0.10)]">
              <Icon name="auto_awesome" className="text-[32px] text-primary" />
              <p className="mt-3 font-body-md text-body-md text-on-surface-variant">
                {diaries.length === 0 ? t("home.heroEmptyNoDiaries") : t("home.heroEmptyAllDeveloped")}
              </p>
            </div>
          )}
        </section>

        <section className="px-margin-mobile py-stack-md text-center">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-background">
            {t("home.headlinePrefix")}{" "}
            <em className="font-headline-sm italic text-primary">{t("home.headlineEmphasis")}</em>
          </h1>
          <p className="mx-auto mt-2 max-w-[280px] font-body-md text-body-md text-text-muted">
            {t("home.subtitle")}
          </p>
        </section>

        {developing.length > 0 ? (
          <section className="flex flex-col gap-4 py-stack-md pl-margin-mobile">
            <div className="flex items-center justify-between pr-margin-mobile">
              <h3 className="font-label-md text-on-surface-variant uppercase tracking-widest">
                {t("home.darkroomTitle")}
              </h3>
              <Link to="/tripbook" className="font-label-md text-label-md text-primary">
                {t("common.viewAll")}
              </Link>
            </div>
            <div
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-margin-mobile"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {developing.map(({ diary, info }) => {
                const city = getCity(diary.cityId);
                return (
                  <Link
                    key={diary.id}
                    to={`/diaries/${diary.id}`}
                    className="relative flex w-64 shrink-0 snap-start flex-col gap-3 rounded-xl bg-surface p-3 shadow-[0_8px_24px_rgba(35,28,20,0.08)]"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-status-undeveloped">
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={diary.photo.thumbUrl}
                        alt={withDevelopmentAlt(t, diary.photo.altDescription, info.status)}
                        style={{ filter: info.filter }}
                      />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <h4 className="font-body-lg font-semibold text-on-surface">
                          {city ? cityName(city, language) : t("common.unknownCity")}
                        </h4>
                        <p className="font-caption text-text-muted">{diary.title}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-status-developing px-2 py-1 text-on-primary">
                        <Icon name="hourglass_empty" className="text-[14px]" />
                        <span className="font-caption text-[10px] font-bold">{info.progress}%</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {diaries.length > 0 ? (
          <section className="px-margin-mobile py-stack-md">
            <div className="relative flex items-center justify-between overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-[0_8px_24px_rgba(35,28,20,0.06)]">
              <div className="z-10 flex flex-col gap-1">
                <span className="font-display-lg text-primary">{stats.totalCount}</span>
                <span className="font-label-md text-on-surface-variant uppercase">{t("home.statMemories")}</span>
              </div>
              <div className="z-10 h-12 w-px bg-border" />
              <div className="z-10 flex flex-col gap-1">
                <span className="font-display-lg text-secondary">{stats.countryCount}</span>
                <span className="font-label-md text-on-surface-variant uppercase">{t("home.statCountries")}</span>
              </div>
              <div className="z-10 h-12 w-px bg-border" />
              <div className="z-10 flex flex-col gap-1">
                <span className="font-display-lg text-status-developing">
                  {stats.averageProgress}
                  <span className="text-body-md">%</span>
                </span>
                <span className="font-label-md text-on-surface-variant uppercase">{t("home.statAvgDev")}</span>
              </div>
            </div>
          </section>
        ) : (
          <EmptyState
            icon="add_a_photo"
            title={t("home.emptyTitle")}
            description={t("home.emptyDescription")}
            action={
              <Link
                to="/diaries/new"
                className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm"
              >
                <Icon name="add" className="text-[18px]" />
                {t("common.addMemory")}
              </Link>
            }
          />
        )}

        <div className="h-8 w-full lg:hidden" />
      </div>

      <Link
        to="/diaries/new"
        aria-label={t("common.addMemory")}
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-lg transition-transform hover:scale-105 active:scale-95 lg:hidden"
      >
        <Icon name="add" className="text-[32px] font-light" />
      </Link>
    </AppLayout>
  );
}
