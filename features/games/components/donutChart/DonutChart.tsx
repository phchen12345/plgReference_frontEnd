"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import { Pie, PieChart, Sector, Tooltip } from "recharts";
import { GameBoxscore, TeamBoxscoreStats } from "../../types/games";
import { getTeamColor } from "../../utils/teamColors";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";

type DonutChartProps = {
  title: string;
  teams: GameBoxscore["teams"];
  statKey: keyof TeamBoxscoreStats;
};

export function DonutChart({ title, teams, statKey }: DonutChartProps) {
  const data = [
    {
      name: teams.home.team.shortName,
      value: teams.home.stats?.[statKey] ?? 0,
      color: getTeamColor(teams.home.team).solid,
    },
    {
      name: teams.away.team.shortName,
      value: teams.away.stats?.[statKey] ?? 0,
      color: getTeamColor(teams.away.team).solid,
    },
  ];

  const hasData = data.some((item) => item.value > 0);

  const chart = useChart({
    data: hasData ? data : [{ name: "無資料", value: 1, color: "gray.200" }],
  });
  return (
    <VStack display="flex" flex="1" minW={0}>
      <Box justifyItems="center" alignItems="center">
        <Text>{title}</Text>
      </Box>
      <HStack justify="center" minW={0}>
        <VStack
          gap={0}
          w={{ base: "72px", md: "96px" }}
          flexShrink={0}
          align="center"
        >
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            color={getTeamColor(teams.away.team).solid}
            textAlign="center"
            lineHeight="1"
          >
            {teams.away.stats?.[statKey]}
          </Text>

          <Text
            color="gray.500"
            fontSize={{ base: "lg", md: "xl" }}
            textAlign="center"
            whiteSpace="nowrap"
            _dark={{ color: "gray.400" }}
          >
            {teams.away.team.shortName}
          </Text>
        </VStack>
        <Chart.Root
          boxSize={{ base: "140px", md: "180px" }}
          chart={chart}
          mx="auto"
        >
          <PieChart responsive>
            <Tooltip
              cursor={false}
              animationDuration={100}
              content={<Chart.Tooltip hideLabel />}
            />
            <Pie
              startAngle={-90}
              endAngle={270}
              innerRadius="42%"
              outerRadius="82%"
              isAnimationActive={false}
              data={chart.data}
              dataKey={chart.key("value")}
              nameKey={chart.key("name")}
              strokeWidth={5}
              shape={(props) => (
                <Sector {...props} fill={chart.color(props.payload!.color)} />
              )}
            />
          </PieChart>
        </Chart.Root>
        <VStack
          gap={0}
          w={{ base: "72px", md: "96px" }}
          flexShrink={0}
          align="center"
        >
          <Text
            fontSize={{ base: "3xl", md: "4xl" }}
            color={getTeamColor(teams.home.team).solid}
            textAlign="center"
            lineHeight="1"
          >
            {teams.home.stats?.[statKey]}
          </Text>

          <Text
            color="gray.500"
            fontSize={{ base: "lg", md: "xl" }}
            textAlign="center"
            whiteSpace="nowrap"
            _dark={{ color: "gray.400" }}
          >
            {teams.home.team.shortName}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
