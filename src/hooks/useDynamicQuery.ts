import { useQuery } from "@tanstack/react-query";

export interface Response {
  message: string;
  data: unknown[];
  success: boolean;
}

interface UseDynamicQueryResponse {
  data: Response | undefined;
  isLoading: boolean;
}

export function useDynamicQuery(key: string, fetcher: () => Promise<Response>, enabled: boolean): UseDynamicQueryResponse {
  const { data, isLoading } = useQuery({ queryKey: [key], queryFn: fetcher, enabled });
  return { data, isLoading };
}