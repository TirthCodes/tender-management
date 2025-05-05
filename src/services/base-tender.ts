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