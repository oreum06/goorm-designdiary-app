import type { ReactNode } from "react";
import { Icon } from "@/components/common/Icon";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon = "photo_camera", title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-margin-mobile py-stack-lg text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <Icon name={icon} className="text-[28px] text-on-surface-variant" />
      </div>
      <h3 className="font-headline-sm text-headline-sm text-on-background">{title}</h3>
      {description ? (
        <p className="font-body-md text-body-md max-w-xs text-text-muted">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
