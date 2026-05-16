import { BoxscorePlayer, PlayerBoxscoreStats } from "../../types/games";
import { StatView } from "../team-stats/teamStats.utils";

export function getPlayerStatsByView(
  player: BoxscorePlayer,
  view: StatView,
): PlayerBoxscoreStats | null {
  if (view === "total") return player.stats;

  if (view === "firstHalf") {
    // 如果 API 沒有 player.halves，就要用 Q1 + Q2 算
  }

  if (view === "secondHalf") {
    // 如果 API 沒有 player.halves，就要用 Q3 + Q4 算
  }

  return (
    player.periods.find((item) => item.period === Number(view))?.stats ?? null
  );
}
