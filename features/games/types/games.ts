import type {
  GameStage,
  GameStatus,
  League,
  Season,
  Team,
} from "@/features/home/types/schedules";

type NullableNumber = number | null;

export type Referees = {
  role: string;
  title: string;
  name: string;
  sortOrder: number;
};

export type BoxscoreGame = {
  id: number;
  leagueId: number;
  seasonId: number;
  externalGameId: string | null;
  gameCode: string | null;
  gameDate: string;
  gameTime: string | null;
  venue: string | null;
  attendance: NullableNumber;
  capacity: NullableNumber;
  stage: GameStage;
  status: GameStatus;
  homeScore: NullableNumber;
  awayScore: NullableNumber;
  league: League;
  season: Season;
  homeTeam: Team;
  awayTeam: Team;
  referees: Referees[];
};

export type TeamBoxscoreStats = {
  points: NullableNumber;
  rebounds: NullableNumber;
  assists: NullableNumber;
  steals: NullableNumber;
  blocks: NullableNumber;
  turnovers: NullableNumber;
  offensiveRebounds: NullableNumber;
  defensiveRebounds: NullableNumber;
  personalFouls: NullableNumber;
  efficiency: NullableNumber;
  localPoints: NullableNumber;
  importPoints: NullableNumber;
  fsPoints: NullableNumber;
  pointsInPaint: NullableNumber;
  pointsFromSecondChance: NullableNumber;
  pointsFromFastbreak: NullableNumber;
  twoPointsMade: NullableNumber;
  twoPointsAttempted: NullableNumber;
  twoPointsPercentage: NullableNumber;
  threePointsMade: NullableNumber;
  threePointsAttempted: NullableNumber;
  threePointsPercentage: NullableNumber;
  freeThrowsMade: NullableNumber;
  freeThrowsAttempted: NullableNumber;
  freeThrowsPercentage: NullableNumber;
  offensiveRating: NullableNumber;
  defensiveRating: NullableNumber;
  netRating: NullableNumber;
};

export type Player = {
  id: number;
  teamId: number;
  name: string;
  playerType: string | null;
  position: string | null;
  officialPlayerId: string | null;
  personId: string | null;
  randomId: string | null;
  englishName: string | null;
  jerseyNumber: string | null;
};

export type PlayerBoxscoreStats = TeamBoxscoreStats & {
  minutes: string | null;
  plusMinus: NullableNumber;
  trueShootingPercentage: NullableNumber;
  effectiveFieldGoalPercentage: NullableNumber;
  threePointAttemptRate: NullableNumber;
  freeThrowRate: NullableNumber;
  offensiveReboundPercentage: NullableNumber;
  defensiveReboundPercentage: NullableNumber;
  totalReboundPercentage: NullableNumber;
  assistPercentage: NullableNumber;
  stealPercentage: NullableNumber;
  blockPercentage: NullableNumber;
  turnoverPercentage: NullableNumber;
  usagePercentage: NullableNumber;
  starter: boolean;
  assistRatio: NullableNumber;
  turnoverRatio: NullableNumber;
  gameScore: NullableNumber;
  offensivePossessions: NullableNumber;
  opponentOffensivePossessions: NullableNumber;
  opponentPointsFromSecondChance: NullableNumber;
  opponentPointsFromFastbreak: NullableNumber;
  opponentPointsFromTurnover: NullableNumber;
  opponentPointsInPaint: NullableNumber;
  pace: NullableNumber;
};

export type BoxscorePeriod<TStats> = {
  period: number;
  stats: TStats;
};

export type BoxscoreHalf<TStats> = {
  half: 1 | 2;
  stats: TStats;
};

export type BoxscorePlayer = {
  player: Player;
  stats: PlayerBoxscoreStats | null;
  periods: BoxscorePeriod<PlayerBoxscoreStats>[];
  halves: BoxscoreHalf<PlayerBoxscoreStats>[];
};

export type BoxscoreTeam = {
  team: Team;
  stats: TeamBoxscoreStats | null;
  periods: BoxscorePeriod<TeamBoxscoreStats>[];
  players: BoxscorePlayer[];
  halves: BoxscoreHalf<TeamBoxscoreStats>[];
};

export type GameBoxscore = {
  game: BoxscoreGame;
  teams: {
    away: BoxscoreTeam;
    home: BoxscoreTeam;
  };
};
