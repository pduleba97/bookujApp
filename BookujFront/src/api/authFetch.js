import { authRefresh } from "./authRefresh";
import { getAccessToken } from "./sessionApi";
const API_URL = import.meta.env.VITE_API_URL;

export async function authFetch(url, options = {}) {
  let token = getAccessToken();

  const fetchOptions = {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    credentials: "include",
  };

  if (!(options.body instanceof FormData)) {
    fetchOptions.headers["Content-Type"] = "application/json";
  }

  let response = await fetch(`${API_URL}${url}`, fetchOptions);

  // TOKEN EXPIRED - UNAUTHORIZED
  if (response.status === 401) {
    try {
      await authRefresh();
    } catch (err) {
      console.warn(err);
      window.location.href = "/login"; // REDIRECT TO LOGIN
      return;
    }

    token = getAccessToken();

    // RETRY ORIGINAL REQUEST
    const retryOptions = {
      ...fetchOptions,
      headers: {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      },
    };

    response = await fetch(`${API_URL}${url}`, retryOptions);
  }

  return response;
}
