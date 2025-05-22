import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiErrorResponse, ApiResponse, ApiResponseWithPagination } from "@/types/common";
import Notify from "@/lib/notification";
import {
  createCategoryInput,
  CategoriesResponse,
  updateCategoryInput,
  getCategoryInput,
} from "@/types/categories";
import Categories from "@/api/categories";

export const useCreateCategory = () => {
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, createCategoryInput>({
    mutationFn: Categories.create,
    onSuccess: () => {
      router.push("/blog-categories");
      Notify.success("Created successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useGetAllCategories = (data?: getCategoryInput) => {
  return useQuery<ApiResponseWithPagination<CategoriesResponse[]>, ApiErrorResponse>({
    queryFn: () => Categories.read(data),
    queryKey: ["categories", data?.page, data?.limit, data?.search],
  });
};

export const useGetCategoryById = (id: string) => {
  return useQuery<ApiResponse<CategoriesResponse>, ApiErrorResponse>({
    queryFn: () => Categories.readOne(id),
    queryKey: ["category", id],
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateCategoryInput>({
    mutationFn: Categories.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      router.push("/blog-categories");
      Notify.success("Updated successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, string>({
    mutationFn: Categories.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      Notify.success("Delete successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
