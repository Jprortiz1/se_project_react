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
