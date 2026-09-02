type IconProps = {
  name: string;
  filled?: boolean;
  className?: string;
  "aria-hidden"?: boolean;
};

// Material Symbols Outlined 아이콘 폰트를 감싸는 얇은 래퍼.
// filled를 토글하면 별점/활성 탭처럼 채워진 상태를 표현할 수 있다.
export function Icon({ name, filled = false, className = "", ...rest }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 300, 'GRAD' 0, 'opsz' 24` }}
      aria-hidden={rest["aria-hidden"] ?? true}
    >
      {name}
    </span>
  );
}
