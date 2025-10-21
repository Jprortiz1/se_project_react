## 🔗 Backend (se_project_express)

This project uses an **Express backend** for authentication and item CRUD operations.

- **Public repo:** https://github.com/Jprortiz1/se_project_express
- **Local base URL:** `http://localhost:3001`
- **Key endpoints:**
  - `POST /signup` – user registration  
  - `POST /signin` – user login (returns `{ token }`)  
  - `GET /users/me` – get current user info (requires `Authorization: Bearer <jwt>`)  
  - `GET /items` – public route  
  - `POST /items` – create a new item (protected)  
  - `DELETE /items/:id` – delete an item (protected)  
  - `PUT /items/:id/likes` / `DELETE /items/:id/likes` – like/unlike an item (protected)

### 🧰 Running the backend locally

```bash
git clone https://github.com/Jprortiz1/se_project_express.git
cd se_project_express
npm ci
npm start   # or npm run dev
