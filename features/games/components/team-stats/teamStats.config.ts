import type { TeamBoxscoreStats } from "../../types/games";
import type { StatView } from "./teamStats.utils";

export type StatContext = {
  stats: TeamBoxscoreStats | null;
  opponentStats: TeamBoxscoreStats | null;
  view: StatView;
};

export type StatRow = {
  label: string;
  description?: string;
  getValue: (context: StatContext) => string;
  getBarValue: (context: StatContext) => number | null;
};

type NumberStatKey = {
  [Key in keyof TeamBoxscoreStats]: TeamBoxscoreStats[Key] extends number | null
    ? Key
    : never;
}[keyof TeamBoxscoreStats];

type ShootingStatKeys = {
  madeKey: NumberStatKey;
  attemptedKey: NumberStatKey;
  percentageKey: NumberStatKey;
};

const emptyValue = "-";

function numberValue(value: number | null | undefined) {
  return value ?? emptyValue;
}

function percentageValue(value: number | null | undefined) {
  return value == null ? emptyValue : `${value.toFixed(1)}%`;
}

function ratingValue(value: number | null | undefined) {
  return value == null ? emptyValue : value.toFixed(1);
}

function stat(
  label: string,
  key: NumberStatKey,
  description?: string,
): StatRow {
  return {
    label,
    description,
    getValue: ({ stats }) => String(numberValue(stats?.[key])),
    getBarValue: ({ stats }) => stats?.[key] ?? null,
  };
}

function ratingStat(
  label: string,
  key: NumberStatKey,
  description?: string,
): StatRow {
  return {
    label,
    description,
    getValue: ({ stats }) => ratingValue(stats?.[key]),
    getBarValue: ({ stats }) => stats?.[key] ?? null,
  };
}

function madeAttemptValue(
  made: number | null | undefined,
  attempted: number | null | undefined,
  percentage: number | null | undefined,
) {
  if (made == null || attempted == null) return emptyValue;

  return percentage == null
    ? `${made}/${attempted}`
    : `${made}/${attempted} (${percentageValue(percentage)})`;
}

function shootingStat(label: string, keys: ShootingStatKeys): StatRow {
  return {
    label,
    getValue: ({ stats }) =>
      madeAttemptValue(
        stats?.[keys.madeKey],
        stats?.[keys.attemptedKey],
        stats?.[keys.percentageKey],
      ),
    getBarValue: ({ stats }) => stats?.[keys.percentageKey] ?? null,
  };
}

function getFieldGoalParts(stats: TeamBoxscoreStats | null) {
  if (!stats) return null;

  const made = (stats.twoPointsMade ?? 0) + (stats.threePointsMade ?? 0);
  const attempted =
    (stats.twoPointsAttempted ?? 0) + (stats.threePointsAttempted ?? 0);

  return { made, attempted };
}

function getFieldGoalAttempted(stats: TeamBoxscoreStats | null) {
  return (stats?.twoPointsAttempted ?? 0) + (stats?.threePointsAttempted ?? 0);
}

function fieldGoalStat(): StatRow {
  return {
    label: "投籃",
    getValue: ({ stats }) => {
      const fieldGoal = getFieldGoalParts(stats);
      if (!fieldGoal || fieldGoal.attempted === 0) return emptyValue;

      const percentage = (fieldGoal.made / fieldGoal.attempted) * 100;
      return madeAttemptValue(fieldGoal.made, fieldGoal.attempted, percentage);
    },
    getBarValue: ({ stats }) => {
      const fieldGoal = getFieldGoalParts(stats);
      if (!fieldGoal || fieldGoal.attempted === 0) return null;

      return (fieldGoal.made / fieldGoal.attempted) * 100;
    },
  };
}

function estimatePossessions(stats: TeamBoxscoreStats | null) {
  if (!stats) return null;

  return (
    getFieldGoalAttempted(stats) +
    0.44 * (stats.freeThrowsAttempted ?? 0) -
    (stats.offensiveRebounds ?? 0) +
    (stats.turnovers ?? 0)
  );
}

function getViewMinutes(view: StatView) {
  if (view === "firstHalf" || view === "secondHalf") return 20;
  if (view === "total") return 40;
  return 10;
}

function calculateTrueShootingPercentage(stats: TeamBoxscoreStats | null) {
  if (!stats) return null;

  const denominator =
    2 *
    (getFieldGoalAttempted(stats) + 0.44 * (stats.freeThrowsAttempted ?? 0));
  if (denominator === 0) return null;

  return ((stats.points ?? 0) / denominator) * 100;
}

function calculateEffectiveFieldGoalPercentage(
  stats: TeamBoxscoreStats | null,
) {
  const fieldGoal = getFieldGoalParts(stats);
  if (!stats || !fieldGoal || fieldGoal.attempted === 0) return null;

  return (
    ((fieldGoal.made + 0.5 * (stats.threePointsMade ?? 0)) /
      fieldGoal.attempted) *
    100
  );
}

function calculatePace(
  stats: TeamBoxscoreStats | null,
  opponentStats: TeamBoxscoreStats | null,
  view: StatView,
) {
  const possessions = estimatePossessions(stats);
  const opponentPossessions = estimatePossessions(opponentStats);
  if (possessions == null || opponentPossessions == null) return null;

  return (
    ((possessions + opponentPossessions) / 2) * (40 / getViewMinutes(view))
  );
}

function calculateAssistPercentage(stats: TeamBoxscoreStats | null) {
  const fieldGoal = getFieldGoalParts(stats);
  if (!stats || !fieldGoal || fieldGoal.made === 0) return null;

  return ((stats.assists ?? 0) / fieldGoal.made) * 100;
}

function calculateOffensiveReboundPercentage(
  stats: TeamBoxscoreStats | null,
  opponentStats: TeamBoxscoreStats | null,
) {
  if (!stats || !opponentStats) return null;

  const chances =
    (stats.offensiveRebounds ?? 0) + (opponentStats.defensiveRebounds ?? 0);
  if (chances === 0) return null;

  return ((stats.offensiveRebounds ?? 0) / chances) * 100;
}

function calculateTurnoverPercentage(stats: TeamBoxscoreStats | null) {
  if (!stats) return null;

  const denominator =
    getFieldGoalAttempted(stats) +
    0.44 * (stats.freeThrowsAttempted ?? 0) +
    (stats.turnovers ?? 0);
  if (denominator === 0) return null;

  return ((stats.turnovers ?? 0) / denominator) * 100;
}

function calculatedPercentageStat(
  label: string,
  getPercentage: (context: StatContext) => number | null,
  description?: string,
): StatRow {
  return {
    label,
    description,
    getValue: (context) => percentageValue(getPercentage(context)),
    getBarValue: getPercentage,
  };
}

function trueShootingStat(): StatRow {
  return calculatedPercentageStat(
    "真實命中率 TS%",
    ({ stats }) => calculateTrueShootingPercentage(stats),
    "公式：得分 / [2 × (投籃出手 + 0.44 × 罰球出手)] × 100。投籃出手等於兩分出手加三分出手。",
  );
}

function effectiveFieldGoalStat(): StatRow {
  return calculatedPercentageStat(
    "有效命中率 eFG%",
    ({ stats }) => calculateEffectiveFieldGoalPercentage(stats),
    "公式：(投籃命中 + 0.5 × 三分命中) / 投籃出手 × 100。三分球會多加 0.5 權重。",
  );
}

function paceStat(): StatRow {
  return {
    label: "節奏 Pace",
    description:
      "估算每 40 分鐘的回合數。公式：雙方估算回合數平均 × (40 / 目前區間分鐘數)。",
    getValue: ({ stats, opponentStats, view }) =>
      ratingValue(calculatePace(stats, opponentStats, view)),
    getBarValue: ({ stats, opponentStats, view }) =>
      calculatePace(stats, opponentStats, view),
  };
}

function possessionsStat(): StatRow {
  return {
    label: "進攻次數 Poss",
    description:
      "估算球隊進攻回合數。公式：投籃出手 + 0.44 × 罰球出手 - 進攻籃板 + 失誤。",
    getValue: ({ stats }) => ratingValue(estimatePossessions(stats)),
    getBarValue: ({ stats }) => estimatePossessions(stats),
  };
}

function assistPercentageStat(): StatRow {
  return calculatedPercentageStat(
    "助攻率 AST%",
    ({ stats }) => calculateAssistPercentage(stats),
    "目前球隊表使用簡化公式：助攻 / 投籃命中 × 100，用來看命中球中有多少比例來自助攻。",
  );
}

function offensiveReboundPercentageStat(): StatRow {
  return calculatedPercentageStat(
    "進攻籃板率 ORB%",
    ({ stats, opponentStats }) =>
      calculateOffensiveReboundPercentage(stats, opponentStats),
    "公式：進攻籃板 / (進攻籃板 + 對手防守籃板) × 100，用來看可搶進攻籃板機會中拿下的比例。",
  );
}

function turnoverPercentageStat(): StatRow {
  return calculatedPercentageStat(
    "失誤率 TOV%",
    ({ stats }) => calculateTurnoverPercentage(stats),
    "公式：失誤 / (投籃出手 + 0.44 × 罰球出手 + 失誤) × 100，用來估算回合中以失誤結束的比例。",
  );
}

export const basicStatRows = [
  stat("得分", "points"),
  {
    label: "籃板",
    getValue: ({ stats }) => {
      if (!stats) return emptyValue;

      return `${stats.rebounds ?? 0} (${stats.offensiveRebounds ?? 0}攻 ${
        stats.defensiveRebounds ?? 0
      }守)`;
    },
    getBarValue: ({ stats }) => stats?.rebounds ?? null,
  },
  stat("助攻", "assists"),
  stat("抄截", "steals"),
  stat("阻攻", "blocks"),
  stat("失誤", "turnovers"),
  fieldGoalStat(),
  shootingStat("兩分", {
    madeKey: "twoPointsMade",
    attemptedKey: "twoPointsAttempted",
    percentageKey: "twoPointsPercentage",
  }),
  shootingStat("三分", {
    madeKey: "threePointsMade",
    attemptedKey: "threePointsAttempted",
    percentageKey: "threePointsPercentage",
  }),
  shootingStat("罰球", {
    madeKey: "freeThrowsMade",
    attemptedKey: "freeThrowsAttempted",
    percentageKey: "freeThrowsPercentage",
  }),
] satisfies StatRow[];

export const advancedStatRows = [
  possessionsStat(),
  ratingStat(
    "進攻效率 ORTG",
    "offensiveRating",
    "每 100 回合得分。常見公式：得分 / 估算回合數 × 100。",
  ),
  ratingStat(
    "防守效率 DRTG",
    "defensiveRating",
    "每 100 回合失分。常見公式：對手得分 / 對手估算回合數 × 100。",
  ),
  ratingStat(
    "淨效率 NETRTG",
    "netRating",
    "公式：進攻效率 ORTG - 防守效率 DRTG，用來看每 100 回合的淨勝分能力。",
  ),
  trueShootingStat(),
  effectiveFieldGoalStat(),
  paceStat(),

  assistPercentageStat(),
  offensiveReboundPercentageStat(),
  turnoverPercentageStat(),
  stat(
    "效率值 EFF",
    "efficiency",
    "API 回傳的效率值。常見公式會把得分、籃板、助攻、抄截、阻攻加總，再扣掉出手未進、罰球未進和失誤。",
  ),
] satisfies StatRow[];
