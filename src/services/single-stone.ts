import { fetchData } from "@/lib/api";

export async function getSingleStoneTender(id: number, page: number) {
  const response = await fetchData(
    `/tender/single-stone?id=${id}&page=${page}`
  );
  return response;
}
