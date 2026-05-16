import { notFound } from "next/navigation";
import { Box, HStack, Stack, Text } from "@chakra-ui/react";

import { getGameBoxscore } from "@/features/games/api/gamesApi";
import { ScoreBoard } from "@/features/games/components/ScoreBoard";
import Link from "next/link";
import { LineScore } from "@/features/games/components/LineScore";
import { PointsDistributed } from "@/features/games/components/PointsDistributed";
import { TeamStatsSection } from "@/features/games/components/team-stats/TeamStatsSection";

import { DonutChartSection } from "@/features/games/components/donutChart/DonutChartSection";
import { PlayerStatsSection } from "@/features/games/components/player-stats/PlayerStatsSection";

type PageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GameStatsPage({ params }: PageProps) {
  const { gameId } = await params;

  let boxscore;

  try {
    boxscore = await getGameBoxscore(gameId);
  } catch {
    notFound();
  }

  const { game, teams } = boxscore;

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      px={{ base: 4, md: 4 }}
      py={2}
      _dark={{ bg: "gray.950", color: "gray.100" }}
    >
      <Box
        position="sticky"
        top="88px"
        zIndex="sticky"
        w="full"
        bg="gray.50"
        py={2}
        _dark={{ bg: "gray.950" }}
      >
        <Link href="/">
          <Text color="gray.500" _dark={{ color: "gray.400" }}>
            返回賽程列表
          </Text>
        </Link>
      </Box>
      <ScoreBoard game={game} teams={teams} />
      <HStack align="stretch" gap={4} mt={4} w="full">
        <Box display="flex" flex="1" minW={0}>
          <LineScore teams={teams} />
        </Box>
        <Box display="flex" flex="1" minW={0}>
          <PointsDistributed teams={teams} />
        </Box>
      </HStack>
      <TeamStatsSection teams={teams} />
      <DonutChartSection teams={teams} />
      <PlayerStatsSection teams={teams} />

      <Stack maxW="1120px" mx="auto" gap={6}></Stack>
    </Box>
  );
}
