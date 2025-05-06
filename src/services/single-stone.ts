import { fetchData } from "@/lib/api";

export async function getSingleStoneTender(id: number) {
  const response = await fetchData(`/tender/single-stone?id=${id}`);
  return response;
}
