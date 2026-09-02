import { useCallback } from "react";
import { useLanguageContext } from "@/store/LanguageContext";
import { translations, type TranslationKey } from "@/i18n/translations";

type TranslationVars = Record<string, string | number>;

export function useTranslation() {
  const { language, setLanguage, toggleLanguage } = useLanguageContext();

  const t = useCallback(
    (key: TranslationKey, vars?: TranslationVars): string => {
      let text = translations[language][key];
      if (vars) {
        for (const [name, value] of Object.entries(vars)) {
          text = text.replaceAll(`{${name}}`, String(value));
        }
      }
      return text;
    },
    [language],
  );

  return { t, language, setLanguage, toggleLanguage };
}
