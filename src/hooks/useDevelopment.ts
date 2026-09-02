import { useMemo } from "react";
import type { DevelopmentInfo, TravelDiary } from "@/types";
import { getDevelopmentInfo } from "@/utils/development";

// 렌더링마다 다시 계산하지 않도록 useMemo로 캐싱한다(NFR: 성능).
// `now`를 넘기지 않으면 매 렌더 시점의 현재 시각을 기준으로 계산한다.
export function useDevelopment(
  diary: Pick<TravelDiary, "createdAt" | "revisitCount" | "editCount">,
  now?: Date,
): DevelopmentInfo {
  return useMemo(
    () => getDevelopmentInfo(diary, now),
    [diary.createdAt, diary.revisitCount, diary.editCount, now],
  );
}
