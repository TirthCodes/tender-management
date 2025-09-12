import { fetchData, postData } from "@/lib/api";

export async function createBaseTender(data: unknown) {
  const response = await postData("/base-tender", data);
  return response;
}

export async function getBaseTenders(page: number) {
  const response = await fetchData(`/base-tender?page=${page}`);
  return response;
}

export async function getBaseTenderById(id: number) {
  const response = await fetchData(`/base-tender/${id}`);
  return response;
}

export async function getBaseTenderFiltered(data: {
  shapes: number[];
  colors: number[];
  clarities: number[];
  fluorescences: number[];
}) {
  return await postData("/base-tender/filter", data);
}