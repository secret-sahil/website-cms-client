import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiErrorResponse, ApiResponse, ApiResponseWithPagination } from "@/types/common";
import Notify from "@/lib/notification";
import { createJobInput, JobResponse, updateJobInput, getJobInput } from "@/types/job";
import Job from "@/api/job";

export const useCreateJob = () => {
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, createJobInput>({
    mutationFn: Job.create,
    onSuccess: () => {
      router.push("/jobs");
      Notify.success("Created successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useGetAllJob = (data?: getJobInput) => {
  return useQuery<ApiResponseWithPagination<JobResponse[]>, ApiErrorResponse>({
    queryFn: () => Job.read(data),
    queryKey: ["jobs", data?.page, data?.limit, data?.search],
  });
};

export const useGetJobById = (id: string) => {
  return useQuery<ApiResponse<JobResponse>, ApiErrorResponse>({
    queryFn: () => Job.readOne(id),
    queryKey: ["jobs", id],
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateJobInput>({
    mutationFn: Job.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/jobs");
      Notify.success("Updated successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, string>({
    mutationFn: Job.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      Notify.success("Delete successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
