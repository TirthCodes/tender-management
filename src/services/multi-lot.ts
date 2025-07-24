import { fetchData, postData } from "@/lib/api";

export async function createMultiLotTender(data: unknown) {
  const response = await postData("/multi-lot-tender", data);
  return response;
}

export async function getMultiLotTenders(page: number) {
  const response = await fetchData(`/multi-lot-tender?page=${page}`);
  return response;
}

export async function getMultiLotTenderById(id: number) {
  const response = await fetchData(`/multi-lot-tender/${id}`);
  return response;
}