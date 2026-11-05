import Link from "next/link";
import { House, Calendar, ChartNoAxesColumn, UserRound } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ChatOpenButton } from "./chat-open-button";
import { getHomePageData } from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";

interface SidebarNavProps {
  activePage?: "home" | "calendar" | "stats" | "profile";
}

export async function SidebarNav({ activePage = "home" }: SidebarNavProps) {
  const today = dayjs();
  const homeData = await getHomePageData(today.format("YYYY-MM-DD"));
  const calendarHref =
    homeData.status === 200 && homeData.data.activeWorkoutPlanId
      ? `/workout-plans/${homeData.data.activeWorkoutPlanId}`
      : null;

  return (
    <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-border lg:bg-background lg:px-4 lg:py-8 lg:z-40">
      <div className="mb-8 flex items-center px-3">
        <Image src="/fit-ai-logo.svg" alt="FIT.AI" width={50} height={38} />
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-3 font-heading text-sm font-medium transition-colors",
            activePage === "home"
              ? "bg-primary/10 text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <House className="size-5" />
          Início
        </Link>

        {calendarHref ? (
          <Link
            href={calendarHref}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-3 font-heading text-sm font-medium transition-colors",
              activePage === "calendar"
                ? "bg-primary/10 text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Calendar className="size-5" />
            Meus treinos
          </Link>
        ) : (
          <span className="flex cursor-not-allowed items-center gap-3 rounded-xl px-3 py-3 font-heading text-sm font-medium text-muted-foreground opacity-50">
            <Calendar className="size-5" />
            Treinos
          </span>
        )}

        <Link
          href="/stats"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-3 font-heading text-sm font-medium transition-colors",
            activePage === "stats"
              ? "bg-primary/10 text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <ChartNoAxesColumn className="size-5" />
          Estatísticas
        </Link>

        <Link
          href="/profile"
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-3 font-heading text-sm font-medium transition-colors",
            activePage === "profile"
              ? "bg-primary/10 text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          <UserRound className="size-5" />
          Perfil
        </Link>
      </nav>

      <div className="mt-auto px-3">
        <ChatOpenButton />
      </div>
    </aside>
  );
}
