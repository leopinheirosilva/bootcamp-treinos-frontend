import { redirect } from "next/navigation";
import { authClient } from "@/app/_lib/auth-client";
import { headers } from "next/headers";
import {
  getWorkoutPlan,
  getHomePageData,
  getUserTrainData,
} from "@/app/_lib/api/fetch-generated";
import dayjs from "dayjs";
import Image from "next/image";
import { Goal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/app/_components/bottom-nav";
import { SidebarNav } from "@/app/_components/sidebar-nav";
import { WorkoutDayList } from "./_components/workout-day-list";
import { WorkoutDayPanel } from "./_components/workout-day-panel";
import { Suspense } from "react";

const WEEKDAY_ORDER = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default async function WorkoutPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ day?: string }>;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data?.user) redirect("/auth");

  const { id } = await params;
  const { day: selectedDayId } = await searchParams;

  const [workoutPlanData, homeData, trainData] = await Promise.all([
    getWorkoutPlan(id),
    getHomePageData(dayjs().format("YYYY-MM-DD")),
    getUserTrainData(),
  ]);

  const needsOnboarding =
    (homeData.status === 200 && !homeData.data.activeWorkoutPlanId) ||
    (trainData.status === 200 && !trainData.data);
  if (needsOnboarding) redirect("/onboarding");

  if (workoutPlanData.status !== 200) redirect("/");

  const { name, workoutDays } = workoutPlanData.data;

  const sortedDays = [...workoutDays].sort(
    (a, b) =>
      WEEKDAY_ORDER.indexOf(a.weekDay) - WEEKDAY_ORDER.indexOf(b.weekDay),
  );

  // Server component renderizado aqui e passado como prop (composição)
  const sheetContent = selectedDayId ? (
    <Suspense
      fallback={
        <div className="flex h-full items-center justify-center p-10">
          <p className="font-heading text-sm text-muted-foreground">
            Carregando treino...
          </p>
        </div>
      }
    >
      <WorkoutDayPanel workoutPlanId={id} dayId={selectedDayId} />
    </Suspense>
  ) : null;

  return (
    <div className="flex min-h-svh bg-background pb-24 lg:pl-64 lg:pb-8">
      <SidebarNav activePage="calendar" />

      <div className="w-full lg:flex justify-between">
        <div className="lg:w-[52%] pl-10">
          <div className="relative flex h-74 shrink-0 flex-col items-start justify-between overflow-hidden rounded-b-4xl px-5 pb-10 pt-5 lg:mt-5 lg:mx-5 lg:rounded-4xl">
            <div className="absolute inset-0" aria-hidden="true">
              <Image
                src="/workout-plan-banner.png"
                alt=""
                fill
                className="object-cover"
                priority
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(238deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
                }}
              />
            </div>
            <p
              className="relative text-[22px] uppercase leading-[1.15] text-background"
              style={{ fontFamily: "var(--font-anton)" }}
            >
              Fit.ai
            </p>
            <div className="relative flex w-full items-end justify-between">
              <div className="flex flex-col gap-3">
                <Badge className="gap-1 rounded-full px-2.5 py-1.5 font-heading text-xs font-semibold uppercase">
                  <Goal className="size-4" />
                  {name}
                </Badge>
                <h1 className="font-heading text-2xl font-semibold leading-[1.05] text-background">
                  Plano de Treino
                </h1>
              </div>
            </div>
          </div>
          <Suspense>
            <WorkoutDayList
              days={sortedDays}
              workoutPlanId={id}
              sheetContent={sheetContent}
            />
          </Suspense>
        </div>
        <div className="sticky top-0 self-start hidden lg:flex h-svh w-[48%] items-center justify-center bg-primary/8">
          <span className="text-center text-xl text-muted-foreground">
            selecione um dia
          </span>
        </div>
      </div>

      <BottomNav activePage="calendar" />
    </div>
  );
}
