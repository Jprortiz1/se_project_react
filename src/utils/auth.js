// src/utils/auth.js
import { baseUrl, checkResponse } from "./api";

/**
 * Auth endpoints (reutilizando checkResponse de api.js)
 */

export async function register(name, avatar, email, password) {
  const res = await fetch(`${baseUrl}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, avatar, email, password }),
  });
  return checkResponse(res);
}

export async function login(email, password) {
  const res = await fetch(`${baseUrl}/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return checkResponse(res);
}

export async function checkToken(token) {
  const res = await fetch(`${baseUrl}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // usa la misma capitalización que en api.js
    },
  });
  return checkResponse(res);
}
