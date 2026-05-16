export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  code?: string;
  status?: number;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
