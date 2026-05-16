"use client";

import { BarSegment, useChart } from "@chakra-ui/charts";
import {
  Box,
  Grid,
  HStack,
  IconButton,
  Popover,
  Portal,
  Text,
} from "@chakra-ui/react";
import { Info } from "lucide-react";
import type { TeamBoxscoreStats } from "../../types/games";
import type { StatRow } from "./teamStats.config";
import type { StatView } from "./teamStats.utils";

type TeamStatsCompareRowProps = {
  row: StatRow;
  awayTeamName: string;
  awayTeamColor: string;
  homeTeamName: string;
  homeTeamColor: string;
  awayStats: TeamBoxscoreStats | null;
  homeStats: TeamBoxscoreStats | null;
  view: StatView;
};

type StatDescriptionTipProps = {
  label: string;
  description: string;
};

function StatDescriptionTip({ label, description }: StatDescriptionTipProps) {
  return (
    <Popover.Root positioning={{ placement: "top", gutter: 6 }}>
      <Popover.Trigger asChild>
        <IconButton
          aria-label={`${label} 說明`}
          borderRadius="full"
          color="gray.500"
          minW="4"
          size="2xs"
          variant="ghost"
          css={{
            "& svg": {
              height: "12px",
              width: "12px",
            },
          }}
          _hover={{ bg: "white", color: "gray.700" }}
          _dark={{
            color: "gray.400",
            _hover: { bg: "gray.800", color: "gray.100" },
          }}
        >
          <Info aria-hidden size={12} />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content maxW="300px">
            <Popover.Arrow />
            <Popover.Body p={3}>
              <Text fontSize="lg" fontWeight="semibold" mb={1}>
                {label}
              </Text>
              <Text
                color="gray.600"
                fontSize="sm"
                lineHeight="1.6"
                _dark={{ color: "gray.300" }}
              >
                {description}
              </Text>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
}

export function TeamStatsCompareRow({
  row,
  awayTeamName,
  awayTeamColor,
  homeTeamName,
  homeTeamColor,
  awayStats,
  homeStats,
  view,
}: TeamStatsCompareRowProps) {
  const awayContext = {
    stats: awayStats,
    opponentStats: homeStats,
    view,
  };
  const homeContext = {
    stats: homeStats,
    opponentStats: awayStats,
    view,
  };

  const rawAwayBarValue = row.getBarValue(awayContext) ?? 0;
  const rawHomeBarValue = row.getBarValue(homeContext) ?? 0;
  const minBarValue = Math.min(rawAwayBarValue, rawHomeBarValue);
  const offset = minBarValue < 0 ? Math.abs(minBarValue) : 0;
  const awayBarValue = rawAwayBarValue + offset;
  const homeBarValue = rawHomeBarValue + offset;
  const hasBarData = awayBarValue > 0 || homeBarValue > 0;

  const chart = useChart({
    data: hasBarData
      ? [
          {
            name: awayTeamName,
            value: awayBarValue,
            color: awayTeamColor,
          },
          {
            name: homeTeamName,
            value: homeBarValue,
            color: homeTeamColor,
          },
        ]
      : [{ name: "無資料", value: 1, color: "gray.200" }],
  });

  return (
    <Grid
      alignItems="center"
      borderBottom="1px solid"
      borderColor="gray.100"
      gap={3}
      py={3}
      templateColumns={{ base: "1fr", md: "140px minmax(180px, 1fr) 140px" }}
      _dark={{ borderColor: "gray.800" }}
    >
      <Text fontWeight="semibold">{row.getValue(awayContext)}</Text>

      <Box minW={0}>
        <HStack color="gray.600" gap={1} justify="center" mb={1}>
          <Text
            fontSize="sm"
            textAlign="center"
            _dark={{ color: "gray.300" }}
          >
            {row.label}
          </Text>
          {row.description ? (
            <StatDescriptionTip
              description={row.description}
              label={row.label}
            />
          ) : null}
        </HStack>
        <BarSegment.Root chart={chart} barSize="2">
          <BarSegment.Content>
            <BarSegment.Bar />
          </BarSegment.Content>
        </BarSegment.Root>
      </Box>

      <Text fontWeight="semibold" textAlign={{ base: "left", md: "right" }}>
        {row.getValue(homeContext)}
      </Text>
    </Grid>
  );
}
