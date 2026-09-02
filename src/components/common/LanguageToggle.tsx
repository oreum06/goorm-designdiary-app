import { useTranslation } from "@/hooks/useTranslation";
import { Icon } from "@/components/common/Icon";

type LanguageToggleProps = {
  className?: string;
  // 모바일 헤더처럼 폭이 빠듯한 자리에서는 아이콘만 보여준다(언어 코드는 aria-label로 전달).
  compact?: boolean;
};

export function LanguageToggle({ className = "", compact = false }: LanguageToggleProps) {
  const { language, toggleLanguage, t } = useTranslation();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      aria-label={t("header.languageToggleAria")}
      className={`flex items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container ${
        compact ? "h-10 w-10" : "gap-1 px-2 py-1.5"
      } ${className}`}
    >
      <Icon name="translate" className="text-[20px]" />
      {compact ? null : (
        <span className="font-label-md text-[11px] font-bold uppercase tracking-wider">
          {language === "ko" ? "KO" : "EN"}
        </span>
      )}
    </button>
  );
}
