// src/utils/api.js
const baseUrl = "http://localhost:3001";

// ✅ ÚNICA función reutilizable para revisar respuestas
export async function checkResponse(res) {
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}${msg ? `: ${msg}` : ""}`);
  }
  return res.json();
}

// GET all items
export async function getItems() {
  const res = await fetch(`${baseUrl}/items`);
  return checkResponse(res);
}

// POST new item
export async function addItem({ name, imageUrl, weather }) {
  const res = await fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      imageUrl,
      weather: (weather || "").toLowerCase().trim(),
    }),
  });
  return checkResponse(res);
}

// DELETE item by id
export async function deleteItem(id) {
  const res = await fetch(`${baseUrl}/items/${id}`, { method: "DELETE" });
  await checkResponse(res);
  return true;
}

export async function updateUserProfile(token, { name, avatar }) {
  return fetch(`${baseUrl}/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, avatar }),
  }).then(async (res) => {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data.message || res.statusText || "Update failed";
      throw new Error(message);
    }
    return data;
  });
}

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.message || res.statusText || "Unknown error";
    throw new Error(message);
  }
  return data;
}

// Add a like to a card
export function addCardLike(cardId, token) {
  return fetch(`${baseUrl}/items/${cardId}/likes`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}

// Remove a like from a card
export function removeCardLike(cardId, token) {
  return fetch(`${baseUrl}/items/${cardId}/likes`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleResponse);
}
