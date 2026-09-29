import { useState } from "react";
import type { FormEvent } from "react";
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from "../constants";
import type { Todo, TodoInput } from "../types";

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => Promise<void>;
  onSave: (id: number, input: TodoInput) => Promise<boolean>;
  onDelete: (id: number) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onSave, onDelete }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description ?? "");
  const [busy, setBusy] = useState(false);

  const startEditing = () => {
    setTitle(todo.title);
    setDescription(todo.description ?? "");
    setEditing(true);
  };

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const saved = await onSave(todo.id, {
        title: title.trim(),
        description: description.trim() || null,
        completed: todo.completed,
      });
      if (saved) {
        setEditing(false);
      }
    } finally {
      setBusy(false);
    }
  };

  if (editing) {
    return (
      <li className="todo-item">
        <form className="todo-edit" onSubmit={(e) => void handleSave(e)}>
          <input
            className="input"
            value={title}
            maxLength={TITLE_MAX_LENGTH}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="input"
            placeholder="Описание"
            value={description}
            maxLength={DESCRIPTION_MAX_LENGTH}
            onChange={(e) => setDescription(e.target.value)}
          />
          <span className="todo-actions">
            <button
              className="button small"
              type="submit"
              disabled={!title.trim() || busy}
            >
              Сохранить
            </button>
            <button
              className="button small ghost"
              type="button"
              onClick={() => setEditing(false)}
            >
              Отмена
            </button>
          </span>
        </form>
      </li>
    );
  }

  return (
    <li className="todo-item">
      <label className="todo-check">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => void onToggle(todo.id)}
        />
        <span className="todo-text">
          <span className={todo.completed ? "todo-title done" : "todo-title"}>
            {todo.title}
          </span>
          {todo.description && (
            <span className="todo-desc">{todo.description}</span>
          )}
        </span>
      </label>
      <span className="todo-actions">
        <button className="icon-button" type="button" onClick={startEditing}>
          Изменить
        </button>
        <button
          className="icon-button danger"
          type="button"
          onClick={() => void onDelete(todo.id)}
        >
          Удалить
        </button>
      </span>
    </li>
  );
}
