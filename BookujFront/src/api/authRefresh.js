import { clearSession, setAccessToken, setUser } from "./sessionApi";
const API_URL = import.meta.env.VITE_API_URL;

let isRefreshing = false;
let refreshPromise = null;

export async function authRefresh() {
  if (isRefreshing) {
    console.warn("Refresh request is already pending...");
    await refreshPromise;
  } else {
    console.warn("Access token expired — refreshing...");
    isRefreshing = true;

    refreshPromise = (async () => {
      try {
        const refreshResponse = await fetch(`${API_URL}/users/refresh`, {
          method: "POST",
          credentials: "include",
        });

        if (refreshResponse.status !== 200) {
          const error = await refreshResponse.json();
          throw new Error(error.error);
        } else {
          // REFRESH SUCCESSFUL - SAVE NEW ACCESS TOKEN TO SESSION STORAGE
          const data = await refreshResponse.json();
          setAccessToken(data.accessToken);
          setUser(data.user);
          console.log("Refresh complete");
        }
      } catch (err) {
        console.warn(`${err}`);
        clearSession(); // CLEAR ACCESS TOKEN FROM SESSION STORAGE
        throw err;
      } finally {
        isRefreshing = false;
      }
    })();
    await refreshPromise;
  }
}
