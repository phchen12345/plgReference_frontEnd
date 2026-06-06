import { Box, HStack, Table, Text } from "@chakra-ui/react";
import type { GameBoxscore } from "@/features/games/types/games";
import Image from "next/image";
import { formatPeriodLabel } from "./team-stats/teamStats.utils";

type LineScoreProps = {
  teams: GameBoxscore["teams"];
};

type LineScoreRow = {
  team: string;
  logoUrl: string;
  periods: GameBoxscore["teams"]["away"]["periods"];
  total: number | null | undefined;
};

function getLineScorePeriods(rows: LineScoreRow[]) {
  return Array.from(
    new Set(rows.flatMap((row) => row.periods.map((item) => item.period))),
  ).sort((first, second) => first - second);
}

export function LineScore({ teams }: LineScoreProps) {
  const rows = [
    {
      team: teams.away.team.shortName,
      logoUrl: teams.away.team.logoUrl,
      periods: teams.away.periods,
      total: teams.away.stats?.points,
    },
    {
      team: teams.home.team.shortName,
      logoUrl: teams.home.team.logoUrl,
      periods: teams.home.periods,
      total: teams.home.stats?.points,
    },
  ];
  const periods = getLineScorePeriods(rows);

  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      h="full"
      width="full"
      overflow="hidden"
      _dark={{ bg: "gray.900", borderColor: "gray.700", color: "gray.100" }}
    >
      <Table.Root size="lg" variant="line">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>球隊</Table.ColumnHeader>
            {periods.map((period) => (
              <Table.ColumnHeader key={period} textAlign="center">
                {formatPeriodLabel(period)}
              </Table.ColumnHeader>
            ))}
            <Table.ColumnHeader textAlign="right">總分</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>

        <Table.Body
          css={{
            "& tr:last-of-type td": {
              borderBottomWidth: 0,
            },
          }}
        >
          {rows.map((row) => (
            <Table.Row key={row.team}>
              <Table.Cell>
                <HStack gap={2} minW={0}>
                  <Image
                    src={row.logoUrl}
                    alt={row.team}
                    width={24}
                    height={24}
                    style={{
                      width: "24px",
                      height: "24px",
                      objectFit: "contain",
                    }}
                  />
                  <Text fontWeight="semibold" truncate>
                    {row.team}
                  </Text>
                </HStack>
              </Table.Cell>

              {periods.map((period) => {
                const periodStats = row.periods.find(
                  (item) => item.period === period,
                );

                return (
                  <Table.Cell key={period} textAlign="center">
                    {periodStats?.stats.points ?? "-"}
                  </Table.Cell>
                );
              })}

              <Table.Cell textAlign="right" fontWeight="bold">
                {row.total ?? "-"}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
