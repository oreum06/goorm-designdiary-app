import { useCallback, useRef, useState } from "react";
import type { UnsplashError, UnsplashPhoto } from "@/types";
import { searchCityPhotos, type SearchResult } from "@/services/unsplash";

export type PhotoSearchState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; photos: UnsplashPhoto[] }
  | { status: "error"; error: UnsplashError };

// 검색 버튼 방식(입력마다 자동 검색하지 않음)으로 Demo 요청 한도를 아낀다(FR-02).
// 캐싱/디바운스는 services/unsplash.ts와 PhotoPicker의 입력 처리에서 담당한다.
export function useUnsplashPhotos() {
  const [state, setState] = useState<PhotoSearchState>({ status: "idle" });
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState({ status: "loading" });

    let result: SearchResult;
    try {
      result = await searchCityPhotos(trimmed, controller.signal);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return; // 새 검색이 이미 진행 중
      result = { status: "error", error: { type: "network" } };
    }

    setState(result);
  }, []);

  return { state, search };
}
