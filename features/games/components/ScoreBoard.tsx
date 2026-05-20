import { Grid, HStack, Box, Stack, Text } from "@chakra-ui/react";
import type { GameBoxscore } from "../types/games";
import Image from "next/image";

type ScoreBoardProps = {
  game: GameBoxscore["game"];
  teams: GameBoxscore["teams"];
};

export function ScoreBoard({ game }: ScoreBoardProps) {
  const firstThreeReferees = [...game.referees]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 3);

  const awayScore = game.awayScore;
  const homeScore = game.homeScore;

  const awayIsLosing =
    awayScore != null && homeScore != null && awayScore < homeScore;

  const homeIsLosing =
    awayScore != null && homeScore != null && homeScore < awayScore;

  return (
    <Box
      bg="white"
      borderBottom="1px solid"
      borderColor="gray.200"
      py={8}
      _dark={{ bg: "gray.900", borderColor: "gray.700", color: "gray.100" }}
    >
      <Stack align="center" gap={3}>
        <Grid
          templateColumns="minmax(0, 1fr) auto auto minmax(0, 1fr)"
          alignItems="center"
          gap={4}
          width="full"
          //   maxW="760px"
        >
          <HStack justify="end" minW={0} gap={3}>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              truncate
              color={awayIsLosing ? "gray.400" : "inherit"}
            >
              {game.awayTeam.name}
            </Text>
            <Image
              width={56}
              height={56}
              src={game.awayTeam.logoUrl}
              alt={game.awayTeam.name}
            />
          </HStack>

          <Text
            fontSize="3xl"
            fontWeight="bold"
            color={awayIsLosing ? "gray.400" : "inherit"}
          >
            {awayScore ?? "-"}
          </Text>

          <Text
            fontSize="3xl"
            fontWeight="bold"
            color={homeIsLosing ? "gray.400" : "inherit"}
          >
            {homeScore ?? "-"}
          </Text>

          <HStack justify="start" minW={0} gap={3}>
            <Image
              width={56}
              height={56}
              src={game.homeTeam.logoUrl}
              alt={game.homeTeam.name}
            />
            <Text
              fontSize="2xl"
              fontWeight="bold"
              truncate
              color={homeIsLosing ? "gray.400" : "inherit"}
            >
              {game.homeTeam.name}
            </Text>
          </HStack>
        </Grid>

        <Stack
          align="center"
          gap={1}
          fontSize="sm"
          color="gray.600"
          _dark={{ color: "gray.400" }}
        >
          <Text>
            {game.gameDate} {game.gameTime?.slice(0, 5)} · {game.venue}
          </Text>

          <Text>
            {firstThreeReferees
              .map((referee) => `${referee.title} ${referee.name}`)
              .join(" · ")}
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
