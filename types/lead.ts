import { boolean, number, object, string, TypeOf } from "zod";

export const updateLeadSchema = object({
  id: string().uuid("Invalid id format.").uuid(),
  isOpened: boolean(),
}).partial();

export const getLeadSchema = object({
  search: string(),
  page: number(),
  limit: number(),
}).partial();

export type updateLeadInput = TypeOf<typeof updateLeadSchema>;
export type getLeadInput = TypeOf<typeof getLeadSchema>;

export interface LeadResponse {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  jobTitle?: string;
  company?: string;
  companySize?: string;
  message?: string;
  budget?: number;
  source: string;
  isOpened: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
