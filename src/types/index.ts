export type CountryCode = "KR" | "PT" | "JP" | "CN" | "NO" | "IS";

export type Language = "ko" | "en";

export type DevelopmentStatus = "undeveloped" | "developing" | "developed";

export type DiaryPhoto = {
  id: string;
  imageUrl: string;
  thumbUrl: string;
  altDescription: string;
  photographerName: string;
  photographerUrl: string;
  unsplashUrl: string;
};

export type TravelDiary = {
  id: string;
  countryCode: CountryCode;
  cityId: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string;
  note: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  companions?: string;
  tags: string[];
  photo: DiaryPhoto;
  // 현상 시스템 관련 필드 — 상태/진행률은 저장하지 않고 항상 파생 계산한다.
  revisitCount: number;
  editCount: number;
  developedNotifiedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type Country = {
  code: CountryCode;
  nameKo: string;
  nameEn: string;
  region: "Asia" | "Europe" | "Scandinavia";
};

export type City = {
  id: string;
  countryCode: CountryCode;
  nameKo: string;
  nameEn: string;
  latitude: number;
  longitude: number;
  searchQuery: string;
  emoji: string;
};

export type DevelopmentInfo = {
  status: DevelopmentStatus;
  progress: number;
  filter: string;
};

// 작성 위저드에서 아직 저장되지 않은 초안. id/createdAt/updatedAt/revisitCount/editCount는
// 마지막 확정 저장 시점에 부여된다.
export type DiaryDraft = {
  countryCode?: CountryCode;
  cityId?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  note?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  companions?: string;
  tags: string[];
  photo?: DiaryPhoto;
};

export type UnsplashPhoto = {
  id: string;
  width: number;
  height: number;
  altDescription: string;
  urls: { regular: string; small: string; thumb: string };
  photographer: { name: string; profileUrl: string };
  links: { html: string; downloadLocation: string };
};

export type UnsplashErrorType =
  | "no-key"
  | "auth"
  | "rate-limit"
  | "network"
  | "no-results";

// 메시지 문구는 i18n 사전에서 언어에 맞게 해석한다(서비스 계층은 타입만 반환).
export type UnsplashError = {
  type: UnsplashErrorType;
};
