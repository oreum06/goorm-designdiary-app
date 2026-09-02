type ProgressRingProps = {
  progress: number;
  size?: number;
  className?: string;
  trackClassName?: string;
  indicatorClassName?: string;
  labelClassName?: string;
};

// Home 히어로 카드와 기억 상세 화면에서 함께 쓰는 원형 진행률 인디케이터.
export function ProgressRing({
  progress,
  size = 40,
  className = "",
  trackClassName = "text-on-primary/30",
  indicatorClassName = "text-tertiary-fixed-dim",
  labelClassName = "text-on-background",
}: ProgressRingProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36" aria-hidden="true">
        <path
          className={trackClassName}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <path
          className={`${indicatorClassName} transition-all duration-1000 ease-out`}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none"
          stroke="currentColor"
          strokeDasharray={`${progress}, 100`}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </svg>
      <span className={`absolute font-caption text-caption font-semibold ${labelClassName}`}>{progress}%</span>
    </div>
  );
}
