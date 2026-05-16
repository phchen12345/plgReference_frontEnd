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
