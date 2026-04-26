import { MESSAGES_URL, PORTFOLIOS_URL, SKILLS_URL } from "../constants";

export const getAdminToken = () => localStorage.getItem("admin_token") || "";

export const redirectToAdminLogin = () => {
  localStorage.removeItem("admin_token");
  if (window.location.pathname !== "/admin/login") {
    window.location.href = "/admin/login";
  }
};

export const requireAdminToken = () => {
  const token = getAdminToken();
  if (!token) {
    redirectToAdminLogin();
    return "";
  }
  return token;
};

const withAuthHeaders = (token, headers = {}) => ({
  ...headers,
  Authorization: `Bearer ${token}`,
});

export const authJsonFetch = async (url, { method = "GET", token, body } = {}) => {
  const response = await fetch(url, {
    method,
    headers: withAuthHeaders(token, { "Content-Type": "application/json" }),
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    redirectToAdminLogin();
    throw new Error(payload.message || "Unauthorized");
  }
  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export const authFormFetch = async (url, { method = "POST", token, formData } = {}) => {
  const response = await fetch(url, {
    method,
    headers: withAuthHeaders(token),
    body: formData,
  });

  const payload = await response.json().catch(() => ({}));
  if (response.status === 401) {
    redirectToAdminLogin();
    throw new Error(payload.message || "Unauthorized");
  }
  if (!response.ok) {
    throw new Error(payload.message || `Request failed with status ${response.status}`);
  }

  return payload;
};

export const adminApi = {
  skills: {
    list: (token) => authJsonFetch(SKILLS_URL, { token }),
    create: (token, formData) => authFormFetch(SKILLS_URL, { token, formData }),
    update: (token, id, formData) => authFormFetch(`${SKILLS_URL}/${id}`, { method: "PUT", token, formData }),
    remove: (token, id) => authJsonFetch(`${SKILLS_URL}/${id}`, { method: "DELETE", token }),
  },
  portfolios: {
    list: (token) => authJsonFetch(PORTFOLIOS_URL, { token }),
    create: (token, formData) => authFormFetch(PORTFOLIOS_URL, { token, formData }),
    update: (token, id, formData) =>
      authFormFetch(`${PORTFOLIOS_URL}/${id}`, { method: "PUT", token, formData }),
    remove: (token, id) => authJsonFetch(`${PORTFOLIOS_URL}/${id}`, { method: "DELETE", token }),
  },
  messages: {
    list: (token) => authJsonFetch(MESSAGES_URL, { token }),
    remove: (token, id) => authJsonFetch(`${MESSAGES_URL}/${id}`, { method: "DELETE", token }),
  },
};
