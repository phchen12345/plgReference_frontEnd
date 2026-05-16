import { BarSegment, useChart } from "@chakra-ui/charts";
import { Box, Stack } from "@chakra-ui/react";
import type { GameBoxscore } from "../types/games";

type TeamBoxscore = GameBoxscore["teams"]["away"];

type TeamPointTypeChartProps = {
  teamBoxscore: TeamBoxscore;
};

export function TeamPointTypeChart({ teamBoxscore }: TeamPointTypeChartProps) {
  const data = [
    {
      name: "本土",
      value: teamBoxscore.stats?.localPoints ?? 0,
      color: "green.500",
    },
    {
      name: "洋將",
      value: teamBoxscore.stats?.importPoints ?? 0,
      color: "blue.500",
    },
    {
      name: "外籍生",
      value: teamBoxscore.stats?.fsPoints ?? 0,
      color: "purple.500",
    },
  ];

  const hasData = data.some((item) => item.value > 0);

  const chart = useChart({
    data: hasData ? data : [{ name: "無資料", value: 1, color: "gray.200" }],
  });

  return (
    <Stack gap={2} pt={4} w="full">
      <Box w="full">
        <BarSegment.Root chart={chart} barSize="3">
          <BarSegment.Content>
            <BarSegment.Value />
            <BarSegment.Bar tooltip />
          </BarSegment.Content>
        </BarSegment.Root>
      </Box>
    </Stack>
  );
}
