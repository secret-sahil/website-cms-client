import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiErrorResponse, ApiResponse, ApiResponseWithPagination } from "@/types/common";
import Notify from "@/lib/notification";
import { MediaResponse, updateMediaInput, getMediaInput } from "@/types/media";
import Media from "@/api/media";

export const useCreateMedia = () => {
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse>({
    mutationFn: Media.create,
    onSuccess: () => {
      router.push("/media");
      Notify.success("Created successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useGetAllMedia = (data?: getMediaInput) => {
  return useQuery<ApiResponseWithPagination<MediaResponse[]>, ApiErrorResponse>({
    queryFn: () => Media.read(data),
    queryKey: ["media", data?.page, data?.limit, data?.type],
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation<ApiResponse<any>, ApiErrorResponse, updateMediaInput>({
    mutationFn: Media.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      router.push("/media");
      Notify.success("Updated successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<any>, ApiErrorResponse, string>({
    mutationFn: Media.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      Notify.success("Delete successfully.");
    },
    onError: (error) => {
      Notify.error(error.result.error);
    },
  });
};
