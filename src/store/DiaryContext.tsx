import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import type { TravelDiary } from "@/types";
import { load, save } from "@/utils/storage";

export type NewDiaryInput = Omit<
  TravelDiary,
  "id" | "createdAt" | "updatedAt" | "revisitCount" | "editCount" | "developedNotifiedAt"
>;

type DiaryContextValue = {
  diaries: TravelDiary[];
  storageRecovered: boolean;
  getDiary: (id: string) => TravelDiary | undefined;
  addDiary: (input: NewDiaryInput) => TravelDiary;
  updateDiary: (
    id: string,
    patch: Partial<Omit<TravelDiary, "id" | "createdAt">>,
    options?: { bumpEditCount?: boolean },
  ) => void;
  removeDiary: (id: string) => void;
  incrementRevisit: (id: string) => void;
  markDevelopedNotified: (id: string, at: string) => void;
};

const DiaryContext = createContext<DiaryContextValue | null>(null);

export function DiaryProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(() => load());
  const [diaries, setDiaries] = useState<TravelDiary[]>(initial.diaries);

  // 모든 변경은 이 헬퍼를 거쳐 state와 localStorage를 함께 갱신한다(단일 소스 유지).
  const mutate = useCallback((updater: (prev: TravelDiary[]) => TravelDiary[]) => {
    setDiaries((prev) => {
      const next = updater(prev);
      save(next);
      return next;
    });
  }, []);

  const getDiary = useCallback(
    (id: string) => diaries.find((d) => d.id === id),
    [diaries],
  );

  const addDiary = useCallback(
    (input: NewDiaryInput): TravelDiary => {
      const now = new Date().toISOString();
      const diary: TravelDiary = {
        ...input,
        id: crypto.randomUUID(),
        revisitCount: 0,
        editCount: 0,
        developedNotifiedAt: undefined,
        createdAt: now,
        updatedAt: now,
      };
      mutate((prev) => [diary, ...prev]);
      return diary;
    },
    [mutate],
  );

  const updateDiary: DiaryContextValue["updateDiary"] = useCallback(
    (id, patch, options) => {
      mutate((prev) =>
        prev.map((d) =>
          d.id === id
            ? {
                ...d,
                ...patch,
                editCount: options?.bumpEditCount ? d.editCount + 1 : d.editCount,
                updatedAt: new Date().toISOString(),
              }
            : d,
        ),
      );
    },
    [mutate],
  );

  const removeDiary = useCallback(
    (id: string) => {
      mutate((prev) => prev.filter((d) => d.id !== id));
    },
    [mutate],
  );

  const incrementRevisit = useCallback(
    (id: string) => {
      mutate((prev) =>
        prev.map((d) => (d.id === id ? { ...d, revisitCount: d.revisitCount + 1 } : d)),
      );
    },
    [mutate],
  );

  const markDevelopedNotified = useCallback(
    (id: string, at: string) => {
      mutate((prev) =>
        prev.map((d) => (d.id === id ? { ...d, developedNotifiedAt: at } : d)),
      );
    },
    [mutate],
  );

  return (
    <DiaryContext.Provider
      value={{
        diaries,
        storageRecovered: initial.recovered,
        getDiary,
        addDiary,
        updateDiary,
        removeDiary,
        incrementRevisit,
        markDevelopedNotified,
      }}
    >
      {children}
    </DiaryContext.Provider>
  );
}

export function useDiaryContext(): DiaryContextValue {
  const ctx = useContext(DiaryContext);
  if (!ctx) throw new Error("useDiaryContext는 DiaryProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
