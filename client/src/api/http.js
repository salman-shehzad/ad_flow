const normalizeApiUrl = (value) => value.replace(/\/+$/, "");

const getApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim();

  if (configuredUrl) {
    const isLocalhostUrl =
      configuredUrl.includes("localhost") || configuredUrl.includes("127.0.0.1");

    // Protect production deployments from stale localhost env vars on Vercel.
    if (!(import.meta.env.PROD && isLocalhostUrl)) {
      return normalizeApiUrl(configuredUrl);
    }
  }

  if (import.meta.env.PROD) {
    return "/api";
  }

  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();

const request = async (path, options = {}) => {
  const token = localStorage.getItem("adflow_token");

  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message === "Failed to fetch") {
      throw new Error("Could not reach the live API. Check VITE_API_URL and Vercel deployment settings.");
    }

    throw error;
  }
};

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
};
