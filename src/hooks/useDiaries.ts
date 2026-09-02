import { useDiaryContext } from "@/store/DiaryContext";

// DiaryContext에 대한 얇은 래퍼. 컴포넌트는 useContext를 직접 쓰지 않고 이 훅만 사용한다.
export function useDiaries() {
  return useDiaryContext();
}
