const API_BASE_URL = "/api";

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

export const postData = async (endpoint: string, data?: unknown) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await response.json();
  } catch (error) {
    console.error(
      "Error posting data:",
      error instanceof Error ? error?.message : error
    );
    throw error;
  }
};

export const fetchDelete = async (url: string) => {
  const response = await fetch(url, {
    method: "DELETE"
  })
  return response.json()
};
