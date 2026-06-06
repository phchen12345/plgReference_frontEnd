"use client";

import { Box, HStack, Table, Text, type TextProps } from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import Image from "next/image";
import { useMemo, useState } from "react";
import type { GameBoxscore } from "../../types/games";
import { getTeamColor } from "../../utils/teamColors";
import {
  buildPlayerStatsRows,
  parseMinutesToSeconds,
  type PlayerStatsRow,
} from "./playerStats.utils";
import type { StatView } from "../team-stats/teamStats.utils";

type PlayerStatsTableProps = {
  title: string;
  team: GameBoxscore["teams"]["away"]["team"];
  players: GameBoxscore["teams"]["away"]["players"];
  view: StatView;
  columns: ColumnDef<PlayerStatsRow>[];
};

function getSortMark(sortDirection: false | "asc" | "desc") {
  if (sortDirection === "asc") return " ↑";
  if (sortDirection === "desc") return " ↓";
  return "";
}

function getCellTextAlign(columnId: string): TextProps["textAlign"] {
  if (columnId === "player") return "left";
  if (columnId === "position") return "center";
  return "center";
}

function getColumnMinWidth(columnId: string) {
  if (columnId === "player") return "110px";
  return undefined;
}

export function PlayerStatsTable({
  title,
  team,
  players,
  view,
  columns,
}: PlayerStatsTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const teamColor = getTeamColor(team);

  const data = useMemo(
    () => buildPlayerStatsRows(players, view),
    [players, view],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

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
        px={3}
        py={2}
        _dark={{ borderColor: "gray.700" }}
      >
        <HStack gap={1.5}>
          <Box boxSize="8px" bg={teamColor.solid} borderRadius="full" />
          <Image
            src={team.logoUrl}
            alt={team.shortName}
            width={18}
            height={18}
            style={{
              width: "18px",
              height: "18px",
              objectFit: "contain",
            }}
          />
          <Text fontSize="sm" fontWeight="semibold">
            {title}
          </Text>
        </HStack>
        <Text
          color="gray.500"
          fontSize="xs"
          _dark={{
            color: "gray.400",
          }}
        >
          {players.length} 人
        </Text>
      </HStack>

      <Table.ScrollArea>
        <Table.Root
          size="sm"
          tableLayout="auto"
          variant="line"
          w="full"
          css={{
            "& th:last-of-type, & td:last-of-type": {
              paddingLeft: "6px",
            },
            "& th:first-of-type, & td:first-of-type": {
              paddingLeft: "6px",
            },
          }}
        >
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sortDirection = header.column.getIsSorted();

                  return (
                    <Table.ColumnHeader
                      key={header.id}
                      color="gray.600"
                      cursor={canSort ? "pointer" : undefined}
                      fontSize="xs"
                      maxW={getColumnMinWidth(header.column.id)}
                      minW={getColumnMinWidth(header.column.id)}
                      onClick={header.column.getToggleSortingHandler()}
                      px={0.5}
                      py={1}
                      textAlign={getCellTextAlign(header.column.id)}
                      userSelect="none"
                      whiteSpace="nowrap"
                      _dark={{
                        color: "gray.300",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {getSortMark(sortDirection)}
                    </Table.ColumnHeader>
                  );
                })}
              </Table.Row>
            ))}
          </Table.Header>

          <Table.Body
            css={{
              "& tr:last-of-type td": {
                borderBottomWidth: 0,
              },
            }}
          >
            {table.getRowModel().rows.map((row) => {
              const cells = row.getVisibleCells();
              const firstCell = cells[0];
              const didNotPlay =
                parseMinutesToSeconds(row.original.stats?.minutes) === 0;

              return (
                <Table.Row key={row.id}>
                  {didNotPlay ? (
                    <>
                      <Table.Cell
                        fontSize="xs"
                        maxW={getColumnMinWidth(firstCell.column.id)}
                        minW={getColumnMinWidth(firstCell.column.id)}
                        overflow="hidden"
                        px={0.5}
                        py={1}
                        textOverflow="ellipsis"
                        textAlign={getCellTextAlign(firstCell.column.id)}
                        whiteSpace="nowrap"
                        w={getColumnMinWidth(firstCell.column.id)}
                      >
                        {flexRender(
                          firstCell.column.columnDef.cell,
                          firstCell.getContext(),
                        )}
                      </Table.Cell>

                      <Table.Cell
                        colSpan={cells.length - 1}
                        color="gray.500"
                        fontSize="xs"
                        fontStyle="italic"
                        px={2}
                        py={1}
                        textAlign="center"
                        _dark={{ color: "gray.500" }}
                      >
                        Did not play
                      </Table.Cell>
                    </>
                  ) : (
                    cells.map((cell) => (
                      <Table.Cell
                        key={cell.id}
                        fontSize="xs"
                        maxW={getColumnMinWidth(cell.column.id)}
                        minW={getColumnMinWidth(cell.column.id)}
                        overflow="hidden"
                        px={0.5}
                        py={1}
                        textOverflow="ellipsis"
                        textAlign={getCellTextAlign(cell.column.id)}
                        whiteSpace="nowrap"
                        w={getColumnMinWidth(cell.column.id)}
                        _dark={{ color: "gray.100" }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Table.Cell>
                    ))
                  )}
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </Box>
  );
}
