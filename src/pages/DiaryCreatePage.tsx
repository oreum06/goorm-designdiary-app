import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/common/Icon";
import { PhotoPicker } from "@/components/photo/PhotoPicker";
import { DiaryForm, type DiaryFormValues } from "@/components/diary/DiaryForm";
import { useDiaries } from "@/hooks/useDiaries";
import { useToast } from "@/store/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";
import { cities, getCity } from "@/data/cities";
import { countries } from "@/data/countries";
import type { DiaryPhoto } from "@/types";
import { getDevelopmentFilter } from "@/utils/development";
import { withDevelopmentAlt, getStatusName } from "@/i18n/development";
import { cityName, countryName } from "@/i18n/localizedNames";
import { formatDate } from "@/utils/format";
import type { TranslationKey } from "@/i18n/translations";

type Step = 1 | 2 | 3 | 4;

const STEP_TITLE_KEY: Record<Step, TranslationKey> = {
  1: "create.stepDestination",
  2: "create.stepPhoto",
  3: "create.stepDetails",
  4: "create.stepPreview",
};

export function DiaryCreatePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const presetCityId = (location.state as { presetCityId?: string } | null)?.presetCityId;

  const { addDiary } = useDiaries();
  const { show } = useToast();
  const { t, language } = useTranslation();

  const [step, setStep] = useState<Step>(1);
  const [cityId, setCityId] = useState<string | undefined>(presetCityId);
  const [photo, setPhoto] = useState<DiaryPhoto | undefined>();
  const [details, setDetails] = useState<DiaryFormValues | undefined>();
  const [search, setSearch] = useState("");

  const city = cityId ? getCity(cityId) : undefined;

  const searchedCities = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return null;
    return cities.filter((c) => c.nameKo.includes(search.trim()) || c.nameEn.toLowerCase().includes(q));
  }, [search]);

  function selectCity(id: string) {
    setCityId(id);
    setPhoto(undefined);
    setStep(2);
  }

  function handleBack() {
    if (step > 1) {
      setStep((s) => (s - 1) as Step);
    } else {
      navigate(-1);
    }
  }

  function handleConfirmSave() {
    if (!city || !photo || !details) return;
    const diary = addDiary({
      countryCode: city.countryCode,
      cityId: city.id,
      title: details.title,
      startDate: details.startDate,
      endDate: details.endDate || undefined,
      note: details.note,
      rating: details.rating,
      companions: details.companions || undefined,
      tags: details.tags,
      photo,
    });
    show(t("toast.diarySaved", { city: cityName(city, language) }), "success");
    navigate(`/diaries/${diary.id}`);
  }

  return (
    <AppLayout variant="focus" title={t("create.headerTitle")} onBack={handleBack}>
      {step < 4 ? (
        <div className="flex flex-col gap-stack-md px-gutter pb-stack-sm pt-stack-lg">
          <div className="flex w-full items-center gap-unit">
            {([1, 2, 3] as const).map((s) => (
              <div
                key={s}
                className={`h-[2px] flex-1 rounded-full ${s <= step ? "bg-primary" : "bg-surface-variant"}`}
              />
            ))}
          </div>
          <span className="font-caption text-caption font-semibold uppercase tracking-widest text-text-muted">
            {step}. {t(STEP_TITLE_KEY[step])}
          </span>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="flex flex-col gap-stack-lg px-gutter pb-stack-lg">
          <div className="flex flex-col gap-stack-sm">
            <h1 className="font-headline-md text-headline-md text-on-surface">{t("create.destinationTitle")}</h1>
            <p className="text-body-md text-on-surface-variant">{t("create.destinationSubtitle")}</p>
          </div>
          <div className="relative w-full">
            <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("create.destinationSearchPlaceholder")}
              className="w-full rounded-xl border-b-2 border-transparent bg-surface-container-low py-3 pl-10 pr-4 text-on-surface shadow-[0_2px_8px_rgba(35,28,20,0.04)] outline-none transition-colors placeholder:text-on-surface-variant/50 focus:border-outline focus:bg-surface"
            />
          </div>

          {searchedCities ? (
            <div className="flex flex-wrap gap-3">
              {searchedCities.length === 0 ? (
                <p className="font-body-md text-body-md text-text-muted">{t("create.noSearchResults")}</p>
              ) : (
                searchedCities.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCity(c.id)}
                    className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-on-surface shadow-[0_4px_12px_rgba(35,28,20,0.06)] transition-all hover:bg-surface-container"
                  >
                    <span aria-hidden="true">{c.emoji}</span>
                    <span>
                      {c.nameKo} · {c.nameEn}
                    </span>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-stack-lg">
              {countries.map((country) => (
                <div key={country.code} className="flex flex-col gap-stack-sm">
                  <h2 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                    {countryName(country, language)}
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {cities
                      .filter((c) => c.countryCode === country.code)
                      .map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => selectCity(c.id)}
                          className="flex items-center gap-2 rounded-full bg-surface px-4 py-2 text-on-surface shadow-[0_4px_12px_rgba(35,28,20,0.06)] transition-all hover:bg-surface-container"
                        >
                          <span aria-hidden="true">{c.emoji}</span>
                          <span>{cityName(c, language)}</span>
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {step === 2 && city ? (
        <div className="flex flex-col gap-stack-lg px-margin-mobile pb-28">
          <PhotoPicker city={city} value={photo} onChange={setPhoto} />
          <div className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-background via-background to-transparent px-margin-mobile pb-safe pt-8">
            <button
              type="button"
              disabled={!photo}
              onClick={() => setStep(3)}
              className="mb-4 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-label-md text-body-md text-on-primary shadow-[0_8px_16px_rgba(171,53,0,0.2)] transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-surface-container-high disabled:text-on-surface-variant disabled:shadow-none"
            >
              <span>{t("create.photoContinue")}</span>
              <Icon name="arrow_forward" className="text-[20px]" />
            </button>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="flex w-full max-w-md flex-col gap-8 px-4 pb-16 pt-4">
          <DiaryForm
            submitLabel={t("create.previewButton")}
            onSubmit={(values) => {
              setDetails(values);
              setStep(4);
            }}
          />
        </div>
      ) : null}

      {step === 4 && city && photo && details ? (
        <div className="flex flex-1 flex-col items-center px-4 py-8">
          <div className="mb-8 max-w-sm px-4 text-center">
            <h2 className="mb-2 font-headline-md text-headline-md tracking-tight text-on-surface">
              {t("create.previewHeading")}
            </h2>
            <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant opacity-80">
              {t("create.previewSubheading")}
            </p>
          </div>

          <div className="relative w-full max-w-md overflow-hidden rounded-[24px] bg-surface shadow-[0_12px_30px_rgba(35,28,20,0.10)] animate-fade-in-up">
            <div className="relative aspect-[4/5] w-full bg-surface-dim">
              <img
                className="absolute inset-0 h-full w-full scale-105 object-cover"
                src={photo.imageUrl}
                alt={withDevelopmentAlt(t, photo.altDescription, "undeveloped")}
                style={{ filter: getDevelopmentFilter(0) }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim/40 to-transparent" />
              <div className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-surface/30 bg-status-undeveloped/40 text-on-error backdrop-blur-sm">
                  <span className="font-headline-sm text-headline-sm text-on-error">0%</span>
                </div>
                <span className="mt-2 font-label-md text-caption uppercase tracking-widest text-surface/80">
                  {getStatusName(t, "undeveloped")}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 w-full max-w-md px-6 text-center animate-fade-in-up">
            <h3 className="font-headline-sm text-headline-sm italic text-on-background">{details.title}</h3>
            <p className="mt-1 font-body-md text-caption tracking-wider text-on-surface-variant">
              {cityName(city, language)} · {formatDate(details.startDate, language)}
            </p>
          </div>

          <p className="mt-8 max-w-sm px-6 text-center font-body-md text-body-md text-text-muted animate-fade-in-up">
            {t("create.previewHelper")}
          </p>

          <div className="sticky bottom-0 mt-8 w-full bg-gradient-to-t from-background via-background to-transparent px-4 pb-safe pt-4">
            <button
              type="button"
              onClick={handleConfirmSave}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary font-label-md text-body-md text-on-primary shadow-[0_8px_16px_rgba(171,53,0,0.2)] transition-all active:scale-[0.98]"
            >
              <Icon name="book" filled className="text-[20px]" />
              {t("create.saveToTripBook")}
            </button>
          </div>
        </div>
      ) : null}
    </AppLayout>
  );
}
