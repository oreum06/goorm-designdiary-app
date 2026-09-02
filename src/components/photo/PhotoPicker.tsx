import { useEffect, useRef, useState } from "react";
import type { City, DiaryPhoto, UnsplashPhoto } from "@/types";
import { useUnsplashPhotos } from "@/hooks/useUnsplashPhotos";
import { trackPhotoDownload } from "@/services/unsplash";
import { Icon } from "@/components/common/Icon";
import { useTranslation } from "@/hooks/useTranslation";
import { UNSPLASH_ERROR_KEY } from "@/i18n/unsplashErrors";

function toDiaryPhoto(photo: UnsplashPhoto): DiaryPhoto {
  return {
    id: photo.id,
    imageUrl: photo.urls.regular,
    thumbUrl: photo.urls.small,
    altDescription: photo.altDescription,
    photographerName: photo.photographer.name,
    photographerUrl: photo.photographer.profileUrl,
    unsplashUrl: photo.links.html,
  };
}

type PhotoPickerProps = {
  city: City;
  value?: DiaryPhoto;
  onChange: (photo: DiaryPhoto) => void;
};

export function PhotoPicker({ city, value, onChange }: PhotoPickerProps) {
  const { state, search } = useUnsplashPhotos();
  const { t } = useTranslation();
  const [query, setQuery] = useState(city.searchQuery);
  const searchedCityRef = useRef<string | null>(null);

  useEffect(() => {
    setQuery(city.searchQuery);
    if (searchedCityRef.current !== city.id) {
      searchedCityRef.current = city.id;
      void search(city.searchQuery);
    }
    // city가 바뀔 때만 자동 검색한다(검색 버튼 방식 유지, 매 입력마다 검색하지 않음).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city.id]);

  function handleSelect(photo: UnsplashPhoto) {
    const diaryPhoto = toDiaryPhoto(photo);
    onChange(diaryPhoto);
    void trackPhotoDownload(photo.links.downloadLocation);
  }

  return (
    <div className="flex flex-col gap-stack-md">
      <form
        className="relative w-full"
        onSubmit={(e) => {
          e.preventDefault();
          void search(query);
        }}
      >
        <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-status-developing" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("create.photoSearchPlaceholder")}
          className="w-full rounded-full border-b border-border bg-surface-container-low py-3 pl-12 pr-20 font-body-md text-on-background transition-colors focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-4 py-1.5 font-label-md text-[12px] text-on-primary"
        >
          {t("common.search")}
        </button>
      </form>

      {state.status === "loading" ? (
        <div
          className="grid grid-cols-2 gap-unit md:grid-cols-3 md:gap-stack-md"
          aria-busy="true"
          aria-label={t("create.photoSearchingAria")}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-lg bg-surface-container-highest" />
          ))}
        </div>
      ) : null}

      {state.status === "error" ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-container-low px-6 py-10 text-center">
          <Icon name="broken_image" className="text-[32px] text-on-surface-variant" />
          <p className="font-body-md text-body-md text-on-surface-variant">
            {t(UNSPLASH_ERROR_KEY[state.error.type])}
          </p>
          {state.error.type !== "no-key" && state.error.type !== "auth" ? (
            <button
              type="button"
              onClick={() => void search(query)}
              className="rounded-full border border-border px-4 py-2 font-label-md text-label-md text-on-surface"
            >
              {t("common.retry")}
            </button>
          ) : null}
        </div>
      ) : null}

      {state.status === "success" ? (
        <div className="grid grid-cols-2 gap-unit md:grid-cols-3 md:gap-stack-md">
          {state.photos.map((photo) => {
            const isSelected = value?.id === photo.id;
            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => handleSelect(photo)}
                aria-pressed={isSelected}
                aria-label={t("create.photoByAria", { alt: photo.altDescription, name: photo.photographer.name })}
                className={`group relative aspect-[3/4] overflow-hidden rounded-lg ${
                  isSelected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                }`}
              >
                <img
                  src={photo.urls.small}
                  alt={photo.altDescription}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                  <span className="font-caption text-[10px] text-surface/90">
                    ⓒ {photo.photographer.name}
                  </span>
                </div>
                {isSelected ? (
                  <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-md">
                    <Icon name="check" className="text-[16px] text-on-primary" />
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {value ? (
        <p className="font-caption text-caption text-text-muted">
          {t("create.selectedPhotoCredit", { name: value.photographerName })}{" "}
          <a
            href={value.unsplashUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="underline"
          >
            {t("common.viewOnUnsplash")}
          </a>
        </p>
      ) : null}
    </div>
  );
}
