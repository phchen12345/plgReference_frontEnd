export type League = {
  id: number;
  code: string;
  name: string;
};

export type Season = {
  id: number;
  name: string;
};

export type Team = {
  id: number;
  name: string;
  shortName: string;
  logoUrl: string;
};

export type GameStage = "regular_season" | "playoffs" | "finals";

export type GameStatus =
  | "scheduled"
  | "live"
  | "final"
  | "postponed"
  | "cancelled";

export type ScheduleGame = {
  id: number;
  leagueId: number;
  seasonId: number;
  externalGameId: string;
  gameDate: string;
  gameTime: string;
  stage: GameStage;
  status: GameStatus;
  homeScore: number | null;
  awayScore: number | null;
  league: League;
  season: Season;
  homeTeam: Team;
  awayTeam: Team;
  venue: string;
};

export type ScheduleResponse = {
  data: ScheduleGame[];
};
