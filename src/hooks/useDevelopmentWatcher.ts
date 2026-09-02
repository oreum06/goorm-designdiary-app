import { useEffect, useRef } from "react";
import { useDiaries } from "@/hooks/useDiaries";
import { useToast } from "@/store/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";
import { getDevelopmentProgress, getDevelopmentStatus } from "@/utils/development";
import { getCity } from "@/data/cities";
import { cityName } from "@/i18n/localizedNames";

const CHECK_INTERVAL_MS = 60_000;

// App 루트에서 1회만 마운트한다. 진행률은 시계로만 흘러가므로(앱을 닫아둔 사이에도
// 임계값을 넘을 수 있음) 렌더 시점 비교만으로는 전환 순간을 놓칠 수 있어 주기적으로
// 확인한다. developedNotifiedAt 필드가 새로고침을 넘나드는 idempotent 가드 역할을
// 하지만, markDevelopedNotified()가 반영되어 diariesRef에 다시 흘러들어오기 전에
// (예: StrictMode의 effect 이중 실행) check()가 한 번 더 돌면 같은 기록에 대해 토스트가
// 중복 표시될 수 있어, 세션 내에서만 유효한 in-memory 가드(notifiedIdsRef)를 함께 둔다.
export function useDevelopmentWatcher() {
  const { diaries, markDevelopedNotified } = useDiaries();
  const { show } = useToast();
  const { t, language } = useTranslation();
  const diariesRef = useRef(diaries);
  const notifiedIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    diariesRef.current = diaries;
  }, [diaries]);

  useEffect(() => {
    function check() {
      const now = new Date();
      for (const diary of diariesRef.current) {
        if (diary.developedNotifiedAt || notifiedIdsRef.current.has(diary.id)) continue;
        const progress = getDevelopmentProgress(diary, now);
        if (getDevelopmentStatus(progress) !== "developed") continue;

        notifiedIdsRef.current.add(diary.id);
        const city = getCity(diary.cityId);
        show(t("toast.developed", { city: city ? cityName(city, language) : diary.title }), "success");
        markDevelopedNotified(diary.id, now.toISOString());
      }
    }

    check();
    const intervalId = window.setInterval(check, CHECK_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [markDevelopedNotified, show, t, language]);
}
