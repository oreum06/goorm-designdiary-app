import { Link, NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@/components/common/Icon";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { NAV_ITEMS } from "@/components/layout/navItems";
import { useTranslation } from "@/hooks/useTranslation";

// Home / Explore / Trip Book / Map에서 쓰는 브랜드 헤더. 모바일은 로고+타이틀,
// 데스크톱(1024px+)은 로고 + 상단 내비 + "새 기억" CTA로 구성된다(하단 탭 대체).
// 언어 전환 버튼은 두 레이아웃 모두 화면 좌측 상단에 위치한다.
export function BrandHeader({ title }: { title: string }) {
  const { t } = useTranslation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background/80 pt-safe shadow-[0_1px_8px_rgba(35,28,20,0.04)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-between px-margin-mobile lg:hidden">
        <LanguageToggle compact />
        <div className="flex items-center gap-2">
          <Icon name="camera" className="text-[22px] text-primary" aria-hidden />
          <span className="font-headline-sm text-headline-sm tracking-tight">{title}</span>
        </div>
        <Link
          to="/diaries/new"
          aria-label={t("common.addMemory")}
          className="flex w-10 items-center justify-end text-on-surface"
        >
          <Icon name="add_circle" className="text-[24px]" />
        </Link>
      </div>

      <div className="hidden h-20 items-center justify-between px-margin-desktop lg:flex">
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link to="/" className="flex items-center gap-2" aria-label={t("header.logoAria")}>
            <Icon name="camera" className="text-[22px] text-primary" aria-hidden />
            <span className="font-headline-sm text-headline-sm italic">Afterimage</span>
          </Link>
        </div>
        <nav className="flex items-center gap-8" aria-label={t("nav.ariaLabel")}>
          {NAV_ITEMS.filter((item) => item.path !== "/diaries/new").map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `font-label-md text-label-md uppercase tracking-widest transition-colors ${
                  isActive ? "text-primary" : "text-on-surface-variant hover:text-on-background"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Link
          to="/diaries/new"
          className="inline-flex items-center gap-2 rounded-full bg-primary-container px-5 py-2.5 font-label-md text-label-md text-on-primary-container shadow-[0_4px_14px_rgba(255,107,53,0.3)] transition-opacity hover:opacity-90"
        >
          <Icon name="add" className="text-[18px]" />
          {t("header.newMemoryCta")}
        </Link>
      </div>
    </header>
  );
}

// 위저드/상세/수정 화면에서 쓰는 뒤로가기 헤더. 언어 전환 버튼을 가장 좌측에 둔다.
export function BackHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-surface/80 pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.04)] backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 px-2">
        <LanguageToggle compact />
        <button
          type="button"
          aria-label={t("header.backAria")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition-colors hover:bg-surface-container"
          onClick={onBack ?? (() => navigate(-1))}
        >
          <Icon name="arrow_back_ios_new" className="text-[20px]" />
        </button>
        <h1 className="font-headline-sm text-headline-sm truncate text-on-surface">{title}</h1>
      </div>
    </header>
  );
}
