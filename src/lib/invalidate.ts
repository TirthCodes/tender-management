import { getQueryClient } from "@/app/providers";

export const invalidateQuery = (queryKey: string) => {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({
    queryKey: [queryKey],
  })
}