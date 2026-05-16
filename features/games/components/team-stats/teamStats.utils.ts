import type { GameBoxscore, TeamBoxscoreStats } from "../../types/games";

export const statViews = [
  { label: "全部", value: "total" },
  { label: "上半場", value: "firstHalf" },
  { label: "下半場", value: "secondHalf" },
  { label: "Q1", value: "1" },
  { label: "Q2", value: "2" },
  { label: "Q3", value: "3" },
  { label: "Q4", value: "4" },
] as const;

export type StatView = (typeof statViews)[number]["value"];

type TeamBoxscore = GameBoxscore["teams"]["away"];

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
