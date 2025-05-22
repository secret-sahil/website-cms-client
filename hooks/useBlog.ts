import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiErrorResponse, ApiResponse, ApiResponseWithPagination } from "@/types/common";
import Notify from "@/lib/notification";
import { createBlogInput, BlogResponse, updateBlogInput, getBlogInput } from "@/types/blog";
import Blog from "@/api/blog";

export const useCreateBlog = () => {
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, createBlogInput>({
    mutationFn: Blog.create,
    onSuccess: () => {
      router.push("/blog");
      Notify.success("Created successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useGetAllBlog = (data?: getBlogInput) => {
  return useQuery<ApiResponseWithPagination<BlogResponse[]>, ApiErrorResponse>({
    queryFn: () => Blog.read(data),
    queryKey: ["blog", data?.page, data?.limit, data?.search],
  });
};

export const useGetBlogById = (id: string) => {
  return useQuery<ApiResponse<BlogResponse>, ApiErrorResponse>({
    queryFn: () => Blog.readOne(id),
    queryKey: ["blog", id],
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateBlogInput>({
    mutationFn: Blog.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      router.push("/blog");
      Notify.success("Updated successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, string>({
    mutationFn: Blog.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      Notify.success("Delete successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
