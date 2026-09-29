# Todo App

Туду-лист: бэкенд на **FastAPI** (PostgreSQL), фронтенд на **React + TypeScript**, REST API со **Swagger**. Поднимается одной командой через Docker Compose.

## Быстрый старт

Нужен только [Docker](https://docs.docker.com/desktop/) (Docker Desktop / Engine).

```bash
docker compose up --build
```

Первая сборка скачает образы и зависимости — займёт пару минут. Когда контейнеры запустятся:

| Что | Где |
|---|---|
| Приложение | http://localhost:3000 |
| Swagger UI | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

Остановить:

```bash
docker compose down
```

Задачи хранятся в Docker-томе `pgdata` — переживают перезапуск `docker compose down` и `up`. Чтобы удалить всё вместе с данными: `docker compose down -v`.

Фон запускает три контейнера: `db` (PostgreSQL 16) → `backend` (FastAPI, сам накатывает миграции Alembic при старте) → `frontend` (nginx раздаёт собранный React и проксирует `/api` на бэкенд — никаких CORS-проблем).

## Стек

| Слой | Технологии |
|---|---|
| Бэкенд | Python, FastAPI, SQLAlchemy 2.0, Alembic, Pydantic, Uvicorn |
| База данных | PostgreSQL 16 (Docker) |
| Фронтенд | React 19, TypeScript, Vite, чистый CSS |
| API | REST + Swagger UI (`/docs`), ReDoc (`/redoc`) |

## Структура

```
sharaga/
├── docker-compose.yml        # db + backend + frontend
├── backend/
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example          # шаблон переменных окружения
│   ├── alembic.ini
│   ├── alembic/versions/     # миграции
│   └── app/
│       ├── main.py           # FastAPI-приложение, CORS, роутеры
│       ├── database.py       # подключение к PostgreSQL (DATABASE_URL из env)
│       ├── models.py         # ORM-модель Todo
│       ├── schemas.py        # Pydantic-схемы
│       ├── constants.py      # лимиты полей
│       └── routers/todos.py  # CRUD-эндпоинты
└── frontend/
    ├── Dockerfile            # node build → nginx
    ├── nginx.conf            # статика + прокси /api → backend
    └── src/
        ├── api.ts            # HTTP-клиент
        ├── types.ts          # типы задач
        ├── constants.ts      # лимиты полей (как на бэке)
        ├── App.tsx
        ├── components/       # TodoForm, TodoList, TodoItem
        └── *.css             # стили (светлый минимализм)
```

## REST API

| Метод | Путь | Описание |
|---|---|---|
| GET | `/api/todos` | список задач (`?limit=`, `?offset=`) |
| POST | `/api/todos` | создать задачу |
| GET | `/api/todos/{id}` | получить задачу |
| PUT | `/api/todos/{id}` | обновить задачу целиком |
| PATCH | `/api/todos/{id}/toggle` | переключить «выполнено» |
| DELETE | `/api/todos/{id}` | удалить задачу |

### Схема задачи

```json
{
  "id": 1,
  "title": "Купить молоко",
  "description": "Обезжиренное, 1 л",
  "completed": false,
  "created_at": "2026-09-29T12:00:00Z"
}
```

## Разработка без Docker

Понадобятся Python 3.12+ и Node.js 20+, а также запущенный PostgreSQL (например, `docker run -d --name todo-pg -e POSTGRES_USER=todo -e POSTGRES_PASSWORD=todo -e POSTGRES_DB=todos -p 5432:5432 postgres:16`).

**Бэкенд** (http://localhost:8000):

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
pip install -r requirements.txt
copy .env.example .env          # задать DATABASE_URL (см. ниже)
alembic upgrade head            # создать таблицы (один раз)
uvicorn app.main:app --reload
```

**Фронтенд** (http://localhost:5173, проксирует `/api` на бэкенд):

```bash
cd frontend
npm install
npm run dev
```

## Переменные окружения

| Переменная | Где | По умолчанию | Зачем |
|---|---|---|---|
| `DATABASE_URL` | backend | — | строка подключения SQLAlchemy, обязателен |
| `ALLOWED_ORIGINS` | backend | `http://localhost:5173,http://localhost:3000` | CORS, через запятую |
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | compose | `todo` / `todo` / `todos` | креды контейнера БД |
| `VITE_API_TARGET` | frontend (dev) | `http://127.0.0.1:8000` | куда vite проксирует `/api` |

Креды в коде не хранятся: `backend/.env` в `.gitignore`, шаблон — `backend/.env.example`.
