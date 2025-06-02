import { number, object, string, TypeOf } from "zod";

export const createOfficeSchema = object({
  name: string({ required_error: "Name is required." })
    .min(3, { message: "Name is too short." })
    .max(30, { message: "Name is too long." })
    .trim()
    .nonempty(),
  address: string({ required_error: "Address is required." }).trim().nonempty(),
  city: string({ required_error: "City is required." }).trim().nonempty(),
  state: string({ required_error: "State is required." }).trim().nonempty(),
  country: string({ required_error: "Country is required." }).trim().nonempty(),
  postalCode: string({ required_error: "Postal Code is required." }).trim().nonempty(),
});

export const updateOfficeSchema = object({
  name: string({ required_error: "Name is required." })
    .min(3, { message: "Name is too short." })
    .max(30, { message: "Name is too long." })
    .trim()
    .nonempty(),
  address: string().trim().nonempty(),
  city: string().trim().nonempty(),
  state: string().trim().nonempty(),
  country: string().trim().nonempty(),
  postalCode: string().trim().nonempty(),
}).partial();

export const getOfficeSchema = object({
  search: string(),
  page: number(),
  limit: number(),
}).partial();

export type createOfficeInput = TypeOf<typeof createOfficeSchema>;
export type updateOfficeInput = TypeOf<typeof updateOfficeSchema>;
export type getOfficeInput = TypeOf<typeof getOfficeSchema>;

export interface OfficeResponse {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
