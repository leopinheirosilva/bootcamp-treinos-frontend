import { headers } from "next/headers";
import { authClient } from "./_lib/auth-client";
import { redirect } from "next/navigation";
import { getHomePageData, getUserTrainData } from "./_lib/api/fetch-generated";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import { BottomNav } from "./_components/bottom-nav";
import { SidebarNav } from "./_components/sidebar-nav";
import { ConsistencyTracker } from "./_components/consistency-tracker";
import { Flame } from "lucide-react";
import { HomeWorkoutDay } from "./_components/home-workout-day";
import { WorkoutDayPanel } from "./workout-plans/[id]/_components/workout-day-panel";
import { Suspense } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ day?: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { day: selectedDayId } = await searchParams;

  const today = dayjs();
  const [homeData, trainData] = await Promise.all([
    getHomePageData(today.format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  if (homeData.status !== 200) {
    throw new Error("Failed to fetch home data");
  }

  const needsOnboarding =
    !homeData.data.activeWorkoutPlanId ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  const { todayWorkoutDay, workoutStreak, consistencyByDay } = homeData.data;
  const userName = session.data.user.name?.split(" ")[0] ?? "";

  const sheetContent =
    selectedDayId && homeData.data.activeWorkoutPlanId ? (
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center p-10">
            <p className="font-heading text-sm text-muted-foreground">
              Carregando treino...
            </p>
          </div>
        }
      >
        <WorkoutDayPanel
          workoutPlanId={homeData.data.activeWorkoutPlanId}
          dayId={selectedDayId}
        />
      </Suspense>
    ) : null;

  return (
    <div className="flex min-h-svh flex-col bg-background pb-24 lg:pl-64 lg:pb-0">
      <SidebarNav activePage="home" />

      <div className="w-full lg:mx-auto lg:flex lg:content-between lg:p-5 lg:gap-7">
        <div className="relative flex h-74 shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-4xl px-5 pb-10 pt-5 lg:mt-5 lg:rounded-4xl lg:h-250 lg:w-[45%]">
          <div className="absolute inset-0" aria-hidden="true">
            <Image
              src="/home-banner.jpg"
              alt=""
              fill
              className="object-cover"
              priority
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(243deg, rgba(0,0,0,0) 34%, rgb(0,0,0) 100%)",
              }}
            />
          </div>

          <div className="relative flex justify-center lg:hidden">
            <Image src="/fit-ai-logo.svg" alt="FIT.AI" width={50} height={38} />
          </div>

          <div className="relative flex w-full items-end justify-between lg:flex-col lg:items-start lg:gap-7">
            <div className="flex flex-col gap-1.5">
              <h1 className="font-heading text-2xl font-semibold leading-[1.05] text-background lg:text-3xl">
                Olá, {userName}
              </h1>
              <p className="font-heading text-sm leading-[1.15] text-background/70">
                Bora treinar hoje?
              </p>
            </div>
            {todayWorkoutDay && (
              <div className="rounded-full bg-primary px-4 py-2">
                <Link
                  href={`/workout-plans/${homeData.data.activeWorkoutPlanId}/days/${todayWorkoutDay.id}`}
                  className="font-heading text-sm font-semibold text-primary-foreground lg:hidden"
                >
                  Bora!
                </Link>
                <Link
                  href={`/?day=${todayWorkoutDay.id}`}
                  className="hidden font-heading text-sm font-semibold text-primary-foreground lg:inline"
                >
                  Bora!
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-[40%] lg:pt-10 space-y-10">
          <div className="flex flex-col gap-3 px-5 pt-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold text-foreground lg:text-xl">
                Consistência
              </h2>
              <Link
                href={"/stats"}
                className="font-heading text-xs text-primary lg:text-sm"
              >
                Ver histórico
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-border p-5">
                <ConsistencyTracker
                  consistencyByDay={consistencyByDay}
                  today={today}
                />
              </div>
              <div className="flex items-center gap-2 self-stretch rounded-xl bg-streak px-5 py-2">
                <Flame className="size-5 text-streak-foreground" />
                <span className="font-heading text-base font-semibold text-foreground">
                  {workoutStreak}
                </span>
              </div>
            </div>
          </div>
          {todayWorkoutDay && homeData.data.activeWorkoutPlanId && (
            <div className="flex flex-col gap-3 p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-lg font-semibold text-foreground lg:text-xl">
                  Treino de Hoje
                </h2>
                <Link
                  href={`/workout-plans/${homeData.data.activeWorkoutPlanId}`}
                  className="font-heading text-xs text-primary lg:text-sm"
                >
                  Ver treinos
                </Link>
              </div>
              <Suspense>
                <HomeWorkoutDay
                  workoutDay={todayWorkoutDay}
                  workoutPlanId={homeData.data.activeWorkoutPlanId}
                  sheetContent={sheetContent}
                />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
