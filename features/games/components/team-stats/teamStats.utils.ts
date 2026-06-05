import type { GameBoxscore, TeamBoxscoreStats } from "../../types/games";

const baseStatViews = [
  { label: "全部", value: "total" },
  { label: "上半場", value: "firstHalf" },
  { label: "下半場", value: "secondHalf" },
] as const;

export type StatView =
  | (typeof baseStatViews)[number]["value"]
  | `${number}`;

type TeamBoxscore = GameBoxscore["teams"]["away"];
type TeamStatNumberKey = keyof TeamBoxscoreStats;

const inferredOvertimeStatKeys = [
  "points",
  "rebounds",
  "assists",
  "steals",
  "blocks",
  "turnovers",
  "offensiveRebounds",
  "defensiveRebounds",
  "personalFouls",
  "efficiency",
  "localPoints",
  "importPoints",
  "fsPoints",
  "pointsInPaint",
  "pointsFromSecondChance",
  "pointsFromFastbreak",
  "twoPointsMade",
  "twoPointsAttempted",
  "threePointsMade",
  "threePointsAttempted",
  "freeThrowsMade",
  "freeThrowsAttempted",
] satisfies TeamStatNumberKey[];

const emptyTeamStats: TeamBoxscoreStats = {
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
};

export function formatPeriodLabel(period: number) {
  return period <= 4 ? `Q${period}` : `OT${period - 4}`;
}

export function getGamePeriods(teams: GameBoxscore["teams"]) {
  return Array.from(
    new Set([
      ...teams.away.periods.map((item) => item.period),
      ...teams.home.periods.map((item) => item.period),
    ]),
  ).sort((first, second) => first - second);
}

function hasRegulationPeriods(periods: number[]) {
  return [1, 2, 3, 4].every((period) => periods.includes(period));
}

function getPeriodStatTotal(team: TeamBoxscore, key: TeamStatNumberKey) {
  return team.periods.reduce(
    (sum, item) => sum + (item.stats[key] ?? 0),
    0,
  );
}

function getInferredStatValue(team: TeamBoxscore, key: TeamStatNumberKey) {
  const total = team.stats?.[key];

  if (total == null) {
    return null;
  }

  return Math.max(0, total - getPeriodStatTotal(team, key));
}

export function getInferredOvertimePeriod(teams: GameBoxscore["teams"]) {
  const periods = getGamePeriods(teams);

  if (!hasRegulationPeriods(periods) || periods.some((period) => period > 4)) {
    return null;
  }

  const hasOvertimeScore = [teams.away, teams.home].some(
    (team) => (getInferredStatValue(team, "points") ?? 0) > 0,
  );

  return hasOvertimeScore ? 5 : null;
}

export function getStatViews(teams: GameBoxscore["teams"]) {
  return [
    ...baseStatViews,
    ...getGamePeriods(teams).map((period) => ({
      label: formatPeriodLabel(period),
      value: String(period) as `${number}`,
    })),
  ];
}

export function getTeamStatViews(teams: GameBoxscore["teams"]) {
  const inferredOvertimePeriod = getInferredOvertimePeriod(teams);

  return [
    ...getStatViews(teams),
    ...(inferredOvertimePeriod
      ? [
          {
            label: formatPeriodLabel(inferredOvertimePeriod),
            value: String(inferredOvertimePeriod) as `${number}`,
          },
        ]
      : []),
  ];
}

function getInferredOvertimeStats(team: TeamBoxscore) {
  const stats = { ...emptyTeamStats };

  for (const key of inferredOvertimeStatKeys) {
    stats[key] = getInferredStatValue(team, key);
  }

  if (stats.twoPointsAttempted) {
    stats.twoPointsPercentage =
      ((stats.twoPointsMade ?? 0) / stats.twoPointsAttempted) * 100;
  }

  if (stats.threePointsAttempted) {
    stats.threePointsPercentage =
      ((stats.threePointsMade ?? 0) / stats.threePointsAttempted) * 100;
  }

  if (stats.freeThrowsAttempted) {
    stats.freeThrowsPercentage =
      ((stats.freeThrowsMade ?? 0) / stats.freeThrowsAttempted) * 100;
  }

  return stats;
}

export function getTeamStatsByView(
  team: TeamBoxscore,
  view: StatView,
  inferredOvertimePeriod?: number | null,
): TeamBoxscoreStats | null {
  if (view === "total") {
    return team.stats;
  }

  if (view === "firstHalf") {
    return team.halves.find((item) => item.half === 1)?.stats ?? null;
  }

  if (view === "secondHalf") {
    return team.halves.find((item) => item.half === 2)?.stats ?? null;
  }

  return (
    team.periods.find((item) => item.period === Number(view))?.stats ??
    (Number(view) === inferredOvertimePeriod
      ? getInferredOvertimeStats(team)
      : null)
  );
}
