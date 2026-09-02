type WashiTapeProps = {
  className?: string;
  rotate?: number;
};

// 목업 전반에 반복되는 워시테이프 스크랩북 장식 요소.
export function WashiTape({ className = "", rotate = 12 }: WashiTapeProps) {
  return (
    <div
      aria-hidden="true"
      className={`absolute h-4 w-12 rounded-sm bg-secondary/30 backdrop-blur-sm ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  );
}
