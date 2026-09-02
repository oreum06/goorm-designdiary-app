import { NavLink } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { NAV_ITEMS } from "@/components/layout/navItems";
import { useTranslation } from "@/hooks/useTranslation";

// 0~1023px: 하단 탭 내비게이션. 1024px 이상에서는 BrandHeader의 상단 내비로 대체된다.
// 탭 라벨(Home/Explore/Add/Trip/Map)은 언어와 무관하게 항상 영문 그대로 표기한다.
export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-background/90 pb-safe shadow-[0_-1px_8px_rgba(35,28,20,0.04)] backdrop-blur-xl lg:hidden"
      aria-label={t("nav.ariaLabel")}
    >
      <div className="flex h-20 items-center justify-around px-2">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              `flex h-14 w-14 flex-col items-center justify-center gap-1 transition-colors ${
                isActive ? "text-primary" : "text-on-surface-variant"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon name={item.icon} filled={isActive} className="text-[24px]" />
                <span className="font-label-md text-[10px] uppercase tracking-widest">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
