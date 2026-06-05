import type {
  BoxscorePlayer,
  GameBoxscore,
  PlayerBoxscoreStats,
} from "../../types/games";
import type { StatView } from "../team-stats/teamStats.utils";

type PlayerNumberStatKey = {
  [Key in keyof PlayerBoxscoreStats]: PlayerBoxscoreStats[Key] extends
    | number
    | null
    ? Key
    : never;
}[keyof PlayerBoxscoreStats];

const inferredPlayerStatKeys = [
  "points",
  "rebounds",
  "assists",
  "steals",
  "blocks",
  "turnovers",
  "plusMinus",
  "twoPointsMade",
  "twoPointsAttempted",
  "threePointsMade",
  "threePointsAttempted",
  "freeThrowsMade",
  "freeThrowsAttempted",
  "offensiveRebounds",
  "defensiveRebounds",
  "personalFouls",
  "efficiency",
  "offensivePossessions",
  "opponentOffensivePossessions",
  "opponentPointsFromSecondChance",
  "opponentPointsFromFastbreak",
  "opponentPointsFromTurnover",
  "opponentPointsInPaint",
] satisfies PlayerNumberStatKey[];

const emptyPlayerStats: PlayerBoxscoreStats = {
  points: null,
  rebounds: null,
  assists: null,
  steals: null,
  blocks: null,
  turnovers: null,
  offensiveRebounds: null,
  defensiveRebounds: null,
  personalFouls: null,
  efficiency: null,
  localPoints: null,
  importPoints: null,
  fsPoints: null,
  pointsInPaint: null,
  pointsFromSecondChance: null,
  pointsFromFastbreak: null,
  twoPointsMade: null,
  twoPointsAttempted: null,
  twoPointsPercentage: null,
  threePointsMade: null,
  threePointsAttempted: null,
  threePointsPercentage: null,
  freeThrowsMade: null,
  freeThrowsAttempted: null,
  freeThrowsPercentage: null,
  offensiveRating: null,
  defensiveRating: null,
  netRating: null,
  minutes: null,
  plusMinus: null,
  trueShootingPercentage: null,
  effectiveFieldGoalPercentage: null,
  threePointAttemptRate: null,
  freeThrowRate: null,
  offensiveReboundPercentage: null,
  defensiveReboundPercentage: null,
  totalReboundPercentage: null,
  assistPercentage: null,
  stealPercentage: null,
  blockPercentage: null,
  turnoverPercentage: null,
  usagePercentage: null,
  starter: false,
  assistRatio: null,
  turnoverRatio: null,
  gameScore: null,
  offensivePossessions: null,
  opponentOffensivePossessions: null,
  opponentPointsFromSecondChance: null,
  opponentPointsFromFastbreak: null,
  opponentPointsFromTurnover: null,
  opponentPointsInPaint: null,
  pace: null,
};

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

function formatSecondsAsMinutes(seconds: number) {
  const safeSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function getPeriodNumberTotal(
  player: BoxscorePlayer,
  key: PlayerNumberStatKey,
) {
  return player.periods.reduce(
    (sum, item) => sum + (item.stats[key] ?? 0),
    0,
  );
}

function getInferredNumberValue(
  player: BoxscorePlayer,
  key: PlayerNumberStatKey,
) {
  const total = player.stats?.[key];

  if (total == null) {
    return null;
  }

  const value = total - getPeriodNumberTotal(player, key);

  return key === "plusMinus" ? value : Math.max(0, value);
}

function getInferredMinutes(player: BoxscorePlayer) {
  const totalSeconds = parseMinutesToSeconds(player.stats?.minutes);

  if (totalSeconds == null) {
    return null;
  }

  const periodSeconds = player.periods.reduce(
    (sum, item) => sum + (parseMinutesToSeconds(item.stats.minutes) ?? 0),
    0,
  );

  return formatSecondsAsMinutes(totalSeconds - periodSeconds);
}

function getPercentage(made: number | null, attempted: number | null) {
  if (!attempted) {
    return null;
  }

  return ((made ?? 0) / attempted) * 100;
}

function getRate(numerator: number | null, denominator: number | null) {
  if (!denominator) {
    return null;
  }

  return (numerator ?? 0) / denominator;
}

function getInferredOvertimeStats(player: BoxscorePlayer) {
  const stats = { ...emptyPlayerStats };

  for (const key of inferredPlayerStatKeys) {
    stats[key] = getInferredNumberValue(player, key);
  }

  stats.minutes = getInferredMinutes(player);
  stats.twoPointsPercentage = getPercentage(
    stats.twoPointsMade,
    stats.twoPointsAttempted,
  );
  stats.threePointsPercentage = getPercentage(
    stats.threePointsMade,
    stats.threePointsAttempted,
  );
  stats.freeThrowsPercentage = getPercentage(
    stats.freeThrowsMade,
    stats.freeThrowsAttempted,
  );
  stats.effectiveFieldGoalPercentage = getPercentage(
    (stats.twoPointsMade ?? 0) + 1.5 * (stats.threePointsMade ?? 0),
    (stats.twoPointsAttempted ?? 0) + (stats.threePointsAttempted ?? 0),
  );
  stats.trueShootingPercentage = getPercentage(
    stats.points,
    2 *
      ((stats.twoPointsAttempted ?? 0) +
        (stats.threePointsAttempted ?? 0) +
        0.44 * (stats.freeThrowsAttempted ?? 0)),
  );
  stats.threePointAttemptRate = getRate(
    stats.threePointsAttempted,
    (stats.twoPointsAttempted ?? 0) + (stats.threePointsAttempted ?? 0),
  );
  stats.freeThrowRate = getRate(
    stats.freeThrowsAttempted,
    (stats.twoPointsAttempted ?? 0) + (stats.threePointsAttempted ?? 0),
  );
  stats.turnoverPercentage = getPercentage(
    stats.turnovers,
    (stats.twoPointsAttempted ?? 0) +
      (stats.threePointsAttempted ?? 0) +
      0.44 * (stats.freeThrowsAttempted ?? 0) +
      (stats.turnovers ?? 0),
  );

  return stats;
}

export function getPlayerStatsByView(
  player: BoxscorePlayer,
  view: StatView,
  inferredOvertimePeriod?: number | null,
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
    player.periods.find((item) => item.period === Number(view))?.stats ??
    (Number(view) === inferredOvertimePeriod
      ? getInferredOvertimeStats(player)
      : null)
  );
}

export function buildPlayerStatsRows(
  players: GameBoxscore["teams"]["away"]["players"],
  view: StatView,
  inferredOvertimePeriod?: number | null,
): PlayerStatsRow[] {
  return players.map((item) => ({
    id: item.player.id,
    jerseyNumber: item.player.jerseyNumber,
    name: item.player.name,
    englishName: item.player.englishName,
    position: item.player.position,
    playerType: item.player.playerType,
    starter: item.stats?.starter ?? false,
    stats: getPlayerStatsByView(item, view, inferredOvertimePeriod),
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
