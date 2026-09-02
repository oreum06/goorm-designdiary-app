import { Link } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { Icon } from "@/components/common/Icon";
import { useTranslation } from "@/hooks/useTranslation";

export function NotFoundPage() {
  const { t } = useTranslation();
  return (
    <AppLayout variant="main" title={t("notfound.pageTitle")}>
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-margin-mobile text-center">
        <Icon name="explore_off" className="text-[48px] text-on-surface-variant" />
        <h1 className="font-headline-md text-headline-md text-on-background">{t("notfound.title")}</h1>
        <p className="font-body-md text-body-md max-w-xs text-text-muted">{t("notfound.description")}</p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm"
        >
          <Icon name="home" className="text-[18px]" />
          {t("notfound.goHome")}
        </Link>
      </div>
    </AppLayout>
  );
}
