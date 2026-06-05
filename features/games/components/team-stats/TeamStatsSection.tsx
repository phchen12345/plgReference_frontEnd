"use client";

import { Box, Stack, Tabs } from "@chakra-ui/react";
import { useMemo } from "react";
import { useState } from "react";
import type { GameBoxscore } from "../../types/games";
import { TeamStatsTable } from "./TeamStatsTable";
import { advancedStatRows, basicStatRows } from "./teamStats.config";
import { getStatViews, type StatView } from "./teamStats.utils";

export function TeamStatsSection({ teams }: { teams: GameBoxscore["teams"] }) {
  const [view, setView] = useState<StatView>("total");
  const statViews = useMemo(() => getStatViews(teams), [teams]);

  return (
    <Stack gap={4}>
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
      <Stack
        align="stretch"
        direction={{ base: "column", xl: "row" }}
        gap={4}
        mt={4}
        w="full"
      >
        <Box display="flex" flex="1">
          <TeamStatsTable
            title="基本數據"
            teams={teams}
            view={view}
            rows={basicStatRows}
          />
        </Box>
        <Box display="flex" flex="1">
          <TeamStatsTable
            title="進階數據"
            teams={teams}
            view={view}
            rows={advancedStatRows}
          />
        </Box>
      </Stack>
    </Stack>
  );
}
