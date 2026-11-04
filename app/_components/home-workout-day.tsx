"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { type ReactNode } from "react";
import { WorkoutDayCard } from "./workout-day-card";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import type { GetHomePageData200TodayWorkoutDay } from "@/app/_lib/api/fetch-generated";

interface HomeWorkoutDayProps {
  workoutDay: GetHomePageData200TodayWorkoutDay;
  workoutPlanId: string;
  sheetContent?: ReactNode;
}

export function HomeWorkoutDay({
  workoutDay,
  workoutPlanId,
  sheetContent,
}: HomeWorkoutDayProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedDayId = searchParams.get("day");

  const handleDayClick = (dayId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("day", dayId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSheetClose = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("day");
      router.push(`${pathname}?${params.toString()}`);
    }
  };

  return (
    <>
      {/* Mobile: Link normal para a página do dia */}
      <Link
        href={`/workout-plans/${workoutPlanId}/days/${workoutDay.id}`}
        className="block lg:hidden"
      >
        <WorkoutDayCard
          name={workoutDay.name}
          weekDay={workoutDay.weekDay}
          estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
          exercisesCount={workoutDay.exercisesCount}
          coverImageUrl={workoutDay.coverImageUrl}
        />
      </Link>

      {/* Desktop: Abre o Sheet via search param */}
      <button
        type="button"
        className="hidden w-full lg:cursor-pointer text-left lg:block"
        onClick={() => handleDayClick(workoutDay.id)}
      >
        <WorkoutDayCard
          name={workoutDay.name}
          weekDay={workoutDay.weekDay}
          estimatedDurationInSeconds={workoutDay.estimatedDurationInSeconds}
          exercisesCount={workoutDay.exercisesCount}
          coverImageUrl={workoutDay.coverImageUrl}
        />
      </button>

      {/* Sheet para Desktop */}
      <Sheet open={!!selectedDayId} onOpenChange={handleSheetClose}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-none lg:w-[43%]">
          <SheetTitle className="sr-only">Detalhes do treino de hoje</SheetTitle>
          {sheetContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
