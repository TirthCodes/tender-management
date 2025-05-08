import { fetchData, postData } from "@/lib/api";

export async function getSingleStoneTender(id: number) {
  const response = await fetchData(`/tender/single-stone?id=${id}`);
  return response;
}

export async function createSingleTender(data: unknown) {
  const response = await postData("/tender/single-stone", data);
  return response;
}