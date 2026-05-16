import { Box, HStack, Table, Text } from "@chakra-ui/react";
import type { GameBoxscore } from "@/features/games/types/games";
import Image from "next/image";

type LineScoreProps = {
  teams: GameBoxscore["teams"];
};

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
            <Table.ColumnHeader textAlign="center">Q1</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Q2</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Q3</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Q4</Table.ColumnHeader>
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
                    objectFit="contain"
                  />
                  <Text fontWeight="semibold" truncate>
                    {row.team}
                  </Text>
                </HStack>
              </Table.Cell>

              {[1, 2, 3, 4].map((period) => {
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
