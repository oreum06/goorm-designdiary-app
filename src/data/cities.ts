import type { City } from "@/types";
import { countries } from "@/data/countries";

function query(nameEn: string, countryCode: City["countryCode"]): string {
  const country = countries.find((c) => c.code === countryCode);
  return `${nameEn} ${country?.nameEn ?? ""} travel landmark`.trim();
}

export const cities: City[] = [
  // 대한민국
  { id: "kr-seoul", countryCode: "KR", nameKo: "서울", nameEn: "Seoul", latitude: 37.5665, longitude: 126.978, searchQuery: query("Seoul", "KR"), emoji: "🏙️" },
  { id: "kr-busan", countryCode: "KR", nameKo: "부산", nameEn: "Busan", latitude: 35.1796, longitude: 129.0756, searchQuery: query("Busan", "KR"), emoji: "🌊" },
  { id: "kr-jeju", countryCode: "KR", nameKo: "제주", nameEn: "Jeju", latitude: 33.4996, longitude: 126.5312, searchQuery: query("Jeju", "KR"), emoji: "🍊" },
  { id: "kr-gyeongju", countryCode: "KR", nameKo: "경주", nameEn: "Gyeongju", latitude: 35.8562, longitude: 129.2247, searchQuery: query("Gyeongju", "KR"), emoji: "🏯" },
  { id: "kr-jeonju", countryCode: "KR", nameKo: "전주", nameEn: "Jeonju", latitude: 35.8242, longitude: 127.148, searchQuery: query("Jeonju", "KR"), emoji: "🍜" },

  // 포르투갈
  { id: "pt-lisbon", countryCode: "PT", nameKo: "리스본", nameEn: "Lisbon", latitude: 38.7223, longitude: -9.1393, searchQuery: query("Lisbon", "PT"), emoji: "🚋" },
  { id: "pt-porto", countryCode: "PT", nameKo: "포르투", nameEn: "Porto", latitude: 41.1579, longitude: -8.6291, searchQuery: query("Porto", "PT"), emoji: "🍷" },
  { id: "pt-sintra", countryCode: "PT", nameKo: "신트라", nameEn: "Sintra", latitude: 38.8029, longitude: -9.3817, searchQuery: query("Sintra", "PT"), emoji: "🏰" },
  { id: "pt-faro", countryCode: "PT", nameKo: "파루", nameEn: "Faro", latitude: 37.0194, longitude: -7.9304, searchQuery: query("Faro", "PT"), emoji: "🏖️" },
  { id: "pt-braga", countryCode: "PT", nameKo: "브라가", nameEn: "Braga", latitude: 41.5454, longitude: -8.4265, searchQuery: query("Braga", "PT"), emoji: "⛪" },

  // 일본
  { id: "jp-tokyo", countryCode: "JP", nameKo: "도쿄", nameEn: "Tokyo", latitude: 35.6762, longitude: 139.6503, searchQuery: query("Tokyo", "JP"), emoji: "🗼" },
  { id: "jp-kyoto", countryCode: "JP", nameKo: "교토", nameEn: "Kyoto", latitude: 35.0116, longitude: 135.7681, searchQuery: query("Kyoto", "JP"), emoji: "⛩️" },
  { id: "jp-osaka", countryCode: "JP", nameKo: "오사카", nameEn: "Osaka", latitude: 34.6937, longitude: 135.5023, searchQuery: query("Osaka", "JP"), emoji: "🐙" },
  { id: "jp-sapporo", countryCode: "JP", nameKo: "삿포로", nameEn: "Sapporo", latitude: 43.0618, longitude: 141.3545, searchQuery: query("Sapporo", "JP"), emoji: "❄️" },
  { id: "jp-fukuoka", countryCode: "JP", nameKo: "후쿠오카", nameEn: "Fukuoka", latitude: 33.5904, longitude: 130.4017, searchQuery: query("Fukuoka", "JP"), emoji: "🍥" },
  { id: "jp-nara", countryCode: "JP", nameKo: "나라", nameEn: "Nara", latitude: 34.6851, longitude: 135.8048, searchQuery: query("Nara", "JP"), emoji: "🦌" },

  // 중국
  { id: "cn-beijing", countryCode: "CN", nameKo: "베이징", nameEn: "Beijing", latitude: 39.9042, longitude: 116.4074, searchQuery: query("Beijing", "CN"), emoji: "🏯" },
  { id: "cn-shanghai", countryCode: "CN", nameKo: "상하이", nameEn: "Shanghai", latitude: 31.2304, longitude: 121.4737, searchQuery: query("Shanghai", "CN"), emoji: "🌆" },
  { id: "cn-xian", countryCode: "CN", nameKo: "시안", nameEn: "Xi'an", latitude: 34.3416, longitude: 108.9398, searchQuery: query("Xi'an", "CN"), emoji: "🗿" },
  { id: "cn-chengdu", countryCode: "CN", nameKo: "청두", nameEn: "Chengdu", latitude: 30.5728, longitude: 104.0668, searchQuery: query("Chengdu", "CN"), emoji: "🐼" },
  { id: "cn-hangzhou", countryCode: "CN", nameKo: "항저우", nameEn: "Hangzhou", latitude: 30.2741, longitude: 120.1551, searchQuery: query("Hangzhou", "CN"), emoji: "🌸" },
  { id: "cn-guangzhou", countryCode: "CN", nameKo: "광저우", nameEn: "Guangzhou", latitude: 23.1291, longitude: 113.2644, searchQuery: query("Guangzhou", "CN"), emoji: "🐉" },

  // 노르웨이
  { id: "no-oslo", countryCode: "NO", nameKo: "오슬로", nameEn: "Oslo", latitude: 59.9139, longitude: 10.7522, searchQuery: query("Oslo", "NO"), emoji: "🛶" },
  { id: "no-bergen", countryCode: "NO", nameKo: "베르겐", nameEn: "Bergen", latitude: 60.3913, longitude: 5.3221, searchQuery: query("Bergen", "NO"), emoji: "🐟" },
  { id: "no-tromso", countryCode: "NO", nameKo: "트롬쇠", nameEn: "Tromso", latitude: 69.6492, longitude: 18.9553, searchQuery: query("Tromso", "NO"), emoji: "🌌" },
  { id: "no-stavanger", countryCode: "NO", nameKo: "스타방에르", nameEn: "Stavanger", latitude: 58.97, longitude: 5.7331, searchQuery: query("Stavanger", "NO"), emoji: "⛰️" },
  { id: "no-alesund", countryCode: "NO", nameKo: "올레순", nameEn: "Alesund", latitude: 62.4722, longitude: 6.1495, searchQuery: query("Alesund", "NO"), emoji: "🏘️" },

  // 아이슬란드
  { id: "is-reykjavik", countryCode: "IS", nameKo: "레이캬비크", nameEn: "Reykjavik", latitude: 64.1466, longitude: -21.9426, searchQuery: query("Reykjavik", "IS"), emoji: "🌋" },
  { id: "is-vik", countryCode: "IS", nameKo: "비크", nameEn: "Vik", latitude: 63.4181, longitude: -19.006, searchQuery: query("Vik", "IS"), emoji: "⚫" },
  { id: "is-akureyri", countryCode: "IS", nameKo: "아쿠레이리", nameEn: "Akureyri", latitude: 65.6835, longitude: -18.0878, searchQuery: query("Akureyri", "IS"), emoji: "🐋" },
  { id: "is-husavik", countryCode: "IS", nameKo: "후사비크", nameEn: "Husavik", latitude: 66.0449, longitude: -17.3389, searchQuery: query("Husavik", "IS"), emoji: "🐳" },
  { id: "is-selfoss", countryCode: "IS", nameKo: "셀포스", nameEn: "Selfoss", latitude: 63.9339, longitude: -21.0, searchQuery: query("Selfoss", "IS"), emoji: "💧" },
];

export function getCity(id: string): City | undefined {
  return cities.find((c) => c.id === id);
}

export function getCitiesByCountry(countryCode: string): City[] {
  return cities.filter((c) => c.countryCode === countryCode);
}
