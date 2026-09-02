import type { Country } from "@/types";

export const countries: Country[] = [
  { code: "KR", nameKo: "대한민국", nameEn: "Korea", region: "Asia" },
  { code: "PT", nameKo: "포르투갈", nameEn: "Portugal", region: "Europe" },
  { code: "JP", nameKo: "일본", nameEn: "Japan", region: "Asia" },
  { code: "CN", nameKo: "중국", nameEn: "China", region: "Asia" },
  { code: "NO", nameKo: "노르웨이", nameEn: "Norway", region: "Scandinavia" },
  { code: "IS", nameKo: "아이슬란드", nameEn: "Iceland", region: "Scandinavia" },
];

export function getCountry(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}
