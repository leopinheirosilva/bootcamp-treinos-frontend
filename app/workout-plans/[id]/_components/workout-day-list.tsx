"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import { type ReactNode } from "react";
import { WorkoutDayCard } from "@/app/_components/workout-day-card";
import { RestDayCard } from "./rest-day-card";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import type { GetWorkoutPlan200WorkoutDaysItem } from "@/app/_lib/api/fetch-generated";

interface WorkoutDayListProps {
  days: GetWorkoutPlan200WorkoutDaysItem[];
  workoutPlanId: string;
  sheetContent?: ReactNode;
}

export function WorkoutDayList({
  days,
  workoutPlanId,
  sheetContent,
}: WorkoutDayListProps) {
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
      <div className="flex flex-col gap-3 p-5">
        {days.map((day) =>
          day.isRest ? (
            <RestDayCard key={day.id} weekDay={day.weekDay} />
          ) : (
            <div key={day.id}>
              {/* Mobile: navegação normal para a página do dia */}
              <Link
                href={`/workout-plans/${workoutPlanId}/days/${day.id}`}
                className="block lg:hidden"
              >
                <WorkoutDayCard
                  name={day.name}
                  weekDay={day.weekDay}
                  estimatedDurationInSeconds={day.estimatedDurationInSeconds}
                  exercisesCount={day.exercisesCount}
                  coverImageUrl={day.coverImageUrl}
                />
              </Link>

              {/* Desktop: abre o Sheet via search param */}
              <button
                className="hidden w-full cursor-pointer lg:block"
                onClick={() => handleDayClick(day.id)}
              >
                <WorkoutDayCard
                  name={day.name}
                  weekDay={day.weekDay}
                  estimatedDurationInSeconds={day.estimatedDurationInSeconds}
                  exercisesCount={day.exercisesCount}
                  coverImageUrl={day.coverImageUrl}
                />
              </button>
            </div>
          ),
        )}
      </div>

      {/* Sheet desktop */}
      <Sheet open={!!selectedDayId} onOpenChange={handleSheetClose}>
        <SheetContent className="w-full overflow-y-auto p-0 sm:max-w-none lg:w-[43%]">
          <SheetTitle className="sr-only">Detalhes do treino</SheetTitle>
          {sheetContent}
        </SheetContent>
      </Sheet>
    </>
  );
}
