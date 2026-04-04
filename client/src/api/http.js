const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Request failed');
  return res.json();
}
