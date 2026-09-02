import type { UnsplashErrorType } from "@/types";
import type { TranslationKey } from "@/i18n/translations";

export const UNSPLASH_ERROR_KEY: Record<UnsplashErrorType, TranslationKey> = {
  "no-key": "errors.unsplash.noKey",
  auth: "errors.unsplash.auth",
  "rate-limit": "errors.unsplash.rateLimit",
  network: "errors.unsplash.network",
  "no-results": "errors.unsplash.noResults",
};
