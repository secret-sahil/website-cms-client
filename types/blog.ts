import { boolean, number, object, string, TypeOf } from "zod";

export const createBlogSchema = object({
  title: string({ required_error: "Job title is required." })
    .min(3, { message: "Job title is too short." })
    .max(250, { message: "Job title is too long." })
    .trim()
    .toLowerCase(),
  description: string({ required_error: "Job description is required." }),
  content: string({ required_error: "Job content is required." }),
  featuredImageId: string(),
  categoryIds: string({ required_error: "Cate  gory is required." }).array(),
  tags: string({ required_error: "Tag(s) are required." }).array(),
});

export const updateBlogSchema = object({
  id: string({ required_error: "Id is required." }).uuid("Invalid id format."),
  title: string()
    .min(3, { message: "Job title is too short." })
    .max(250, { message: "Job title is too long." })
    .trim()
    .toLowerCase(),
  description: string(),
  content: string(),
  featuredImageId: string(),
  categoryIds: string().array(),
  tags: string().array(),
  isPublished: boolean(),
}).partial();

export const getBlogSchema = object({
  search: string(),
  page: number(),
  limit: number(),
}).partial();

export type createBlogInput = TypeOf<typeof createBlogSchema>;
export type updateBlogInput = TypeOf<typeof updateBlogSchema>;
export type getBlogInput = TypeOf<typeof getBlogSchema>;

export interface BlogResponse {
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
