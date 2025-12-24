export function getAccessToken() {
  return sessionStorage.getItem("accessToken");
}

export function getUser() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  return user;
}

export function setAccessToken(token) {
  sessionStorage.setItem("accessToken", token);
}

export function setUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("user");
}
