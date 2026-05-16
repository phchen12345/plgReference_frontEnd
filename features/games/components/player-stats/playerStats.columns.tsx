import { HStack, Portal, Stack, Text, Tooltip } from "@chakra-ui/react";
import type { ColumnDef } from "@tanstack/react-table";
import type { PlayerBoxscoreStats } from "../../types/games";
import {
  formatDecimalPercentage,
  formatNumber,
  formatPercentNumber,
  formatPlusMinus,
  formatMinutes,
  formatRate,
  getFieldGoalAttempted,
  getFieldGoalMade,
  parseMinutesToSeconds,
  type PlayerStatsRow,
} from "./playerStats.utils";

type NumberStatKey = {
  [Key in keyof PlayerBoxscoreStats]: PlayerBoxscoreStats[Key] extends
    | number
    | null
    ? Key
    : never;
}[keyof PlayerBoxscoreStats];

type ColumnHeaderLabelProps = {
  label: string;
  description: string;
};

function ColumnHeaderLabel({ label, description }: ColumnHeaderLabelProps) {
  return (
    <Tooltip.Root
      closeDelay={80}
      openDelay={250}
      positioning={{ placement: "top", gutter: 6 }}
    >
      <Tooltip.Trigger asChild>
        <Text
          as="span"
          cursor="pointer"
          display="inline-block"
        >
          {label}
        </Text>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content
            fontSize="xs"
            lineHeight="1.5"
            maxW="240px"
            _dark={{ bg: "gray.800", color: "gray.100" }}
          >
            {description}
          </Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
}

function columnHeader(label: string, description: string) {
  function HeaderRenderer() {
    return <ColumnHeaderLabel label={label} description={description} />;
  }

  return HeaderRenderer;
}

function numberColumn(
  id: string,
  label: string,
  getValue: (row: PlayerStatsRow) => number | null | undefined,
  description: string,
  fractionDigits = 0,
): ColumnDef<PlayerStatsRow> {
  return {
    id,
    header: columnHeader(label, description),
    accessorFn: getValue,
    cell: ({ row }) => formatNumber(getValue(row.original), fractionDigits),
    sortUndefined: "last",
  };
}

function statColumn(
  key: NumberStatKey,
  label: string,
  description: string,
  fractionDigits = 0,
): ColumnDef<PlayerStatsRow> {
  return numberColumn(
    key,
    label,
    (row) => row.stats?.[key] ?? null,
    description,
    fractionDigits,
  );
}
function percentNumberColumn(
  key: NumberStatKey,
  label: string,
  description: string,
  fractionDigits = 1,
): ColumnDef<PlayerStatsRow> {
  return {
    id: key,
    header: columnHeader(label, description),
    accessorFn: (row) => row.stats?.[key] ?? null,
    cell: ({ row }) =>
      formatPercentNumber(row.original.stats?.[key], fractionDigits),
    sortUndefined: "last",
  };
}

function minutesColumn(): ColumnDef<PlayerStatsRow> {
  return {
    id: "minutes",
    header: columnHeader("MP", "上場時間"),
    accessorFn: (row) => parseMinutesToSeconds(row.stats?.minutes),
    cell: ({ row }) => formatMinutes(row.original.stats?.minutes),
    sortUndefined: "last",
  };
}

function decimalPercentageColumn(
  key: NumberStatKey,
  label: string,
  description: string,
): ColumnDef<PlayerStatsRow> {
  return {
    id: key,
    header: columnHeader(label, description),
    accessorFn: (row) => row.stats?.[key] ?? null,
    cell: ({ row }) => formatDecimalPercentage(row.original.stats?.[key]),
    sortUndefined: "last",
  };
}

function rateColumn(
  key: NumberStatKey,
  label: string,
  description: string,
): ColumnDef<PlayerStatsRow> {
  return {
    id: key,
    header: columnHeader(label, description),
    accessorFn: (row) => row.stats?.[key] ?? null,
    cell: ({ row }) => formatRate(row.original.stats?.[key]),
    sortUndefined: "last",
  };
}

const playerColumn: ColumnDef<PlayerStatsRow> = {
  id: "player",
  header: columnHeader("球員", "球員背號、姓名與先發標記"),
  accessorFn: (row) => row.name,
  cell: ({ row }) => (
    <HStack gap={0.5} minW={0} w="full">
      <Text
        color="gray.500"
        flexShrink={0}
        fontSize="xs"
        minW="16px"
        _dark={{ color: "gray.400" }}
      >
        {row.original.jerseyNumber ? `#${row.original.jerseyNumber}` : "-"}
      </Text>
      <Stack flex="1" gap={0} minW={0}>
        <HStack gap={0.5}>
          <Text fontSize="sm" fontWeight="semibold" truncate>
            {row.original.name}
          </Text>
          {row.original.starter ? (
            <Text
              color="green.600"
              flexShrink={0}
              fontSize="2xs"
              fontWeight="medium"
            >
              先發
            </Text>
          ) : null}
        </HStack>
        {row.original.englishName ? (
          <Text color="gray.500" fontSize="xs" truncate _dark={{ color: "gray.400" }}>
            {row.original.englishName}
          </Text>
        ) : null}
      </Stack>
    </HStack>
  ),
};

export const basicPlayerColumns = [
  playerColumn,
  minutesColumn(),
  numberColumn(
    "fieldGoalsMade",
    "FG",
    (row) => getFieldGoalMade(row.stats),
    "投籃命中數。計算：二分命中數 + 三分命中數",
  ),
  numberColumn(
    "fieldGoalsAttempted",
    "FGA",
    (row) => getFieldGoalAttempted(row.stats),
    "投籃出手數。計算：二分出手數 + 三分出手數",
  ),
  statColumn("threePointsMade", "3P", "三分命中數"),
  statColumn("threePointsAttempted", "3PA", "三分出手數"),
  decimalPercentageColumn(
    "threePointsPercentage",
    "3P%",
    "三分命中率。計算：三分命中數 / 三分出手數",
  ),
  statColumn("freeThrowsMade", "FT", "罰球命中數"),
  statColumn("freeThrowsAttempted", "FTA", "罰球出手數"),
  decimalPercentageColumn(
    "freeThrowsPercentage",
    "FT%",
    "罰球命中率。計算：罰球命中數 / 罰球出手數",
  ),
  statColumn("offensiveRebounds", "ORB", "進攻籃板"),
  statColumn("defensiveRebounds", "DRB", "防守籃板"),
  statColumn("rebounds", "TRB", "總籃板"),
  statColumn("assists", "AST", "助攻"),
  statColumn("steals", "STL", "抄截"),
  statColumn("blocks", "BLK", "阻攻"),
  statColumn("turnovers", "TOV", "失誤"),
  statColumn("personalFouls", "PF", "個人犯規"),
  statColumn("points", "PTS", "得分"),
  statColumn(
    "gameScore",
    "GmSc",
    "Game Score，單場綜合表現值。計算：得分 + 0.4×投籃命中數 - 0.7×投籃出手數 - 0.4×未進罰球 + 0.7×進攻籃板 + 0.3×防守籃板 + 抄截 + 0.7×助攻 + 0.7×阻攻 - 0.4×犯規 - 失誤",
    1,
  ),
  {
    id: "plusMinus",
    header: columnHeader("+/-", "球員在場期間球隊淨勝分"),
    accessorFn: (row) => row.stats?.plusMinus ?? null,
    cell: ({ row }) => formatPlusMinus(row.original.stats?.plusMinus),
    sortUndefined: "last",
  },
] satisfies ColumnDef<PlayerStatsRow>[];

export const advancedPlayerColumns = [
  playerColumn,
  minutesColumn(),
  decimalPercentageColumn(
    "trueShootingPercentage",
    "TS%",
    "真實命中率。計算：得分 / [2 × (投籃出手數 + 0.44 × 罰球出手數)]",
  ),
  decimalPercentageColumn(
    "effectiveFieldGoalPercentage",
    "eFG%",
    "有效命中率。計算：(投籃命中數 + 0.5 × 三分命中數) / 投籃出手數",
  ),
  rateColumn(
    "threePointAttemptRate",
    "3PAr",
    "三分出手率。計算：三分出手數 / 投籃出手數",
  ),
  rateColumn(
    "freeThrowRate",
    "FTr",
    "罰球率。計算：罰球出手數 / 投籃出手數",
  ),
  percentNumberColumn(
    "offensiveReboundPercentage",
    "ORB%",
    "進攻籃板率。計算：100 × 進攻籃板 × (球隊總上場時間 / 5) / [個人上場時間 × (球隊進攻籃板 + 對手防守籃板)]",
  ),
  percentNumberColumn(
    "defensiveReboundPercentage",
    "DRB%",
    "防守籃板率。計算：100 × 防守籃板 × (球隊總上場時間 / 5) / [個人上場時間 × (球隊防守籃板 + 對手進攻籃板)]",
  ),
  percentNumberColumn(
    "totalReboundPercentage",
    "TRB%",
    "總籃板率。計算：100 × 總籃板 × (球隊總上場時間 / 5) / [個人上場時間 × (球隊總籃板 + 對手總籃板)]",
  ),
  percentNumberColumn(
    "assistPercentage",
    "AST%",
    "助攻率。計算：100 × 助攻 / {[(個人上場時間 / (球隊總上場時間 / 5)) × 球隊投籃命中數] - 個人投籃命中數}",
  ),
  percentNumberColumn(
    "stealPercentage",
    "STL%",
    "抄截率。計算：100 × 抄截 × (球隊總上場時間 / 5) / (個人上場時間 × 對手進攻回合)",
  ),
  percentNumberColumn(
    "blockPercentage",
    "BLK%",
    "阻攻率。計算：100 × 阻攻 × (球隊總上場時間 / 5) / (個人上場時間 × 對手二分出手數)",
  ),
  percentNumberColumn(
    "turnoverPercentage",
    "TOV%",
    "失誤率。計算：100 × 失誤 / (投籃出手數 + 0.44 × 罰球出手數 + 失誤)",
  ),
  percentNumberColumn(
    "usagePercentage",
    "USG%",
    "使用率。計算：100 × (投籃出手數 + 0.44 × 罰球出手數 + 失誤) × (球隊總上場時間 / 5) / (個人上場時間 × 球隊進攻回合)",
  ),
  statColumn(
    "offensiveRating",
    "ORtg",
    "進攻效率。計算：每 100 個個人進攻回合創造的得分",
    1,
  ),
  statColumn(
    "defensiveRating",
    "DRtg",
    "防守效率。計算：每 100 個防守回合估算失分",
    1,
  ),
] satisfies ColumnDef<PlayerStatsRow>[];
