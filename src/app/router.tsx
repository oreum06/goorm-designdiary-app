import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";

// Home을 제외한 나머지 화면은 지연 로딩한다 — 특히 Memory Map은 leaflet/react-leaflet을
// 끌고 오므로, 지도를 실제로 열 때만 해당 청크를 내려받도록 분리하는 이득이 크다.
const ExplorePage = lazy(() => import("@/pages/ExplorePage").then((m) => ({ default: m.ExplorePage })));
const DiaryCreatePage = lazy(() => import("@/pages/DiaryCreatePage").then((m) => ({ default: m.DiaryCreatePage })));
const DiaryDetailPage = lazy(() => import("@/pages/DiaryDetailPage").then((m) => ({ default: m.DiaryDetailPage })));
const DiaryEditPage = lazy(() => import("@/pages/DiaryEditPage").then((m) => ({ default: m.DiaryEditPage })));
const TripBookPage = lazy(() => import("@/pages/TripBookPage").then((m) => ({ default: m.TripBookPage })));
const MapPage = lazy(() => import("@/pages/MapPage").then((m) => ({ default: m.MapPage })));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })));

function RouteFallback() {
  return <div className="min-h-dvh w-full bg-background" aria-hidden="true" />;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/diaries/new" element={<DiaryCreatePage />} />
          <Route path="/diaries/:id" element={<DiaryDetailPage />} />
          <Route path="/diaries/:id/edit" element={<DiaryEditPage />} />
          <Route path="/tripbook" element={<TripBookPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
