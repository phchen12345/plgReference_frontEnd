import { requestJson } from "@/lib/api/client";
import type { ScheduleGame } from "../types/schedules";

type GetScheduleParams = {
  leagueCode: string;
  season: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getSchedule({
  leagueCode,
  season,
}: GetScheduleParams): Promise<ScheduleGame[]> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const searchParams = new URLSearchParams({
    leagueCode,
    season,
  });

  console.log(API_BASE_URL);

  return requestJson<ScheduleGame[]>(
    `${API_BASE_URL}/api/schedule?${searchParams}`,
    {
      revalidate: 3600,
    },
  );
}
