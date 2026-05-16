import { requestJson } from "@/lib/api/client";
import type { GameBoxscore } from "../types/games";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function getGameBoxscore(gameId: string | number) {
  return requestJson<GameBoxscore>(
    `${API_BASE_URL}/api/games/${gameId}/boxscore`,
  );
}
