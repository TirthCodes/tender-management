import { MainLotUpdate } from "@/app/api/main-lot/[id]/route";
import { fetchData, patchData, postData } from "@/lib/api";

export async function createMultiLotTender(data: unknown) {
  const response = await postData("/multi-lot-tender", data);
  return response;
}

export async function getMultiLotTenders(page: number, tenderType: string) {
  const response = await fetchData(`/multi-lot-tender?page=${page}&tenderType=${tenderType}`);
  return response;
}

export async function getMultiLotTenderById(id: number) {
  const response = await fetchData(`/multi-lot-tender/${id}`);
  return response;
}

export async function updateMainLot(data: MainLotUpdate, id: number) {
  const response = await patchData(`/main-lot/${id}`, data);
  return response;
}

export async function getMultiLotTenderByBaseTenderId(id: number) {
  const response = await fetchData(`/multi-lot-tender/base-tender/${id}`);
  return response;
}