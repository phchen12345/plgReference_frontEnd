import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import type { GameBoxscore } from "../../types/games";
import { getTeamColor } from "../../utils/teamColors";
import { TeamStatsCompareRow } from "./TeamStatsCompareRow";
import type { StatRow } from "./teamStats.config";
import type { StatView } from "./teamStats.utils";
import { getTeamStatsByView } from "./teamStats.utils";

type TeamStatsTableProps = {
  title: string;
  teams: GameBoxscore["teams"];
  view: StatView;
  rows: StatRow[];
};

export function TeamStatsTable({
  title,
  teams,
  view,
  rows,
}: TeamStatsTableProps) {
  const awayStats = getTeamStatsByView(teams.away, view);
  const homeStats = getTeamStatsByView(teams.home, view);
  const awayTeamColor = getTeamColor(teams.away.team);
  const homeTeamColor = getTeamColor(teams.home.team);

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      overflow="hidden"
      w="full"
      _dark={{
        bg: "gray.900",
        borderColor: "gray.700",
        color: "gray.100",
      }}
    >
      <HStack
        borderBottom="1px solid"
        borderColor="gray.200"
        justify="space-between"
        px={4}
        py={3}
        _dark={{ borderColor: "gray.700" }}
      >
        <Text fontWeight="semibold">{title}</Text>

        <HStack gap={4} fontSize="sm" flexWrap="wrap" justify="flex-end">
          <HStack gap={1.5}>
            <Box boxSize="10px" bg={awayTeamColor.solid} borderRadius="full" />
            <Image
              src={teams.away.team.logoUrl}
              alt={teams.away.team.shortName}
              width={18}
              height={18}
            />
            <Text>{teams.away.team.shortName}</Text>
          </HStack>
          <HStack gap={1.5}>
            <Box boxSize="10px" bg={homeTeamColor.solid} borderRadius="full" />
            <Image
              src={teams.home.team.logoUrl}
              alt={teams.home.team.shortName}
              width={18}
              height={18}
            />
            <Text>{teams.home.team.shortName}</Text>
          </HStack>
        </HStack>
      </HStack>

      <Stack
        gap={0}
        px={4}
        css={{
          "& > div:last-of-type": {
            borderBottomWidth: 0,
          },
        }}
      >
        {rows.map((row) => (
          <TeamStatsCompareRow
            key={row.label}
            awayStats={awayStats}
            awayTeamColor={awayTeamColor.solid}
            awayTeamName={teams.away.team.shortName}
            homeStats={homeStats}
            homeTeamColor={homeTeamColor.solid}
            homeTeamName={teams.home.team.shortName}
            row={row}
            view={view}
          />
        ))}
      </Stack>
    </Box>
  );
}
