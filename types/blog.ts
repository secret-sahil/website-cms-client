import { boolean, number, object, string, TypeOf } from "zod";

export const createBlogSchema = object({
  title: string({ required_error: "Job title is required." })
    .min(3, { message: "Job title is too short." })
    .max(250, { message: "Job title is too long." })
    .trim(),
  description: string({ required_error: "Job description is required." })
    .min(30, { message: "Description is too short." })
    .nonempty(),
  content: string({ required_error: "Job content is required." })
    .min(200, { message: "Content is too short." })
    .nonempty(),
  featuredImageId: string({ required_error: "Featured image is required." }).url(),
  categoryIds: string({ required_error: "Category is required." })
    .uuid({ message: "Invalid category id format." })
    .array()
    .min(1, { message: "At least one category is required." }),
  tags: string({ required_error: "Tag(s) are required." })
    .array()
    .nonempty({ message: "At least one tag is required." }),
});

export const updateBlogSchema = object({
  id: string({ required_error: "Id is required." }).uuid("Invalid id format.").uuid(),
  title: string()
    .min(3, { message: "Job title is too short." })
    .max(250, { message: "Job title is too long." })
    .trim(),
  description: string().min(30, { message: "Description is too short." }).nonempty(),
  content: string().min(200, { message: "Content is too short." }).nonempty(),
  featuredImageId: string().url(),
  categoryIds: string().uuid().array().min(1, { message: "At least one category is required." }),
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
  slug: string;
  title: string;
  content: string;
  description: string;
  featuredImageId: string;
  tags: string[];
  authorId: string;
  isPublished: false;
  isFeatured: false;
  isDeleted: false;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  featuredImage: {
    id: string;
    url: string;
    type: "image";
  };
  author: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: null | string;
  };
  categories: [
    {
      category: {
        id: string;
        name: string;
        slug: string;
      };
    },
  ];
}
