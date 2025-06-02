import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiErrorResponse, ApiResponse, ApiResponseWithPagination } from "@/types/common";
import Notify from "@/lib/notification";
import {
  ApplicationsResponse,
  updateApplicationsInput,
  getApplicationsInput,
} from "@/types/applications";
import Applications from "@/api/applications";

export const useGetAllApplications = (data?: getApplicationsInput) => {
  return useQuery<ApiResponseWithPagination<ApplicationsResponse[]>, ApiErrorResponse>({
    queryFn: () => Applications.read(data),
    queryKey: ["applications", data?.page, data?.limit, data?.search],
    refetchOnWindowFocus: false,
  });
};

export const useGetApplicationsById = (id: string) => {
  return useQuery<ApiResponse<ApplicationsResponse>, ApiErrorResponse>({
    queryFn: () => Applications.readOne(id),
    queryKey: ["applications", id],
  });
};

export const useUpdateApplications = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateApplicationsInput>({
    mutationFn: Applications.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      Notify.success("Updated successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useViewApplication = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateApplicationsInput>({
    mutationFn: Applications.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
