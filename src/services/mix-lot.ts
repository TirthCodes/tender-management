import { fetchData, fetchDelete, postData } from "@/lib/api";
import { MixLotPaylod } from "@/lib/types/tender";

export async function createMixLot(data: MixLotPaylod) {
  const response = await postData("/tender/mix-lot", data);
  return response;
}

export async function getMixLots(baseTenderId: number, page: number) {
  const response = await fetchData(`/tender/mix-lot?baseTenderId=${baseTenderId}&page=${page}`);
  return response;
}

export async function getMixLotById(id: number) {
  const response = await fetchData(`/tender/mix-lot/${id}`);
  return response;
}

export async function deleteMixLot(id: number) {
  const response = await fetchDelete(`/tender/mix-lot/${id}`);
  return response;
}
