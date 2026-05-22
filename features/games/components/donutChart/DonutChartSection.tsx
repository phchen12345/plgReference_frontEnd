"use client";

import dynamic from "next/dynamic";
import { Box, SimpleGrid } from "@chakra-ui/react";
import type { GameBoxscore } from "@/features/games/types/games";

const DonutChart = dynamic(
  () =>
    import("@/features/games/components/donutChart/DonutChart").then(
      (mod) => mod.DonutChart,
    ),
  {
    ssr: false,
    loading: () => (
      <Box
        bg="gray.100"
        borderRadius="md"
        h="240px"
        flex="1"
        _dark={{ bg: "gray.800" }}
      />
    ),
  },
);

export function DonutChartSection({ teams }: { teams: GameBoxscore["teams"] }) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 3 }}
      gap={4}
      w="full"
      my={4}
      py={4}
      bg="white"
      _dark={{ bg: "gray.900", color: "gray.100" }}
    >
      <DonutChart title="禁區得分" teams={teams} statKey="pointsInPaint" />
      <DonutChart
        title="快攻得分"
        teams={teams}
        statKey="pointsFromFastbreak"
      />
      <DonutChart
        title="二次得分"
        teams={teams}
        statKey="pointsFromSecondChance"
      />
    </SimpleGrid>
  );
}
