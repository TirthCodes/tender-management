import { fetchDelete } from "@/lib/api";

export const deleteFn = async (endPoint: string) => await fetchDelete(endPoint);
