import { requestJson } from "@/lib/api/client";
import type { ScheduleGame } from "../types/schedules";

type GetScheduleParams = {
  leagueCode: string;
  season: string;
};

export async function getSchedule({
  leagueCode,
  season,
}: GetScheduleParams): Promise<ScheduleGame[]> {
  const searchParams = new URLSearchParams({
    leagueCode,
    season,
  });

  return requestJson<ScheduleGame[]>(
    `http://localhost:3100/api/schedule?${searchParams}`,
    {
      revalidate: 3600,
    },
  );
}
