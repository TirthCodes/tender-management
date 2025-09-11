import { fetchData, fetchDelete, postData } from "@/lib/api";
import { RoughLotPaylod } from "@/lib/types/tender";

export async function createRoughLot(data: RoughLotPaylod) {
  const response = await postData("/tender/rough-lot", data);
  return response;
}

export async function getRoughLots(baseTenderId: number, page: number, mainLotId?: string) {
  let url = `/tender/rough-lot?baseTenderId=${baseTenderId}&page=${page}`;
  if(mainLotId) {
    url = `${url}&mainLotId=${mainLotId}`;
  }
  const response = await fetchData(url);
  return response;
}

export async function getRoughLotById(id: number) {
  const response = await fetchData(`/tender/rough-lot/${id}`);
  return response;
}

export async function deleteRoughLot(id: number) {
  const response = await fetchDelete(`/tender/rough-lot/${id}`);
  return response;
}
