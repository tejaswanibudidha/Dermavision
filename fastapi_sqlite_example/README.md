# FastAPI + SQLite + HTML/JS Example

This example shows how to connect a frontend (HTML/CSS/JS) to a FastAPI backend using SQLite.

## Project Structure

- `backend/` FastAPI + SQLAlchemy + SQLite
- `frontend/` Simple HTML, CSS, JavaScript UI

## Backend Code (FastAPI + SQLite)

### APIs implemented

- `POST /users` → Add a new user
- `GET /users` → Get all users
- `PUT /users/{id}` → Update an existing user
- `DELETE /users/{id}` → Delete a user

### Database setup

The SQLite database file is `backend/users.db`.

The `users` table is created automatically on startup by:

```python
Base.metadata.create_all(bind=engine)
```

Table fields:
- `id` (integer primary key)
- `name` (text)
- `email` (text)

## Run Instructions

### 1) Run backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend runs at: `http://127.0.0.1:8000`

### 2) Run frontend

Open a new terminal:

```bash
cd frontend
python -m http.server 5500
```

Then open:

- `http://127.0.0.1:5500`

The frontend calls FastAPI at `http://127.0.0.1:8000` using JSON via `fetch()`.

## API JSON Examples

### POST `/users`

Request body:

```json
{
  "name": "Alice",
  "email": "alice@example.com"
}
```

Response:

```json
{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com"
}
```

### GET `/users`

Response:

```json
[
  {
    "id": 1,
    "name": "Alice",
    "email": "alice@example.com"
  }
]
```

### PUT `/users/1`

Request body:

```json
{
  "name": "Alice Updated",
  "email": "alice.updated@example.com"
}
```

Response:

```json
{
  "id": 1,
  "name": "Alice Updated",
  "email": "alice.updated@example.com"
}
```

### DELETE `/users/1`

Response:

```json
{
  "message": "User deleted successfully"
}

