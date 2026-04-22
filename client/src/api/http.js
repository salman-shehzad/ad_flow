const getApiUrl = () => {
  const configuredUrl = import.meta.env.VITE_API_URL;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (import.meta.env.PROD) {
    return "/api";
  }

  return "http://localhost:5000/api";
};

const API_URL = getApiUrl();

const request = async (path, options = {}) => {
  const token = localStorage.getItem("adflow_token");
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
};

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path, body) =>
    request(path, { method: "PATCH", body: JSON.stringify(body) }),
};
