import { number, object, string, TypeOf } from "zod";

export const createCategorySchema = object({
  name: string({ required_error: "Name is required." })
    .min(3, { message: "Name is too short." })
    .max(30, { message: "Name is too long." })
    .trim()
    .toLowerCase()
    .nonempty(),
});

export const updateCategorySchema = object({
  id: number({ required_error: "Id is required." }),
  name: string({ required_error: "Name is required." })
    .min(3, { message: "Name is too short." })
    .max(30, { message: "Name is too long." })
    .trim()
    .toLowerCase()
    .nonempty(),
}).partial();

export const getCategoriesSchema = object({
  search: string(),
  page: number(),
  limit: number(),
}).partial();

export type createCategoryInput = TypeOf<typeof createCategorySchema>;
export type updateCategoryInput = TypeOf<typeof updateCategorySchema>;
export type getCategoryInput = TypeOf<typeof getCategoriesSchema>;

export interface CategoriesResponse {
  id: string;
  name: string;
  slug: string;
  isPublished: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
