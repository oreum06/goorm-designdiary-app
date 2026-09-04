import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Icon } from "@/components/common/Icon";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/i18n/translations";

type Translate = (key: TranslationKey, vars?: Record<string, string | number>) => string;

function createDiaryFormSchema(t: Translate) {
  return z
    .object({
      title: z
        .string()
        .min(2, t("form.errors.titleMin"))
        .max(50, t("form.errors.titleMax")),
      startDate: z.string().min(1, t("form.errors.startDateRequired")),
      endDate: z.string().optional().or(z.literal("")),
      note: z.string().max(1000, t("form.errors.noteMax")),
      rating: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
      companions: z.string().max(100, t("form.errors.companionsMax")).optional().or(z.literal("")),
      tags: z.array(z.string()).max(5, t("form.errors.tagsMax")),
    })
    .refine((data) => !data.endDate || data.endDate >= data.startDate, {
      message: t("form.errors.endDateBeforeStart"),
      path: ["endDate"],
    });
}

export type DiaryFormValues = z.infer<ReturnType<typeof createDiaryFormSchema>>;

type DiaryFormProps = {
  defaultValues?: Partial<DiaryFormValues>;
  submitLabel: string;
  onSubmit: (values: DiaryFormValues) => void;
};

// 목적지·사진 선택(위저드 1~2단계)과 분리된, "세부 정보" 입력 폼.
// 작성 위저드 3단계와 수정 화면(DiaryEditPage)이 이 컴포넌트를 함께 사용한다.
export function DiaryForm({ defaultValues, submitLabel, onSubmit }: DiaryFormProps) {
  const { t } = useTranslation();
  const schema = useMemo(() => createDiaryFormSchema(t), [t]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DiaryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: "",
      note: "",
      rating: undefined,
      companions: "",
      tags: [],
      ...defaultValues,
    },
  });

  const tags = watch("tags");
  const rating = watch("rating");
  const [tagInput, setTagInput] = useState("");

  function addTag() {
    const value = tagInput.trim().replace(/^#/, "");
    if (!value || tags.length >= 5 || tags.includes(value)) {
      setTagInput("");
      return;
    }
    setValue("tags", [...tags, value], { shouldValidate: true });
    setTagInput("");
  }

  function removeTag(tag: string) {
    setValue(
      "tags",
      tags.filter((existing) => existing !== tag),
      { shouldValidate: true },
    );
  }

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit(onSubmit)} aria-label={t("form.title")}>
      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md uppercase tracking-widest text-text-muted" htmlFor="startDate">
          {t("form.date")}
        </label>
        <div className="relative flex items-center">
          <Icon name="calendar_today" className="absolute left-0 text-outline" />
          <input
            id="startDate"
            type="date"
            className="w-full rounded-none border-b-2 border-border bg-transparent py-2 pl-8 font-body-lg text-body-lg text-on-background transition-colors focus:border-tertiary focus:outline-none"
            {...register("startDate")}
          />
        </div>
        {errors.startDate ? (
          <p className="font-caption text-caption text-error">{errors.startDate.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md uppercase tracking-widest text-text-muted" htmlFor="endDate">
          {t("form.endDateOptional")}
        </label>
        <input
          id="endDate"
          type="date"
          className="w-full rounded-none border-b-2 border-border bg-transparent py-2 font-body-lg text-body-lg text-on-background transition-colors focus:border-tertiary focus:outline-none"
          {...register("endDate")}
        />
        {errors.endDate ? (
          <p className="font-caption text-caption text-error">{errors.endDate.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md uppercase tracking-widest text-text-muted" htmlFor="title">
          {t("form.title")}
        </label>
        <input
          id="title"
          type="text"
          placeholder={t("form.titlePlaceholder")}
          className="w-full rounded-none border-b-2 border-border bg-transparent py-2 font-headline-sm text-headline-sm text-on-background transition-colors placeholder:text-outline-variant focus:border-tertiary focus:outline-none"
          {...register("title")}
        />
        {errors.title ? (
          <p className="font-caption text-caption text-error">{errors.title.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md uppercase tracking-widest text-text-muted" htmlFor="note">
          {t("form.note")}
        </label>
        <textarea
          id="note"
          rows={4}
          placeholder={t("form.notePlaceholder")}
          className="w-full resize-none rounded-none border-b-2 border-border bg-transparent py-2 font-body-md text-body-md text-on-background transition-colors placeholder:text-outline-variant focus:border-tertiary focus:outline-none"
          {...register("note")}
        />
        {errors.note ? (
          <p className="font-caption text-caption text-error">{errors.note.message}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md uppercase tracking-widest text-text-muted" htmlFor="companions">
          {t("form.companionsOptional")}
        </label>
        <input
          id="companions"
          type="text"
          placeholder={t("form.companionsPlaceholder")}
          className="w-full rounded-none border-b-2 border-border bg-transparent py-2 font-body-md text-body-md text-on-background transition-colors placeholder:text-outline-variant focus:border-tertiary focus:outline-none"
          {...register("companions")}
        />
      </div>

      <div className="flex flex-col gap-3">
        <span className="font-label-md text-label-md uppercase tracking-widest text-text-muted">
          {t("form.rating")}
        </span>
        <div className="flex items-center gap-2" role="radiogroup" aria-label={t("form.ratingAria")}>
          {([1, 2, 3, 4, 5] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={t("form.ratingValueAria", { value })}
              className="flex h-10 w-10 items-center justify-center text-outline transition-colors hover:text-primary"
              onClick={() => setValue("rating", rating === value ? undefined : value, { shouldValidate: true })}
            >
              <Icon name="star" filled={typeof rating === "number" && value <= rating} className="text-[32px] text-primary" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-label-md text-label-md uppercase tracking-widest text-text-muted" htmlFor="tagInput">
          {t("form.tagsMax5")}
        </label>
        <div className="relative flex items-center">
          <Icon name="label" className="absolute left-0 text-outline" />
          <input
            id="tagInput"
            type="text"
            value={tagInput}
            placeholder={t("form.tagsPlaceholder")}
            className="w-full rounded-none border-b-2 border-border bg-transparent py-2 pl-8 font-body-md text-body-md text-on-background transition-colors placeholder:text-outline-variant focus:border-tertiary focus:outline-none"
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addTag();
              }
            }}
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 rounded-full bg-surface-container px-3 py-1 font-caption text-caption text-on-surface-variant"
            >
              #{tag}
              <button
                type="button"
                aria-label={t("form.removeTagAria", { tag })}
                className="hover:text-error"
                onClick={() => removeTag(tag)}
              >
                <Icon name="close" className="text-[14px]" />
              </button>
            </span>
          ))}
        </div>
        {errors.tags ? (
          <p className="font-caption text-caption text-error">{errors.tags.message}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-label-md text-label-md uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(171,53,0,0.25)] transition-all hover:bg-primary-container hover:text-on-primary-container disabled:opacity-60"
      >
        <span>{submitLabel}</span>
        <Icon name="arrow_forward" />
      </button>
    </form>
  );
}
