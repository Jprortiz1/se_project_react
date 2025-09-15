// utils/api.js
const baseUrl = "http://localhost:3001";

// GET all items
export async function getItems() {
  const res = await fetch(`${baseUrl}/items`);
  if (!res.ok) throw new Error("Failed to fetch items");
  return res.json();
}

// POST new item
export async function addItem({ name, imageUrl, weather }) {
  const res = await fetch(`${baseUrl}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, imageUrl, weather }),
  });
  if (!res.ok) throw new Error("Failed to add item");
  return res.json();
}

// DELETE item by id
export async function deleteItem(id) {
  const res = await fetch(`${baseUrl}/items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete item");
  return true;
}
