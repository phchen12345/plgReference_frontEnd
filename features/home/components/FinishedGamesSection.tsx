"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { ScheduleResponse } from "../types/schedules";
import { getClientSchedule } from "../api/clientSchedulesApi";
import GameSection from "./SimpleGird";

const LEAGUE_CODE = "PLG";
const SEASON = "2025-26";
const PAGE_SIZE = 10;

type FinishedGamesSectionProps = {
  initialData: ScheduleResponse;
  selectedTeamId?: number;
};

export function FinishedGamesSection({
  initialData,
  selectedTeamId,
}: FinishedGamesSectionProps) {
  const [page, setPage] = useState(1);

  const { data, isFetching } = useQuery({
    queryKey: ["schedule", "final", selectedTeamId, page],
    queryFn: () =>
      getClientSchedule({
        leagueCode: LEAGUE_CODE,
        season: SEASON,
        status: "final",
        teamId: selectedTeamId,
        page,
        limit: PAGE_SIZE,
        sort: "date",
        order: "desc",
      }),
    initialData:
      selectedTeamId === undefined && page === initialData.pagination.page
        ? initialData
        : undefined,
    placeholderData: (previousData) => previousData,
    staleTime: 60_000,
  });

  const scheduleData = data ?? initialData;

  return (
    <GameSection
      title="已完賽"
      games={scheduleData.items}
      emptyText="目前沒有已完賽賽程"
      pagination={scheduleData.pagination}
      isPaginationLoading={isFetching}
      onPageChange={setPage}
    />
  );
}
