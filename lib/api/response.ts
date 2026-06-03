export type Pagination = {
  total: number;
  limit: number;
  offset: number;
  page: number;
  pageCount: number;
};

export type PaginatedData<T> = {
  items: T[];
  pagination: Pagination;
};

export type ApiSuccessResponse<T> = {
  success: true;
  code: number | string;
  data: T;
  message?: string;
};

export type ApiErrorResponse = {
  success: false;
  code: number | string;
  message?: string;
  status?: number;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
