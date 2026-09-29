# Todo App

Туду-лист: бэкенд на **FastAPI** (PostgreSQL), фронтенд на **React + TypeScript (Vite)**, REST API с **Swagger**.

## Стек

| Слой | Технологии |
|---|---|
| Бэкенд | Python, FastAPI, SQLAlchemy 2.0, Pydantic, Uvicorn |
| База данных | PostgreSQL 16 (Docker) |
| Фронтенд | React 19, TypeScript, Vite, чистый CSS |
| API | REST + Swagger UI (`/docs`), ReDoc (`/redoc`) |
| Инфраструктура | Docker Compose (postgres + backend + frontend) |

## Структура

```
sharaga/
├── docker-compose.yml
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app/
│       ├── main.py            # FastAPI-приложение, CORS, роутеры
│       ├── database.py        # подключение к PostgreSQL
│       ├── models.py          # ORM-модель Todo
│       ├── schemas.py         # Pydantic-схемы
│       └── routers/todos.py   # CRUD-эндпоинты
└── frontend/
    ├── Dockerfile
    └── src/
        ├── api.ts             # HTTP-клиент
        ├── types.ts           # типы задач
        ├── App.tsx
        ├── components/        # TodoForm, TodoList, TodoItem
        └── *.css              # стили (светлый минимализм)
```

## Запуск

```bash
docker compose up --build
```

- Приложение: http://localhost:3000
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## REST API

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/todos` | список задач |
| POST | `/api/todos` | создать задачу |
| GET | `/api/todos/{id}` | получить задачу |
| PUT | `/api/todos/{id}` | обновить задачу |
| PATCH | `/api/todos/{id}/toggle` | переключить «выполнено» |
| DELETE | `/api/todos/{id}` | удалить задачу |

### Схема задачи

```json
{
  "id": 1,
  "title": "Купить молоко",
  "description": "Обезжиренное, 1 л",
  "completed": false,
  "created_at": "2026-09-29T12:00:00"
}
```

## Локальная разработка (без Docker)

Бэкенд:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload  # http://localhost:8000
```

Фронтенд (нужен запущенный бэкенд):

```bash
cd frontend
npm install
npm run dev                    # http://localhost:5173
```

Для локального запуска создайте PostgreSQL-базу и задайте переменную `DATABASE_URL` в `backend/.env`:

```
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/todos
```
