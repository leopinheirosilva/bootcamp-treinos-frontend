import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import {
  getStats,
  getHomePageData,
  getUserTrainData,
} from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import { CircleCheck, CirclePercent, Hourglass } from "lucide-react";
import { BottomNav } from "@/app/_components/bottom-nav";
import { SidebarNav } from "@/app/_components/sidebar-nav";
import { StreakBanner } from "./_components/streak-banner";
import { StatsHeatmap } from "./_components/stats-heatmap";
import { StatCard } from "./_components/stats-card";

function formatTotalTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h${minutes.toString().padStart(2, "0")}m`;
}

export default async function StatsPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const today = dayjs();
  const from = today.subtract(2, "month").startOf("month").format("YYYY-MM-DD");
  const to = today.endOf("month").format("YYYY-MM-DD");

  const [statsResponse, homeData, trainData] = await Promise.all([
    getStats({ from, to }),
    getHomePageData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  if (statsResponse.status !== 200) {
    throw new Error("Failed to fetch stats");
  }

  const {
    workoutStreak,
    consistencyByDay,
    completedWorkoutsCount,
    conclusionRate,
    totalTimeInSeconds,
  } = statsResponse.data;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24 lg:pl-64 lg:pb-8">
      <SidebarNav activePage="stats" />

      <div className="flex h-14 items-center px-5">
        <p
          className="text-[22px] uppercase leading-[1.15] text-foreground"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Fit.ai
        </p>
      </div>
      <div className="w-full lg:mx-auto lg:max-w-2xl">
        <div className="px-5">
          <StreakBanner workoutStreak={workoutStreak} />
        </div>

        <div className="flex flex-col gap-3 p-5">
          <h2 className="font-heading text-lg font-semibold text-foreground">
            Consistência
          </h2>

          <StatsHeatmap consistencyByDay={consistencyByDay} today={today} />

          <div className="lg:flex lg:gap-10 lg:justify-center">
            <div className="grid grid-cols-2 gap-3 lg:gap-10">
              <StatCard
                icon={CircleCheck}
                value={String(completedWorkoutsCount)}
                label="Treinos Feitos"
              />
              <StatCard
                icon={CirclePercent}
                value={`${Math.round(conclusionRate * 100)}%`}
                label="Taxa de conclusão"
              />
            </div>
            <StatCard
              icon={Hourglass}
              value={formatTotalTime(totalTimeInSeconds)}
              label="Tempo Total"
            />
          </div>
        </div>
      </div>

      <BottomNav activePage="stats" />
    </div>
  );
}
