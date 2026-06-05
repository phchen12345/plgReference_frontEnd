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

export function getStatViews(teams: GameBoxscore["teams"]) {
  return [
    ...baseStatViews,
    ...getGamePeriods(teams).map((period) => ({
      label: formatPeriodLabel(period),
      value: String(period) as `${number}`,
    })),
  ];
}

export function getTeamStatsByView(
  team: TeamBoxscore,
  view: StatView,
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
    team.periods.find((item) => item.period === Number(view))?.stats ?? null
  );
}
