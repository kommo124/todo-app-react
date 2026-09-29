from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Todo
from ..schemas import TodoCreate, TodoOut, TodoUpdate

router = APIRouter(prefix="/api/todos", tags=["todos"])


def get_todo(todo_id: int, db: Session) -> Todo:
    todo = db.get(Todo, todo_id)
    if todo is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Todo not found")
    return todo


@router.get("", response_model=list[TodoOut])
def list_todos(
    limit: int | None = Query(default=None, ge=1, le=500),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    stmt = select(Todo).order_by(Todo.id.desc()).offset(offset)
    if limit is not None:
        stmt = stmt.limit(limit)
    return db.scalars(stmt).all()


@router.post("", response_model=TodoOut, status_code=status.HTTP_201_CREATED)
def create_todo(payload: TodoCreate, db: Session = Depends(get_db)):
    todo = Todo(**payload.model_dump())
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


@router.get("/{todo_id}", response_model=TodoOut)
def read_todo(todo_id: int, db: Session = Depends(get_db)):
    return get_todo(todo_id, db)


@router.put("/{todo_id}", response_model=TodoOut)
def update_todo(todo_id: int, payload: TodoUpdate, db: Session = Depends(get_db)):
    todo = get_todo(todo_id, db)
    for field, value in payload.model_dump().items():
        setattr(todo, field, value)
    db.commit()
    db.refresh(todo)
    return todo


@router.patch("/{todo_id}/toggle", response_model=TodoOut)
def toggle_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = get_todo(todo_id, db)
    todo.completed = not todo.completed
    db.commit()
    db.refresh(todo)
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = get_todo(todo_id, db)
    db.delete(todo)
    db.commit()
