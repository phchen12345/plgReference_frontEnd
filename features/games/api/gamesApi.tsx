import { requestJson } from "@/lib/api/client";
import type { GameBoxscore } from "../types/games";

export function getGameBoxscore(gameId: string | number) {
  return requestJson<GameBoxscore>(
    `http://localhost:3100/api/games/${gameId}/boxscore`,
  );
}
