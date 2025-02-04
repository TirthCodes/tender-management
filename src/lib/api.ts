const API_BASE_URL = "/api"


export const fetchData = async (url: string, options?: RequestInit) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    return await response.json();
  } catch (error) {
    console.error(
      "Error fetching data:",
      error instanceof Error ? error?.message : error
    );
    throw error;
  }
};