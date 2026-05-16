"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import { Pie, PieChart, Sector, Tooltip } from "recharts";
import { GameBoxscore, TeamBoxscoreStats } from "../../types/games";
import { getTeamColor } from "../../utils/teamColors";
import { HStack, Text, VStack } from "@chakra-ui/react";

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
    <VStack display="flex" flex="1">
      <Text>{title}</Text>
      <HStack>
        <VStack gap={0}>
          <Text fontSize="5xl" color={getTeamColor(teams.away.team).solid}>
            {teams.away.stats?.[statKey]}
          </Text>
          <Text color="gray.500" fontSize="2xl" _dark={{ color: "gray.400" }}>
            {teams.away.team.shortName}
          </Text>
        </VStack>
        <Chart.Root boxSize="200px" chart={chart} mx="auto">
          <PieChart responsive>
            <Tooltip
              cursor={false}
              animationDuration={100}
              content={<Chart.Tooltip hideLabel />}
            />
            <Pie
              startAngle={-90}
              endAngle={270}
              innerRadius={40}
              outerRadius={100}
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
        <VStack gap={0}>
          <Text fontSize="5xl" color={getTeamColor(teams.home.team).solid}>
            {teams.home.stats?.[statKey]}
          </Text>
          <Text color="gray.500" fontSize="2xl" _dark={{ color: "gray.400" }}>
            {teams.home.team.shortName}
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}
