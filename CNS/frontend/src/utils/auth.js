const ADMIN_TOKEN_KEY = "vti_admin_token";

// Stores JWT token after backend login succeeds.
export const setAdminAuthenticated = (token) => {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const getAdminToken = () => {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
};

export const logoutAdmin = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const isAdminAuthenticated = () => {
  return Boolean(getAdminToken());
};
