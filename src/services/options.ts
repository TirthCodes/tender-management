import { fetchData } from "@/lib/api";

export async function getColorOptions() {
  const response = await fetchData("/color-options");
  return response;
}

export async function getClarityOptions() {
  const response = await fetchData("/clarity-options");
  return response;
}

export async function getFluorescenceOptions() {
  const response = await fetchData("/fluorescence-options");
  return response;
}

export async function getShapeOptions() {
  const response = await fetchData("/shape-options");
  return response;
}