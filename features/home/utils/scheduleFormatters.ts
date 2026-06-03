import type { ScheduleGame } from "@/features/home/types/schedules";

export function formatGameDate(gameDate: string) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(new Date(`${gameDate}T00:00:00+08:00`));
}

export function formatGameTime(gameTime: string) {
  return gameTime.slice(0, 5);
}

export function formatScore(game: ScheduleGame) {
  if (game.homeScore === null || game.awayScore === null) {
    return "vs";
  }

  return `${game.homeScore} - ${game.awayScore}`;
}
