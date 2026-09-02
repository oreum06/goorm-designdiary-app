import type { ReactNode } from "react";
import { BrandHeader, BackHeader } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

type AppLayoutProps = {
  variant: "main" | "focus";
  title: string;
  onBack?: () => void;
  children: ReactNode;
};

// "main"(Home/Explore/Trip Book/Map): 브랜드 헤더 + 콘텐츠 + 하단 탭(모바일)/상단 내비(데스크톱)
// "focus"(위저드/상세/수정): 뒤로가기 헤더 + 콘텐츠만 (목업에도 이 화면들엔 내비게이션 바가 없다)
export function AppLayout({ variant, title, onBack, children }: AppLayoutProps) {
  if (variant === "focus") {
    return (
      <div className="min-h-dvh w-full bg-background">
        <BackHeader title={title} onBack={onBack} />
        <main className="min-h-dvh w-full bg-background pt-16">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh w-full bg-background">
      <BrandHeader title={title} />
      <main className="min-h-dvh w-full bg-background pb-24 pt-20 lg:pb-8">{children}</main>
      <BottomNav />
    </div>
  );
}
