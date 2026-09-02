import { Link, useNavigate, useParams } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { EmptyState } from "@/components/common/EmptyState";
import { DiaryForm, type DiaryFormValues } from "@/components/diary/DiaryForm";
import { useDiaries } from "@/hooks/useDiaries";
import { useToast } from "@/store/ToastContext";
import { useTranslation } from "@/hooks/useTranslation";

export function DiaryEditPage() {
  const { id } = useParams<{ id: string }>();
  const { getDiary, updateDiary } = useDiaries();
  const { show } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const diary = id ? getDiary(id) : undefined;

  if (!diary) {
    return (
      <AppLayout variant="focus" title={t("edit.pageTitle")}>
        <EmptyState
          icon="search_off"
          title={t("common.notFoundTitle")}
          description={t("common.notFoundDescription")}
          action={
            <Link
              to="/tripbook"
              className="mt-2 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-label-md text-label-md text-on-primary shadow-sm"
            >
              {t("common.goToTripBook")}
            </Link>
          }
        />
      </AppLayout>
    );
  }

  function handleSubmit(values: DiaryFormValues) {
    updateDiary(
      diary!.id,
      {
        title: values.title,
        startDate: values.startDate,
        endDate: values.endDate || undefined,
        note: values.note,
        rating: values.rating,
        companions: values.companions || undefined,
        tags: values.tags,
      },
      { bumpEditCount: true },
    );
    show(t("toast.diaryUpdated"), "success");
    navigate(`/diaries/${diary!.id}`);
  }

  return (
    <AppLayout variant="focus" title={t("edit.pageTitle")} onBack={() => navigate(`/diaries/${diary.id}`)}>
      <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 pb-16 pt-4">
        <DiaryForm
          defaultValues={{
            title: diary.title,
            startDate: diary.startDate,
            endDate: diary.endDate ?? "",
            note: diary.note,
            rating: diary.rating,
            companions: diary.companions ?? "",
            tags: diary.tags,
          }}
          submitLabel={t("edit.saveButton")}
          onSubmit={handleSubmit}
        />
      </div>
    </AppLayout>
  );
}
