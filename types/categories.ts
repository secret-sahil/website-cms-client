import { number, object, string, TypeOf } from "zod";

export const createCategorySchema = object({
  name: string({ required_error: "Name is required." })
    .min(3, { message: "Name is too short." })
    .max(30, { message: "Name is too long." })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Name can only contain letters, numbers, and spaces.",
    })
    .trim()
    .toLowerCase()
    .nonempty(),
});

export const updateCategorySchema = object({
  id: number({ required_error: "Id is required." }),
  name: string({ required_error: "Name is required." })
    .min(3, { message: "Name is too short." })
    .max(30, { message: "Name is too long." })
    .regex(/^[a-zA-Z ]+$/, {
      message: "Name can only contain letters, numbers, and spaces.",
    })
    .trim()
    .toLowerCase()
    .nonempty()
    .optional(),
}).partial();

export const getCategoriesSchema = object({
  query: object({
    divisionId: number(),
  }).partial(),
});

export type createCategoryInput = TypeOf<typeof createCategorySchema>;
export type updateCategoryInput = TypeOf<typeof updateCategorySchema>;
export type getCategoryInput = TypeOf<typeof getCategoriesSchema>["query"];

export interface CategoriesResponse {
  id: number;
  name: string;
  divisionId: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  division: {
    id: number;
    name: string;
  };
}
