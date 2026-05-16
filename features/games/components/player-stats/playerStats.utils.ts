import type {
  BoxscorePlayer,
  GameBoxscore,
  PlayerBoxscoreStats,
} from "../../types/games";
import type { StatView } from "../team-stats/teamStats.utils";

export type PlayerStatsRow = {
  id: number;
  jerseyNumber: string | null;
  name: string;
  englishName: string | null;
  position: string | null;
  playerType: string | null;
  starter: boolean;
  stats: PlayerBoxscoreStats | null;
};

export function getPlayerStatsByView(
  player: BoxscorePlayer,
  view: StatView,
): PlayerBoxscoreStats | null {
  if (view === "total") {
    return player.stats;
  }

  if (view === "firstHalf") {
    return player.halves.find((item) => item.half === 1)?.stats ?? null;
  }

  if (view === "secondHalf") {
    return player.halves.find((item) => item.half === 2)?.stats ?? null;
  }

  return (
    player.periods.find((item) => item.period === Number(view))?.stats ?? null
  );
}

export function buildPlayerStatsRows(
  players: GameBoxscore["teams"]["away"]["players"],
  view: StatView,
): PlayerStatsRow[] {
  return players.map((item) => ({
    id: item.player.id,
    jerseyNumber: item.player.jerseyNumber,
    name: item.player.name,
    englishName: item.player.englishName,
    position: item.player.position,
    playerType: item.player.playerType,
    starter: item.stats?.starter ?? false,
    stats: getPlayerStatsByView(item, view),
  }));
}

export function formatNumber(
  value: number | null | undefined,
  fractionDigits = 0,
) {
  return value == null ? "-" : value.toFixed(fractionDigits);
}

function trimLeadingZero(value: string) {
  return value.replace(/^(-?)0\./, "$1.");
}

export function formatPercentNumber(
  value: number | null | undefined,
  fractionDigits = 1,
) {
  return value == null ? "-" : value.toFixed(fractionDigits);
}

export function formatDecimalPercentage(value: number | null | undefined) {
  if (value == null) return "-";
  return trimLeadingZero((value / 100).toFixed(3));
}

export function formatRate(value: number | null | undefined) {
  if (value == null) return "-";
  return trimLeadingZero(value.toFixed(3));
}

export function formatPlusMinus(value: number | null | undefined) {
  if (value == null) return "-";
  if (value > 0) return `+${value}`;
  return String(value);
}

export function formatMinutes(value: string | null | undefined) {
  return value ?? "-";
}

export function parseMinutesToSeconds(value: string | null | undefined) {
  if (!value) return null;

  const [minutes, seconds = "0"] = value.split(":");
  const parsedMinutes = Number(minutes);
  const parsedSeconds = Number(seconds);

  if (Number.isNaN(parsedMinutes) || Number.isNaN(parsedSeconds)) {
    return null;
  }

  return parsedMinutes * 60 + parsedSeconds;
}

export function getFieldGoalMade(stats: PlayerBoxscoreStats | null) {
  if (!stats) return null;
  return (stats.twoPointsMade ?? 0) + (stats.threePointsMade ?? 0);
}

export function getFieldGoalAttempted(stats: PlayerBoxscoreStats | null) {
  if (!stats) return null;
  return (stats.twoPointsAttempted ?? 0) + (stats.threePointsAttempted ?? 0);
}
