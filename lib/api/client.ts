import { unstable_noStore as noStore } from "next/cache";
import { ApiError } from "./error";
import type { ApiResponse } from "./response";

type RequestOptions = RequestInit & {
  revalidate?: number;
};

export async function requestJson<T>(
  url: string,
  options: RequestOptions = {},
): Promise<T> {
  const { revalidate, ...fetchOptions } = options;

  const res = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    next:
      typeof revalidate === "number"
        ? {
            revalidate,
          }
        : undefined,
  });

  // 1. 先攔截 HTTP 狀態碼錯誤
  if (!res.ok) {
    noStore(); // 關鍵：強制宣告此請求為動態，不允許 Next.js 快取這次的結果
    throw new ApiError("API request failed", res.status);
  }

  let json: ApiResponse<T>;

  try {
    json = await res.json();
  } catch {
    throw new ApiError("Invalid JSON response", res.status);
  }

  if (!res.ok || json.success === false) {
    throw new ApiError(
      json.success === false ? json.message : "API request failed",
      res.status,
      json.success === false ? json.code : undefined,
    );
  }

  return json.data;
}
