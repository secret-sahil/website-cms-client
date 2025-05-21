export interface ApiResponse<T = unknown> {
  success: boolean;
  time: string;
  maintenance_info: null | string;
  result: {
    title: string;
    message: string;
    data: T;
  };
}

export interface ApiErrorResponse {
  success: boolean;
  time: string;
  maintenance_info: string | boolean;
  result: {
    title: string;
    error: any;
    raw: any;
  };
}
