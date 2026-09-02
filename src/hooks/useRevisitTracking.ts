import { useEffect } from "react";
import { useDiaries } from "@/hooks/useDiaries";

// 상세 화면 진입 시 revisitCount를 세션당 1회만 증가시킨다. sessionStorage 가드를
// incrementRevisit 호출보다 먼저 동기적으로 세워 StrictMode 이중 마운트에도 안전하다.
export function useRevisitTracking(diaryId: string | undefined) {
  const { incrementRevisit } = useDiaries();

  useEffect(() => {
    if (!diaryId) return;
    const key = `afterimage:revisited:${diaryId}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    incrementRevisit(diaryId);
  }, [diaryId, incrementRevisit]);
}
