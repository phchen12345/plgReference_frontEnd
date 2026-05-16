import type { Team } from "@/features/home/types/schedules";

export type TeamColor = {
  solid: string;
};

const DEFAULT_TEAM_COLOR: TeamColor = {
  solid: "gray.500",
};

const TEAM_COLOR_MATCHERS: Array<{
  keywords: string[];
  color: TeamColor;
}> = [
  {
    keywords: ["勇士", "富邦"],
    color: { solid: "blue.500" },
  },
  {
    keywords: ["領航猿", "領航員", "桃園"],
    color: { solid: "#EB8E41" },
  },
  {
    keywords: ["獵鷹", "台鋼"],
    color: { solid: "red.500" },
  },
  {
    keywords: ["洋基", "洋基工程"],
    color: { solid: "#00A378" },
  },
];

export function getTeamColor(
  team: Pick<Team, "name" | "shortName">,
): TeamColor {
  const teamName = `${team.name} ${team.shortName}`;
  return (
    TEAM_COLOR_MATCHERS.find(({ keywords }) =>
      keywords.some((keyword) => teamName.includes(keyword)),
    )?.color ?? DEFAULT_TEAM_COLOR
  );
}
