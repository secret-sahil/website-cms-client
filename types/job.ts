import { boolean, number, object, string, TypeOf } from "zod";

export const createJobSchema = object({
  title: string({ required_error: "Job title is required." })
    .min(3, { message: "Job title is too short." })
    .max(50, { message: "Job title is too long." })
    .trim(),
  description: string({ required_error: "Job description is required." })
    .min(30, { message: "Description is too short." })
    .nonempty(),
  locationId: string({ required_error: "Job Location is required." }).uuid(),
  experience: string({ required_error: "Experience is required." }).trim().nonempty(),
});

export const updateJobSchema = object({
  id: string({ required_error: "Id is required." }).uuid("Invalid id format.").uuid(),
  title: string()
    .min(3, { message: "Job title is too short." })
    .max(250, { message: "Job title is too long." })
    .trim(),
  description: string().min(30, { message: "Description is too short." }).nonempty(),
  locationId: string().uuid(),
  experience: string({ required_error: "Experience is required." }).trim().nonempty(),
  isPublished: boolean(),
}).partial();

export const getJobSchema = object({
  search: string(),
  page: number(),
  limit: number(),
}).partial();

export type createJobInput = TypeOf<typeof createJobSchema>;
export type updateJobInput = TypeOf<typeof updateJobSchema>;
export type getJobInput = TypeOf<typeof getJobSchema>;

export interface JobResponse {
  id: string;
  title: string;
  description: string;
  locationId: string;
  experience: string;
  isPublished: false;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  location: {
    id: string;
    city: string;
  };
}
