import type { City, Country, Language } from "@/types";

// 도시/국가 데이터는 nameKo/nameEn을 함께 들고 있으므로, 현재 언어에 맞는 이름만 골라 쓴다.
export function cityName(city: City, language: Language): string {
  return language === "ko" ? city.nameKo : city.nameEn;
}

export function countryName(country: Country, language: Language): string {
  return language === "ko" ? country.nameKo : country.nameEn;
}
