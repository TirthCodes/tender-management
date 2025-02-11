import { postData } from "@/lib/api";

export async function createTender(data: unknown) {
  const response = await postData("/tender", data);
  return response;
}

export async function createSingleTender(data: unknown) {
  const response = await postData("/tender/single-stone", data);
  return response;
}