import type {
  GameStage,
  GameStatus,
  League,
  Season,
  Team,
} from "@/features/home/types/schedules";

type NullableNumber = number | null;

// 單場比賽的裁判資訊，ScoreBoard 會依 sortOrder 排序後顯示。
export type Referees = {
  role: string;
  title: string;
  name: string;
  sortOrder: number;
};

// 單場比賽基本資料：比賽時間、場館、狀態、比分、主客隊與裁判。
// 對應 GameBoxscore.game，主要供比賽詳情頁的記分板使用。
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

// 球隊層級的統計數據，可代表全場、單節或半場數據。
// TeamStats、LineScore、DonutChart 等元件會讀取這些欄位。
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

// 球員基本資料，不包含單場表現數據。
// BoxscorePlayer 會把這份球員資料與該場 stats 組在一起。
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

// 球員層級的單場統計數據。
// 繼承 TeamBoxscoreStats 的通用籃球數據，再補上上場時間、正負值與進階球員指標。
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

// 泛型的單節數據容器。
// TStats 可以是 TeamBoxscoreStats 或 PlayerBoxscoreStats。
export type BoxscorePeriod<TStats> = {
  period: number;
  stats: TStats;
};

// 泛型的半場數據容器，half 只允許上半場 1 或下半場 2。
// 用於統計頁切換 firstHalf / secondHalf 視圖。
export type BoxscoreHalf<TStats> = {
  half: 1 | 2;
  stats: TStats;
};

// 單一球員在這場比賽的完整 boxscore。
// 包含全場 stats、各節 periods、上下半場 halves。
export type BoxscorePlayer = {
  player: Player;
  stats: PlayerBoxscoreStats | null;
  periods: BoxscorePeriod<PlayerBoxscoreStats>[];
  halves: BoxscoreHalf<PlayerBoxscoreStats>[];
};

// 單一球隊在這場比賽的完整 boxscore。
// 包含球隊全場/分段數據，以及該隊所有球員的 boxscore。
export type BoxscoreTeam = {
  team: Team;
  stats: TeamBoxscoreStats | null;
  periods: BoxscorePeriod<TeamBoxscoreStats>[];
  players: BoxscorePlayer[];
  halves: BoxscoreHalf<TeamBoxscoreStats>[];
};

// 比賽 boxscore API 的最外層回傳型別。
// 詳情頁會拆成 game 與 teams，分別傳給 ScoreBoard、LineScore、TeamStats、PlayerStats 等元件。
export type GameBoxscore = {
  game: BoxscoreGame;
  teams: {
    away: BoxscoreTeam;
    home: BoxscoreTeam;
  };
};
