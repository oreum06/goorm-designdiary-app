import type { UnsplashError, UnsplashPhoto } from "@/types";

export type SearchResult =
  | { status: "success"; photos: UnsplashPhoto[] }
  | { status: "error"; error: UnsplashError };

// 같은 도시 검색 결과는 메모리에 캐싱해 Demo 요청 한도를 아낀다(FR-02).
const searchCache = new Map<string, UnsplashPhoto[]>();

type UnsplashApiPhoto = {
  id: string;
  width: number;
  height: number;
  alt_description: string | null;
  description: string | null;
  urls: { regular: string; small: string; thumb: string };
  user?: { name?: string; links?: { html?: string } };
  links?: { html?: string; download_location?: string };
};

type UnsplashSearchResponse = { results?: UnsplashApiPhoto[] };

function mapUnsplashPhoto(raw: UnsplashApiPhoto): UnsplashPhoto {
  return {
    id: raw.id,
    width: raw.width,
    height: raw.height,
    altDescription: raw.alt_description ?? raw.description ?? "여행 사진",
    urls: { regular: raw.urls.regular, small: raw.urls.small, thumb: raw.urls.thumb },
    photographer: {
      name: raw.user?.name ?? "Unknown",
      profileUrl: raw.user?.links?.html ?? "",
    },
    links: {
      html: raw.links?.html ?? "",
      downloadLocation: raw.links?.download_location ?? "",
    },
  };
}

export async function searchCityPhotos(
  query: string,
  signal?: AbortSignal,
): Promise<SearchResult> {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return { status: "error", error: { type: "no-key" } };
  }

  const cached = searchCache.get(query);
  if (cached) {
    return { status: "success", photos: cached };
  }

  const url = new URL("https://api.unsplash.com/search/photos");
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", "landscape");
  url.searchParams.set("content_filter", "high");
  url.searchParams.set("per_page", "12");

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    return { status: "error", error: { type: "network" } };
  }

  if (response.status === 401 || response.status === 403) {
    return { status: "error", error: { type: "auth" } };
  }
  if (response.status === 429) {
    return { status: "error", error: { type: "rate-limit" } };
  }
  if (!response.ok) {
    return { status: "error", error: { type: "network" } };
  }

  const data = (await response.json()) as UnsplashSearchResponse;
  const photos = (data.results ?? []).map(mapUnsplashPhoto);

  if (photos.length === 0) {
    return { status: "error", error: { type: "no-results" } };
  }

  searchCache.set(query, photos);
  return { status: "success", photos };
}

// 사용자가 사진을 실제로 선택·저장할 때 Unsplash의 download_location 트래킹 규칙을 따른다.
export async function trackPhotoDownload(downloadLocation: string): Promise<void> {
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  if (!accessKey || !downloadLocation) return;
  try {
    await fetch(downloadLocation, { headers: { Authorization: `Client-ID ${accessKey}` } });
  } catch {
    // 다운로드 트래킹 실패는 조용히 무시한다 — 핵심 저장 흐름을 막지 않는다.
  }
}
