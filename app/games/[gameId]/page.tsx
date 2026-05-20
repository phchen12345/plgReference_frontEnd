import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Box, HStack, Skeleton, Stack, Text } from "@chakra-ui/react";

import { getGameBoxscore } from "@/features/games/api/gamesApi";
import { ScoreBoard } from "@/features/games/components/ScoreBoard";
import Link from "next/link";
import { LineScore } from "@/features/games/components/LineScore";
import { PointsDistributed } from "@/features/games/components/PointsDistributed";
import { TeamStatsSection } from "@/features/games/components/team-stats/TeamStatsSection";

import { DonutChartSection } from "@/features/games/components/donutChart/DonutChartSection";
import { LazyPlayerStatsSection } from "@/features/games/components/player-stats/LazyPlayerStatsSection";
import { getSchedule } from "@/features/home/api/schedulesApi";

export async function generateStaticParams() {
  const games = await getSchedule({
    leagueCode: "PLG",
    season: "2025-26",
  });

  return games
    .filter((game) => game.status === "final")
    .map((game) => ({
      gameId: String(game.id),
    }));
}

type PageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

export default async function GameStatsPage({ params }: PageProps) {
  const { gameId } = await params;

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
      <Suspense fallback={<GameStatsSkeleton />}>
        <GameStatsContent gameId={gameId} />
      </Suspense>
    </Box>
  );
}

async function GameStatsContent({ gameId }: { gameId: string }) {
  let boxscore;

  try {
    boxscore = await getGameBoxscore(gameId);
  } catch {
    notFound();
  }

  const { game, teams } = boxscore;

  return (
    <>
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
      <LazyPlayerStatsSection teams={teams} />

      <Stack maxW="1120px" mx="auto" gap={6}></Stack>
    </>
  );
}

function GameStatsSkeleton() {
  return (
    <Stack gap={4}>
      <Box
        bg="white"
        borderBottom="1px solid"
        borderColor="gray.200"
        py={8}
        _dark={{ bg: "gray.900", borderColor: "gray.700" }}
      >
        <Stack align="center" gap={4}>
          <HStack gap={6}>
            <Skeleton boxSize="56px" borderRadius="full" />
            <Skeleton height="44px" width="160px" />
            <Skeleton boxSize="56px" borderRadius="full" />
          </HStack>

          <Skeleton height="18px" width="320px" maxW="full" />
        </Stack>
      </Box>

      <HStack align="stretch" gap={4} mt={4} w="full">
        <Skeleton height="180px" flex="1" borderRadius="md" />
        <Skeleton height="180px" flex="1" borderRadius="md" />
      </HStack>

      <Skeleton height="280px" borderRadius="md" />

      <HStack gap={4} w="full">
        <Skeleton height="240px" flex="1" borderRadius="md" />
        <Skeleton height="240px" flex="1" borderRadius="md" />
        <Skeleton height="240px" flex="1" borderRadius="md" />
      </HStack>

      <Stack gap={3} mt={4}>
        <Skeleton height="36px" />
        <Skeleton height="260px" />
      </Stack>
    </Stack>
  );
}
