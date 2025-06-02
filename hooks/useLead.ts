import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiErrorResponse, ApiResponse, ApiResponseWithPagination } from "@/types/common";
import Notify from "@/lib/notification";
import { LeadResponse, updateLeadInput, getLeadInput } from "@/types/lead";
import Lead from "@/api/lead";

export const useGetAllLead = (data?: getLeadInput) => {
  return useQuery<ApiResponseWithPagination<LeadResponse[]>, ApiErrorResponse>({
    queryFn: () => Lead.read(data),
    queryKey: ["lead", data?.page, data?.limit, data?.search],
    refetchOnWindowFocus: false,
  });
};

export const useGetLeadById = (id: string) => {
  return useQuery<ApiResponse<LeadResponse>, ApiErrorResponse>({
    queryFn: () => Lead.readOne(id),
    queryKey: ["lead", id],
  });
};

export const useMarkLeadAsRead = () => {
  // const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateLeadInput>({
    mutationFn: Lead.update,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["lead"] });
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
