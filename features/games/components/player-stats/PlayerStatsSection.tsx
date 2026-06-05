"use client";

import { Grid, Stack, Tabs, Text } from "@chakra-ui/react";
import { useMemo } from "react";
import { useState } from "react";
import type { GameBoxscore } from "../../types/games";
import {
  getInferredOvertimePeriod,
  getTeamStatViews,
  type StatView,
} from "../team-stats/teamStats.utils";
import { PlayerStatsTable } from "./PlayerStatsTable";
import {
  advancedPlayerColumns,
  basicPlayerColumns,
} from "./playerStats.columns";

export function PlayerStatsSection({
  teams,
}: {
  teams: GameBoxscore["teams"];
}) {
  const [view, setView] = useState<StatView>("total");
  const statViews = useMemo(() => getTeamStatViews(teams), [teams]);
  const inferredOvertimePeriod = useMemo(
    () => getInferredOvertimePeriod(teams),
    [teams],
  );

  return (
    <Stack gap={3} mt={4}>
      <Tabs.Root
        value={view}
        onValueChange={(details) => setView(details.value as StatView)}
      >
        <Tabs.List>
          {statViews.map((item) => (
            <Tabs.Trigger key={item.value} value={item.value}>
              {item.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
      </Tabs.Root>

      <Grid
        alignItems="start"
        gap={4}
        templateColumns={{ base: "1fr", xl: "repeat(2, minmax(0, 1fr))" }}
      >
        <Stack gap={2} minW={0}>
          <Text fontSize="sm" fontWeight="semibold">
            客隊：{teams.away.team.name}
          </Text>
          <PlayerStatsTable
            title="基本數據"
            team={teams.away.team}
            players={teams.away.players}
            view={view}
            inferredOvertimePeriod={inferredOvertimePeriod}
            columns={basicPlayerColumns}
          />
          <PlayerStatsTable
            title="進階數據"
            team={teams.away.team}
            players={teams.away.players}
            view={view}
            inferredOvertimePeriod={inferredOvertimePeriod}
            columns={advancedPlayerColumns}
          />
        </Stack>

        <Stack gap={2} minW={0}>
          <Text fontSize="sm" fontWeight="semibold">
            主隊：{teams.home.team.name}
          </Text>
          <PlayerStatsTable
            title="基本數據"
            team={teams.home.team}
            players={teams.home.players}
            view={view}
            inferredOvertimePeriod={inferredOvertimePeriod}
            columns={basicPlayerColumns}
          />
          <PlayerStatsTable
            title="進階數據"
            team={teams.home.team}
            players={teams.home.players}
            view={view}
            inferredOvertimePeriod={inferredOvertimePeriod}
            columns={advancedPlayerColumns}
          />
        </Stack>
      </Grid>
    </Stack>
  );
}
