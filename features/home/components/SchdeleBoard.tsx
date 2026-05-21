"use client";

import { useMemo, useState } from "react";
import { createListCollection, Portal, Select, Stack } from "@chakra-ui/react";
import type { ScheduleGame } from "@/features/home/types/schedules";
import GameSection from "./SimpleGird";
import { useFavoriteTeamsStore } from "@/stores/useFavoriteTeamsStore";

type Props = {
  games: ScheduleGame[];
};

export default function ScheduleBoard({ games }: Props) {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const favoriteTeams = useFavoriteTeamsStore((state) => state.favoriteTeams);
  const favoriteTeamIds = favoriteTeams.map((team) => team.id);

  const teamCollection = useMemo(() => {
    const teamMap = new Map<string, string>();

    for (const game of games) {
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
  }, [games]);

  const filteredGames = useMemo(() => {
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
  }, [games, selectedFilter, favoriteTeamIds]);

  const finishedGames = [...filteredGames]
    .filter((game) => game.status === "final")
    .sort(
      (a, b) =>
        new Date(`${b.gameDate}T${b.gameTime}`).getTime() -
        new Date(`${a.gameDate}T${a.gameTime}`).getTime(),
    );
  const upcomingGames = filteredGames.filter(
    (game) => game.status === "scheduled",
  );

  return (
    <Stack gap={6}>
      <Select.Root
        collection={teamCollection}
        value={[selectedFilter]}
        onValueChange={(details) => {
          setSelectedFilter(details.value[0] ?? "all");
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
      <Stack gap={8} direction="row">
        <GameSection
          title="未開賽"
          games={upcomingGames}
          emptyText="目前沒有未開賽賽程"
        />

        <GameSection
          title="已完賽"
          games={finishedGames}
          emptyText="目前沒有已完賽賽程"
        />
      </Stack>
    </Stack>
  );
}
