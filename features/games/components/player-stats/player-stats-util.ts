import { BoxscorePlayer, PlayerBoxscoreStats } from "../../types/games";
import { StatView } from "../team-stats/teamStats.utils";

export function getPlayerStatsByView(
  player: BoxscorePlayer,
  view: StatView,
): PlayerBoxscoreStats | null {
  if (view === "total") return player.stats;

  return (
    player.periods.find((item) => item.period === Number(view))?.stats ?? null
  );
}
