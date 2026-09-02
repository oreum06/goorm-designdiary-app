import { useEffect, useRef } from "react";
import { LanguageProvider } from "@/store/LanguageContext";
import { DiaryProvider } from "@/store/DiaryContext";
import { ToastProvider, useToast } from "@/store/ToastContext";
import { useDiaries } from "@/hooks/useDiaries";
import { useTranslation } from "@/hooks/useTranslation";
import { useDevelopmentWatcher } from "@/hooks/useDevelopmentWatcher";
import { AppRouter } from "@/app/router";

function AppInner() {
  useDevelopmentWatcher();

  const { storageRecovered } = useDiaries();
  const { show } = useToast();
  const { t } = useTranslation();
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (storageRecovered && !notifiedRef.current) {
      notifiedRef.current = true;
      show(t("toast.storageRecovered"), "error");
    }
  }, [storageRecovered, show, t]);

  return <AppRouter />;
}

export function App() {
  return (
    <LanguageProvider>
      <ToastProvider>
        <DiaryProvider>
          <AppInner />
        </DiaryProvider>
      </ToastProvider>
    </LanguageProvider>
  );
}
