"use client";

import dynamic from "next/dynamic";
import { Box, Skeleton, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import type { GameBoxscore } from "../../types/games";

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
  const rootRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "400px",
        threshold: 0,
      },
    );

    const element = rootRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  return (
    <Box ref={rootRef} minH="320px">
      {shouldLoad ? (
        <PlayerStatsSection teams={teams} />
      ) : (
        <Stack gap={3} mt={4}>
          <Skeleton height="36px" />
          <Skeleton height="260px" />
        </Stack>
      )}
    </Box>
  );
}
