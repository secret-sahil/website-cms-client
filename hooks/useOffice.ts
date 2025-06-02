import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiErrorResponse, ApiResponse, ApiResponseWithPagination } from "@/types/common";
import Notify from "@/lib/notification";
import {
  createOfficeInput,
  OfficeResponse,
  updateOfficeInput,
  getOfficeInput,
} from "@/types/office";
import Office from "@/api/office";

export const useCreateOffice = () => {
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, createOfficeInput>({
    mutationFn: Office.create,
    onSuccess: () => {
      router.push("/offices");
      Notify.success("Created successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useGetAllOffice = (data?: getOfficeInput) => {
  return useQuery<ApiResponseWithPagination<OfficeResponse[]>, ApiErrorResponse>({
    queryFn: () => Office.read(data),
    queryKey: ["office", data?.page, data?.limit, data?.search],
  });
};

export const useGetOfficeById = (id: string) => {
  return useQuery<ApiResponse<OfficeResponse>, ApiErrorResponse>({
    queryFn: () => Office.readOne(id),
    queryKey: ["office", id],
  });
};

export const useUpdateOffice = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateOfficeInput>({
    mutationFn: Office.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["office"] });
      router.push("/offices");
      Notify.success("Updated successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useDeleteOffice = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, string>({
    mutationFn: Office.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["office"] });
      Notify.success("Delete successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
