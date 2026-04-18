const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
import { getAdminToken } from "../utils/auth.js";

const readJson = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export const submitPhishingForm = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/simulations/login-demo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return readJson(response);
};

export const fetchSimulationStats = async () => {
  const token = getAdminToken();
  const response = await fetch(`${API_BASE_URL}/simulations/stats`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
  });
  return readJson(response);
};

export const loginAdminRequest = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return readJson(response);
};

export const verifyAdminSessionRequest = async () => {
  const token = getAdminToken();

  const response = await fetch(`${API_BASE_URL}/admin/verify`, {
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : {}
  });

  return readJson(response);
};
