"use client";

import { useMemo, useState } from "react";
import { createListCollection, Portal, Select, Stack } from "@chakra-ui/react";
import type { ScheduleGame } from "@/features/home/types/schedules";
import GameSection from "./SimpleGird";
import { useFavoriteTeamsStore } from "@/stores/useFavoriteTeamsStore";
import type { ScheduleResponse } from "@/features/home/types/schedules";
import { FinishedGamesSection } from "./FinishedGamesSection";

type Props = {
  upcomingGames: ScheduleGame[];
  initialFinishedData: ScheduleResponse;
};

export default function ScheduleBoard({
  upcomingGames,
  initialFinishedData,
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const favoriteTeams = useFavoriteTeamsStore((state) => state.favoriteTeams);
  const favoriteTeamIds = useMemo(
    () => favoriteTeams.map((team) => team.id),
    [favoriteTeams],
  );

  //從未開賽和已完賽資料裡抓出所有主隊、客隊
  const teamCollection = useMemo(() => {
    const teamMap = new Map<string, string>();

    for (const game of [...upcomingGames, ...initialFinishedData.items]) {
      teamMap.set(String(game.homeTeam.id), game.homeTeam.shortName);
      teamMap.set(String(game.awayTeam.id), game.awayTeam.shortName);
    }

    return createListCollection({
      items: [
        { label: "全部球隊", value: "all" },
        { label: "關注球隊", value: "favorites" },
        ...Array.from(teamMap, ([value, label]) => ({
          label,
          value,
        })),
      ],
    });
  }, [upcomingGames, initialFinishedData.items]);

  const filterGames = useMemo(() => {
    return (games: ScheduleGame[]) => {
      if (selectedFilter === "all") {
        return games;
      }

      if (selectedFilter === "favorites") {
        return games.filter(
          (game) =>
            favoriteTeamIds.includes(game.homeTeam.id) ||
            favoriteTeamIds.includes(game.awayTeam.id),
        );
      }

      return games.filter(
        (game) =>
          String(game.homeTeam.id) === selectedFilter ||
          String(game.awayTeam.id) === selectedFilter,
      );
    };
  }, [selectedFilter, favoriteTeamIds]);

  const filteredUpcomingGames = useMemo(
    () => filterGames(upcomingGames),
    [filterGames, upcomingGames],
  );

  const selectedTeamId =
    selectedFilter !== "all" && selectedFilter !== "favorites"
      ? Number(selectedFilter)
      : undefined;

  return (
    <Stack gap={6}>
      <Select.Root
        collection={teamCollection}
        value={[selectedFilter]}
        onValueChange={(details) => {
          const nextFilter = details.value[0] ?? "all";

          setSelectedFilter(nextFilter);
        }}
        size="sm"
        width={{ base: "full", md: "320px" }}
      >
        <Select.HiddenSelect />

        <Select.Label>選擇球隊</Select.Label>

        <Select.Control>
          <Select.Trigger>
            <Select.ValueText placeholder="選擇球隊" />
          </Select.Trigger>

          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content>
              {teamCollection.items.map((team) => (
                <Select.Item item={team} key={team.value}>
                  <Select.ItemText>{team.label}</Select.ItemText>
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
      <Stack gap={8} direction={{ base: "column", xl: "row" }}>
        <GameSection
          title="未開賽"
          games={filteredUpcomingGames}
          emptyText="目前沒有未開賽賽程"
          pagination={null}
        />

        <FinishedGamesSection
          // key={selectedFilter}
          initialData={initialFinishedData}
          selectedTeamId={selectedTeamId}
        />
      </Stack>
    </Stack>
  );
}
