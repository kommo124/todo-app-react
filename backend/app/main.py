import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import todos

DEFAULT_ORIGINS = (
    "http://localhost:5173,http://127.0.0.1:5173,"
    "http://localhost:3000,http://127.0.0.1:3000"
)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",")
    if origin.strip()
]

app = FastAPI(
    title="Todo API",
    description="REST API туду-листа: задачи с отметкой о выполнении.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)

app.include_router(todos.router)


@app.get("/", tags=["health"])
def root():
    return {"message": "Todo API is running"}
