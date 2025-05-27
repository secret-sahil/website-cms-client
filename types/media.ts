import { number, object, string, TypeOf } from "zod";
import { MediaType } from "./common";

export const updateMediaSchema = object({
  id: string({ required_error: "Id is required." }).uuid(),
}).partial();

export const getMediaSchema = object({
  type: string(),
  page: number(),
  limit: number(),
}).partial();

export type updateMediaInput = TypeOf<typeof updateMediaSchema>;
export type getMediaInput = TypeOf<typeof getMediaSchema>;

export interface MediaResponse {
  id: string;
  url: string;
  type: MediaType;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
