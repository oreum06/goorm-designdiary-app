import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks/useTranslation";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

// 네이티브 <dialog>를 사용해 포커스 트랩·Esc 닫기·backdrop을 브라우저 기본 동작으로
// 확보한다(별도 포커스 트랩 라이브러리 불필요).
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      className="w-[min(360px,90vw)] rounded-xl border-none bg-surface p-6 text-on-surface shadow-[0_12px_30px_rgba(35,28,20,0.15)] backdrop:bg-on-background/40"
    >
      <h2 className="font-headline-sm text-headline-sm text-on-surface">{title}</h2>
      <p className="font-body-md text-body-md mt-2 text-on-surface-variant">{description}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-4 py-2 font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-container"
        >
          {cancelLabel ?? t("common.cancel")}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className={`rounded-full px-4 py-2 font-label-md text-label-md transition-opacity hover:opacity-90 ${
            destructive ? "bg-error text-on-error" : "bg-primary text-on-primary"
          }`}
        >
          {confirmLabel ?? t("common.delete")}
        </button>
      </div>
    </dialog>
  );
}
