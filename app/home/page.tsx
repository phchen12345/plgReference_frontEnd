import { Box, Flex, Stack, Text } from "@chakra-ui/react";

import { getSchedule } from "@/features/home/api/schedulesApi";
import type {
  ScheduleGame,
  ScheduleResponse,
} from "@/features/home/types/schedules";
import ScheduleBoard from "@/features/home/components/SchdeleBoard";
import SelectFavoriteTeams from "@/features/home/components/SelectFavoriteTeams";

const LEAGUE_CODE = "PLG";
const SEASON = "2025-26";

export default async function HomePage() {
  let upcomingGames: ScheduleGame[] = [];
  let finishedGames: ScheduleGame[] = [];
  let initialFinishedData: ScheduleResponse | null = null;
  let errorMessage: string | null = null;

  try {
    const [upcomingData, finishedData] = await Promise.all([
      getSchedule({
        leagueCode: LEAGUE_CODE,
        season: SEASON,
        status: "scheduled",
        page: 1,
        limit: 100,
      }),
      getSchedule({
        leagueCode: LEAGUE_CODE,
        season: SEASON,
        status: "final",
        page: 1,
        limit: 10,
        sort: "date",
        order: "desc",
      }),
    ]);

    upcomingGames = upcomingData.items ?? [];
    finishedGames = finishedData.items ?? [];
    initialFinishedData = finishedData;
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "賽程資料讀取失敗";
  }

  //給SelectFavoriteTeams的資料
  const games = [...upcomingGames, ...finishedGames];
  const allTeams = games.flatMap((game) => [game.homeTeam, game.awayTeam]);

  const uniqueTeams = Array.from(
    new Map(allTeams.map((team) => [team.id, team])).values(),
  );
  //===============================

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      _dark={{ bg: "gray.950", color: "gray.100" }}
    >
      <Box as="main" px={{ base: 4, md: 8 }} py={8} maxW="1120px" mx="auto">
        <Stack gap={6}>
          <Flex
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            direction={{ base: "column", md: "row" }}
            gap={3}
          >
            <Stack gap={1}>
              <Text
                as="h1"
                fontSize={{ base: "2xl", md: "3xl" }}
                fontWeight="bold"
              >
                PLG 賽程
              </Text>
              <Text color="gray.600" _dark={{ color: "gray.400" }}>
                2025-26 球季
              </Text>
            </Stack>

            {/* <Badge colorPalette="gray" size="lg">
              {games.length} 場比賽
            </Badge> */}
          </Flex>
          <SelectFavoriteTeams uniqueTeams={uniqueTeams}></SelectFavoriteTeams>

          {errorMessage ? (
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="md"
              p={5}
              _dark={{ bg: "red.950", borderColor: "red.800" }}
            >
              <Text
                color="red.700"
                fontWeight="semibold"
                _dark={{ color: "red.200" }}
              >
                {errorMessage}
              </Text>
            </Box>
          ) : initialFinishedData ? (
            <ScheduleBoard
              upcomingGames={upcomingGames}
              initialFinishedData={initialFinishedData}
            />
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
