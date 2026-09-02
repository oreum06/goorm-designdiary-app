import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/common/Icon";
import { EmptyState } from "@/components/common/EmptyState";
import { DevelopmentBadge } from "@/components/diary/DevelopmentBadge";
import { useDiaries } from "@/hooks/useDiaries";
import { useTranslation } from "@/hooks/useTranslation";
import { getCity } from "@/data/cities";
import type { City, DevelopmentInfo, TravelDiary } from "@/types";
import { getDevelopmentInfo } from "@/utils/development";
import { withDevelopmentAlt } from "@/i18n/development";
import { cityName } from "@/i18n/localizedNames";
import { formatDateShort } from "@/utils/format";

type CityGroup = { city: City; entries: { diary: TravelDiary; info: DevelopmentInfo }[] };

function buildMarkerIcon(entry: { diary: TravelDiary; info: DevelopmentInfo }, count: number, active: boolean): L.DivIcon {
  const size = active ? 64 : 48;
  const html = renderToStaticMarkup(
    <div className="flex flex-col items-center" style={{ width: size }}>
      <div
        className="relative rounded-full bg-surface p-1 shadow-[0_4px_12px_rgba(35,28,20,0.15)]"
        style={{ width: size, height: size }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-full bg-surface-variant">
          <img
            src={entry.diary.photo.thumbUrl}
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: entry.info.filter }}
          />
        </div>
        {count > 1 ? (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
            {count}
          </span>
        ) : null}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "8px solid #ffffff",
          marginTop: "-2px",
        }}
      />
    </div>,
  );

  return L.divIcon({
    html,
    className: "",
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 8)],
  });
}

function FlyToSelected({ city }: { city: City | undefined }) {
  const map = useMap();
  useEffect(() => {
    if (!city) return;
    map.flyTo([city.latitude, city.longitude], 6, { duration: 0.8 });
  }, [city, map]);
  return null;
}

// 마운트 시 한 번만 모든 마커가 보이도록 시야를 맞춘다(이후 diaries 변경으로 groups
// 참조가 바뀌어도 다시 fit하지 않음 — 사용자가 직접 이동/확대한 시야를 존중한다).
function FitAllMarkers({ groups }: { groups: CityGroup[] }) {
  const map = useMap();
  const didFitRef = useRef(false);

  useEffect(() => {
    if (didFitRef.current || groups.length === 0) return;
    didFitRef.current = true;

    if (groups.length === 1) {
      map.setView([groups[0].city.latitude, groups[0].city.longitude], 6);
      return;
    }
    const bounds = L.latLngBounds(groups.map((g) => [g.city.latitude, g.city.longitude] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [groups, map]);

  return null;
}

class MapErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

function VisitedCityList({ groups }: { groups: CityGroup[] }) {
  const { t, language } = useTranslation();
  return (
    <div className="flex flex-col gap-3 px-margin-mobile py-stack-md">
      <EmptyState icon="map" title={t("map.loadFailedTitle")} description={t("map.loadFailedDescription")} />
      {groups.map(({ city, entries }) => {
        const best = entries.slice().sort((a, b) => b.info.progress - a.info.progress)[0];
        return (
          <Link
            key={city.id}
            to={`/diaries/${best.diary.id}`}
            className="flex items-center justify-between rounded-xl bg-surface px-4 py-3 shadow-sm"
          >
            <span className="font-body-md text-on-surface">
              {city.emoji} {cityName(city, language)}
            </span>
            <DevelopmentBadge status={best.info.status} progress={best.info.progress} />
          </Link>
        );
      })}
    </div>
  );
}

export function MapPage() {
  const { diaries } = useDiaries();
  const { t, language } = useTranslation();
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

  const groups = useMemo<CityGroup[]>(() => {
    const byCity = new Map<string, TravelDiary[]>();
    for (const diary of diaries) {
      const list = byCity.get(diary.cityId) ?? [];
      list.push(diary);
      byCity.set(diary.cityId, list);
    }
    const result: CityGroup[] = [];
    for (const [cityId, list] of byCity) {
      const city = getCity(cityId);
      if (!city) continue;
      result.push({ city, entries: list.map((diary) => ({ diary, info: getDevelopmentInfo(diary) })) });
    }
    return result;
  }, [diaries]);

  const selectedGroup = groups.find((g) => g.city.id === selectedCityId);
  const selectedBest = selectedGroup
    ? selectedGroup.entries.slice().sort((a, b) => b.info.progress - a.info.progress)[0]
    : undefined;

  if (diaries.length === 0) {
    return (
      <AppLayout variant="main" title="Memory Map">
        <EmptyState
          icon="map"
          title={t("map.emptyTitle")}
          description={t("map.emptyDescription")}
          action={
            <Link
              to="/diaries/new"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm"
            >
              {t("common.addMemory")}
            </Link>
          }
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout variant="main" title="Memory Map">
      <div className="flex h-[calc(100dvh-11rem)] w-full flex-col lg:h-[calc(100dvh-8rem)] lg:flex-row lg:gap-6 lg:px-margin-desktop lg:py-stack-md">
        <div className="relative flex-1 overflow-hidden lg:rounded-[24px]">
          <MapErrorBoundary fallback={<VisitedCityList groups={groups} />}>
            <MapContainer
              center={[20, 10]}
              zoom={2}
              scrollWheelZoom
              className="h-full w-full"
              style={{ background: "#f6f3f2" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <FitAllMarkers groups={groups} />
              <FlyToSelected city={selectedGroup?.city} />
              {groups.map((group) => {
                const best = group.entries.slice().sort((a, b) => b.info.progress - a.info.progress)[0];
                return (
                  <Marker
                    key={group.city.id}
                    position={[group.city.latitude, group.city.longitude]}
                    icon={buildMarkerIcon(best, group.entries.length, group.city.id === selectedCityId)}
                    eventHandlers={{ click: () => setSelectedCityId(group.city.id) }}
                    alt={withDevelopmentAlt(
                      t,
                      t("map.markerAlt", { city: cityName(group.city, language) }),
                      best.info.status,
                    )}
                  />
                );
              })}
            </MapContainer>
          </MapErrorBoundary>

          {selectedGroup && selectedBest ? (
            <div className="absolute inset-x-4 bottom-4 z-[1000] lg:hidden">
              <div className="relative flex flex-col gap-4 overflow-hidden rounded-3xl bg-surface p-4 shadow-[0_12px_30px_rgba(35,28,20,0.12)]">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-surface-variant shadow-sm">
                    <img
                      src={selectedBest.diary.photo.thumbUrl}
                      alt={withDevelopmentAlt(t, selectedBest.diary.photo.altDescription, selectedBest.info.status)}
                      className="h-full w-full object-cover"
                      style={{ filter: selectedBest.info.filter }}
                    />
                  </div>
                  <div className="flex flex-grow flex-col justify-center py-1">
                    <span className="mb-1 font-label-md text-caption uppercase tracking-widest text-text-muted">
                      {formatDateShort(selectedBest.diary.startDate, language)}
                    </span>
                    <h2 className="mb-1 font-headline-sm text-headline-sm leading-tight text-on-surface">
                      {selectedBest.diary.title}
                    </h2>
                    <div className="flex items-center gap-1 text-on-surface-variant">
                      <Icon name="location_on" className="text-[16px] text-tertiary" />
                      <span className="font-body-md text-caption">{cityName(selectedGroup.city, language)}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    aria-label={t("common.close")}
                    className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-on-surface-variant/50 hover:text-on-surface-variant"
                    onClick={() => setSelectedCityId(null)}
                  >
                    <Icon name="close" className="text-[20px]" />
                  </button>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-4">
                  <DevelopmentBadge status={selectedBest.info.status} progress={selectedBest.info.progress} />
                  <Link
                    to={`/diaries/${selectedBest.diary.id}`}
                    className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 font-label-md text-label-md text-on-primary shadow-sm transition-colors hover:bg-primary-container"
                  >
                    {t("map.openMemory")}
                    <Icon name="arrow_forward" className="text-[18px]" />
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden w-1/3 flex-col gap-2 overflow-y-auto lg:flex">
          {groups.map((group) => {
            const best = group.entries.slice().sort((a, b) => b.info.progress - a.info.progress)[0];
            const active = group.city.id === selectedCityId;
            return (
              <button
                key={group.city.id}
                type="button"
                onClick={() => setSelectedCityId(group.city.id)}
                className={`flex items-center gap-3 rounded-xl p-3 text-left transition-colors ${
                  active ? "bg-surface shadow-[0_8px_20px_rgba(35,28,20,0.08)]" : "hover:bg-surface-container"
                }`}
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-surface-variant">
                  <img
                    src={best.diary.photo.thumbUrl}
                    alt=""
                    className="h-full w-full object-cover"
                    style={{ filter: best.info.filter }}
                  />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <span className="font-body-md font-semibold text-on-surface">{cityName(group.city, language)}</span>
                  <span className="font-caption text-caption text-text-muted">
                    {t("map.memoryCount", { count: group.entries.length })}
                  </span>
                </div>
                <DevelopmentBadge status={best.info.status} progress={best.info.progress} />
              </button>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
