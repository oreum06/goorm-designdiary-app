import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/common/Icon";
import { EmptyState } from "@/components/common/EmptyState";
import { DiaryCard } from "@/components/diary/DiaryCard";
import { useDiaries } from "@/hooks/useDiaries";
import { useTranslation } from "@/hooks/useTranslation";
import { countries } from "@/data/countries";
import type { CountryCode, DevelopmentStatus } from "@/types";
import { getDevelopmentStatus, getDevelopmentProgress } from "@/utils/development";
import { getStatusName } from "@/i18n/development";
import { countryName } from "@/i18n/localizedNames";

const STATUS_FILTERS: Array<DevelopmentStatus | "ALL"> = ["ALL", "undeveloped", "developing", "developed"];

function chipClass(active: boolean): string {
  return `whitespace-nowrap rounded-full px-4 py-2 font-label-md text-label-md transition-colors ${
    active ? "bg-on-background text-background" : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
  }`;
}

export function TripBookPage() {
  const { diaries } = useDiaries();
  const { t, language } = useTranslation();
  const [countryFilter, setCountryFilter] = useState<CountryCode | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<DevelopmentStatus | "ALL">("ALL");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const filtered = useMemo(() => {
    return diaries
      .filter((d) => countryFilter === "ALL" || d.countryCode === countryFilter)
      .filter((d) => {
        if (statusFilter === "ALL") return true;
        return getDevelopmentStatus(getDevelopmentProgress(d)) === statusFilter;
      })
      .sort((a, b) =>
        sort === "newest"
          ? b.createdAt.localeCompare(a.createdAt)
          : a.createdAt.localeCompare(b.createdAt),
      );
  }, [diaries, countryFilter, statusFilter, sort]);

  return (
    <AppLayout variant="main" title="Trip Book">
      <div className="flex flex-col gap-stack-md px-margin-mobile py-stack-md lg:px-margin-desktop">
        <div className="flex flex-col gap-2">
          <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tight text-on-background">
            {t("tripbook.headlinePrefix")} <em className="font-headline-sm italic">Trip Book</em>
          </h1>
          <p className="font-body-md text-body-md text-text-muted">{t("tripbook.subtitle")}</p>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="hide-scrollbar flex gap-2 overflow-x-auto">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={chipClass(statusFilter === s)}
              >
                {s === "ALL" ? t("common.all") : getStatusName(t, s)}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
            className="flex shrink-0 items-center gap-1 p-2 font-label-md text-[11px] uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-background"
            aria-label={t("tripbook.sortAria")}
          >
            <Icon name="sort" className="text-[18px]" />
            {sort === "newest" ? t("tripbook.sortNewest") : t("tripbook.sortOldest")}
          </button>
        </div>

        <div className="hide-scrollbar flex gap-2 overflow-x-auto">
          <button type="button" onClick={() => setCountryFilter("ALL")} className={chipClass(countryFilter === "ALL")}>
            {t("tripbook.allCountries")}
          </button>
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => setCountryFilter(country.code)}
              className={chipClass(countryFilter === country.code)}
            >
              {countryName(country, language)}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon="auto_stories"
            title={diaries.length === 0 ? t("tripbook.emptyTitleNoData") : t("tripbook.emptyTitleNoMatch")}
            description={
              diaries.length === 0
                ? t("tripbook.emptyDescriptionNoData")
                : t("tripbook.emptyDescriptionNoMatch")
            }
            action={
              diaries.length === 0 ? (
                <Link
                  to="/diaries/new"
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm"
                >
                  <Icon name="add" className="text-[18px]" />
                  {t("common.addMemory")}
                </Link>
              ) : undefined
            }
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 pb-stack-lg sm:grid-cols-3 lg:grid-cols-4 lg:gap-gutter">
            {filtered.map((diary) => (
              <DiaryCard key={diary.id} diary={diary} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
