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

export interface ApiResponseWithPagination<T = unknown> {
  success: boolean;
  time: string;
  maintenance_info: null | string;
  result: {
    title: string;
    message: string;
    data: {
      data: T;
      total: number;
      page: number;
      totalPages: number;
    };
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

export type MediaType = "image" | "video" | "gif" | "audio" | "pdf" | "other";

export type ApplicationStatus = "applied" | "in_review" | "hired" | "rejected";

export type Wheredidyouhear = "friend" | "social_media" | "website" | "job_portal" | "other";

export type RoleEnumType = "sales" | "content" | "hr" | "admin";
