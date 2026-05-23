"use client";

import dynamic from "next/dynamic";
import { Box, Skeleton, Stack } from "@chakra-ui/react";
import type { GameBoxscore } from "../../types/games";

// 將 Skeleton 設定為 dynamic 的 loading 狀態
const PlayerStatsSection = dynamic(
  () => import("./PlayerStatsSection").then((mod) => mod.PlayerStatsSection),
  {
    ssr: false,
    loading: () => (
      <Stack gap={3} mt={4}>
        <Skeleton height="36px" />
        <Skeleton height="260px" />
      </Stack>
    ),
  },
);

export function LazyPlayerStatsSection({
  teams,
}: {
  teams: GameBoxscore["teams"];
}) {
  return (
    <Box
      minH="320px"
      style={{
        // 1. 告訴瀏覽器這區塊是獨立的，畫面外時跳過渲染
        contentVisibility: "auto",
        // 2. 給瀏覽器一個預估高度，避免滾動條彈跳
        containIntrinsicSize: "auto 320px",
      }}
    >
      <PlayerStatsSection teams={teams} />
    </Box>
  );
}
