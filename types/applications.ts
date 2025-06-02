import { boolean, number, object, string, TypeOf, z } from "zod";

export const updateApplicationsSchema = object({
  id: string({ required_error: "Id is required." }).uuid(),
  status: z.enum(["in_review", "hired", "rejected"]),
  isOpened: boolean(),
}).partial();

export const getApplicationsSchema = object({
  search: string(),
  page: number(),
  limit: number(),
  jobOpeningId: string().uuid(),
}).partial();

export type updateApplicationsInput = TypeOf<typeof updateApplicationsSchema>;
export type getApplicationsInput = TypeOf<typeof getApplicationsSchema>;

export interface ApplicationsResponse {
  id: string;
  jobOpeningId: string;
  status: "applied" | "in_review" | "hired" | "rejected";
  fullName: string;
  email: string;
  phone: string;
  resume: string;
  coverLetter: string;
  linkedIn: string;
  wheredidyouhear: "friend" | "social_media" | "website" | "job_portal" | "other";
  hasSubscribedToNewsletter: boolean;
  isOpened: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
