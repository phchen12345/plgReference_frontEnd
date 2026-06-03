"use client";

import type { ApiResponse } from "@/lib/api/response";
import type { GameStatus, ScheduleResponse } from "../types/schedules";

type GetClientScheduleParams = {
  leagueCode: string;
  season: string;
  status?: GameStatus;
  teamId?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getClientSchedule({
  leagueCode,
  season,
  status,
  page = 1,
  limit = 10,
  sort,
  order,
  teamId,
}: GetClientScheduleParams): Promise<ScheduleResponse> {
  if (!API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL");
  }

  const offset = (page - 1) * limit;
  const searchParams = new URLSearchParams({
    leagueCode,
    season,
    limit: String(limit),
    offset: String(offset),
  });

  if (status) {
    searchParams.set("status", status);
  }

  if (sort) {
    searchParams.set("sort", sort);
  }

  if (order) {
    searchParams.set("order", order);
  }

  if (teamId) {
    searchParams.set("teamId", String(teamId));
  }

  const res = await fetch(`${API_BASE_URL}/api/schedule?${searchParams}`);
  const json: ApiResponse<ScheduleResponse> = await res.json();

  if (!res.ok || json.success === false) {
    throw new Error(json.success === false ? json.message : "賽程資料讀取失敗");
  }

  return json.data;
}
