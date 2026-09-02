import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/common/Icon";
import { EmptyState } from "@/components/common/EmptyState";
import { DevelopmentBadge } from "@/components/diary/DevelopmentBadge";
import { useDiaries } from "@/hooks/useDiaries";
import { useTranslation } from "@/hooks/useTranslation";
import { cities } from "@/data/cities";
import { countries } from "@/data/countries";
import type { City, CountryCode, TravelDiary } from "@/types";
import { getDevelopmentInfo } from "@/utils/development";
import { withDevelopmentAlt } from "@/i18n/development";
import { cityName, countryName } from "@/i18n/localizedNames";

function ExploreCityCard({
  city,
  diaries,
  rotate,
}: {
  city: City;
  diaries: TravelDiary[];
  rotate: number;
}) {
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const country = countries.find((c) => c.code === city.countryCode);

  const best = useMemo(() => {
    if (diaries.length === 0) return null;
    return diaries
      .map((diary) => ({ diary, info: getDevelopmentInfo(diary) }))
      .sort((a, b) => b.info.progress - a.info.progress)[0];
  }, [diaries]);

  function handleClick() {
    if (best) {
      navigate(`/diaries/${best.diary.id}`);
    } else {
      navigate("/diaries/new", { state: { presetCityId: city.id } });
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group relative flex cursor-pointer flex-col text-left transition-transform duration-500 hover:-translate-y-2"
      style={{ marginTop: Math.abs(rotate) * 2 }}
    >
      <div
        aria-hidden="true"
        className="absolute -top-3 -right-3 z-20 h-6 w-16 rounded-sm bg-secondary/30 backdrop-blur-md"
        style={{ transform: `rotate(${rotate}deg)` }}
      />
      <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-surface p-2 shadow-[0_12px_30px_rgba(35,28,20,0.10)]">
        {best ? (
          <div
            className="relative h-full w-full overflow-hidden rounded-[16px] transition-all duration-1000 ease-in-out"
            style={{ filter: best.info.filter }}
          >
            <img
              className="h-full w-full object-cover"
              src={best.diary.photo.thumbUrl}
              alt={withDevelopmentAlt(t, best.diary.photo.altDescription, best.info.status)}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-[16px] bg-surface-container-low text-on-surface-variant">
            <span className="text-[40px]" aria-hidden="true">
              {city.emoji}
            </span>
            <span className="font-caption text-caption">{t("explore.noMemoryYet")}</span>
          </div>
        )}
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <p
            className={`mb-1 font-label-md text-label-md uppercase tracking-[0.2em] ${
              best ? "text-surface-container-high" : "text-on-surface-variant"
            }`}
          >
            {country ? countryName(country, language) : ""}
          </p>
          <h2
            className={`font-display-lg-mobile text-display-lg-mobile leading-none ${
              best ? "text-surface" : "text-on-background"
            }`}
          >
            {cityName(city, language)}
          </h2>
        </div>
        {best ? (
          <div className="absolute left-6 top-6 z-10">
            <DevelopmentBadge status={best.info.status} progress={best.info.progress} />
          </div>
        ) : null}
      </div>
    </button>
  );
}

export function ExplorePage() {
  const { diaries } = useDiaries();
  const { t, language } = useTranslation();
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<CountryCode | "ALL">("ALL");

  const filteredCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cities.filter((city) => {
      if (countryFilter !== "ALL" && city.countryCode !== countryFilter) return false;
      if (!q) return true;
      return city.nameKo.includes(search.trim()) || city.nameEn.toLowerCase().includes(q);
    });
  }, [search, countryFilter]);

  return (
    <AppLayout variant="main" title="Explore">
      <div className="flex flex-col gap-stack-lg px-margin-mobile py-stack-md lg:px-margin-desktop">
        <div className="relative mx-auto mb-stack-sm w-full max-w-2xl">
          <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("explore.searchPlaceholder")}
            className="w-full rounded-full bg-surface-container-highest py-4 pl-12 pr-4 font-body-md text-body-md text-on-surface shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="hide-scrollbar sticky top-20 z-30 -mx-margin-mobile flex gap-stack-md overflow-x-auto bg-background/95 px-margin-mobile pb-2 backdrop-blur-sm lg:-mx-margin-desktop lg:px-margin-desktop">
          <button
            type="button"
            onClick={() => setCountryFilter("ALL")}
            className={`whitespace-nowrap rounded-full px-6 py-2 font-label-md text-label-md transition-transform hover:-translate-y-0.5 ${
              countryFilter === "ALL"
                ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(171,53,0,0.3)]"
                : "bg-surface-container text-on-surface-variant"
            }`}
          >
            {t("common.all")}
          </button>
          {countries.map((country) => (
            <button
              key={country.code}
              type="button"
              onClick={() => setCountryFilter(country.code)}
              className={`whitespace-nowrap rounded-full px-6 py-2 font-label-md text-label-md transition-transform hover:-translate-y-0.5 ${
                countryFilter === country.code
                  ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(171,53,0,0.3)]"
                  : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {countryName(country, language)}
            </button>
          ))}
        </div>

        {filteredCities.length === 0 ? (
          <EmptyState
            icon="travel_explore"
            title={t("explore.noResultsTitle")}
            description={t("explore.noResultsDescription")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-stack-lg pb-stack-lg md:grid-cols-2 md:gap-gutter lg:grid-cols-3">
            {filteredCities.map((city, index) => (
              <ExploreCityCard
                key={city.id}
                city={city}
                diaries={diaries.filter((d) => d.cityId === city.id)}
                rotate={[0, 8, -6, 4][index % 4]}
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
