// src/utils/api.js

// Usa variable de entorno si existe; si no, localhost:3001
export const baseUrl =
  (import.meta.env?.VITE_API_URL && import.meta.env.VITE_API_URL.trim()) ||
  "http://localhost:3001";

/**
 * checkResponse
 * - Parsea JSON si existe
 * - Adjunta `status` y `body` al Error cuando !ok (útil para chequear 401 en el UI)
 */
export async function checkResponse(res) {
  let data = null;
  try {
    // Puede fallar si no hay cuerpo JSON (p. ej., 204 No Content)
    data = await res.json();
  } catch (_) {
    // ignore
  }

  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) ||
      res.statusText ||
      `Request failed with status ${res.status}`;
    const err = new Error(message);
    err.status = res.status;
    err.body = data;
    throw err;
  }

  // Devuelve el JSON (o {} si no había body)
  return data ?? {};
}

/* =========================
   Public endpoints (sin token)
   ========================= */

// GET /items (público)
export async function getItems() {
  const res = await fetch(`${baseUrl}/items`);
  return checkResponse(res);
}

/* =========================
   Private endpoints (con token)
   ========================= */

// POST /items (requiere token)
export async function addItem({ name, imageUrl, weather }, token) {
  const res = await fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // ← importante
    },
    body: JSON.stringify({
      name,
      imageUrl,
      weather: (weather || "").toLowerCase().trim(), // normaliza
    }),
  });
  return checkResponse(res);
}

// DELETE /items/:id (requiere token)
export async function deleteItem(id, token) {
  const res = await fetch(`${baseUrl}/items/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, // ← importante
    },
  });
  await checkResponse(res);
  return true; // para que el caller sepa que fue OK sin necesitar cuerpo
}

// PATCH /users/me (requiere token)
export async function updateUserProfile(token, { name, avatar }) {
  const res = await fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatar }),
  });
  return checkResponse(res);
}

/* =========================
   Likes (requiere token)
   ========================= */

// PUT /items/:id/likes
export async function addCardLike(cardId, token) {
  const res = await fetch(`${baseUrl}/items/${cardId}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return checkResponse(res);
}

// DELETE /items/:id/likes
export async function removeCardLike(cardId, token) {
  const res = await fetch(`${baseUrl}/items/${cardId}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return checkResponse(res);
}
