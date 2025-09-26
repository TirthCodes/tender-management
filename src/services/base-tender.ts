import { fetchData, postData } from "@/lib/api";

export async function createBaseTender(data: unknown) {
  const response = await postData("/base-tender", data);
  return response;
}

export async function getBaseTenders(payload: {
  page: number;
  search: string;
  fromDate: string;
  toDate: string;
}) {
  const response = await postData(`/base-tender/filter`, payload);
  return response;
}

export async function getBaseTenderById(id: number) {
  const response = await fetchData(`/base-tender/${id}`);
  return response;
}

export async function getAllTenderFiltered(data: {
  shapes: number[];
  colors: number[];
  clarities: number[];
  fluorescences: number[];
  remark: {
    tenderRemark: string;
    lotRemark: string;
  };
}) {
  return await postData("/all-tender/filter", data);
}
