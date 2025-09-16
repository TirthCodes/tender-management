import { fetchData, fetchDelete, postData } from "@/lib/api";
import { MixLotPaylod } from "@/lib/types/tender";

export async function createMixLot(data: MixLotPaylod) {
  const response = await postData("/tender/mix-lot", data);
  return response;
}

export async function getMixLots(baseTenderId: number, page: number, mainLotId?: string) {
  let url = `/tender/mix-lot?baseTenderId=${baseTenderId}&page=${page}`;
  if(mainLotId) {
    url = `${url}&mainLotId=${mainLotId}`;
  }
  const response = await fetchData(url);
  return response;
}


export async function getMixLotById(id: number) {
  const response = await fetchData(`/tender/mix-lot/${id}`);
  return response;
}

export async function getMixLotByBaseTenderId(baseTenderId: number) {
  const response = await fetchData(`/tender/mix-lot/base-tender/${baseTenderId}`);
  return response;
}

export async function deleteMixLot(id: number) {
  const response = await fetchDelete(`/tender/mix-lot/${id}`);
  return response;
}
