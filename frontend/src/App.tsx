import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import type { Todo, TodoInput } from "./types";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTodos(await api.list());
    } catch {
      setError("Не удалось загрузить задачи");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleCreate = async (title: string, description: string | null) => {
    try {
      const todo = await api.create({ title, description });
      setTodos((prev) => [todo, ...prev]);
      return true;
    } catch {
      setError("Не удалось добавить задачу");
      return false;
    }
  };

  const handleToggle = async (id: number) => {
    try {
      const updated = await api.toggle(id);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch {
      setError("Не удалось обновить задачу");
    }
  };

  const handleSave = async (id: number, input: TodoInput) => {
    try {
      const updated = await api.update(id, input);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return true;
    } catch {
      setError("Не удалось сохранить задачу");
      return false;
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.remove(id);
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Не удалось удалить задачу");
    }
  };

  const done = todos.filter((t) => t.completed).length;

  return (
    <main className="container">
      <header className="header">
        <h1>Задачи</h1>
        {!loading && !error && todos.length > 0 && (
          <span className="counter">
            Выполнено {done} из {todos.length}
          </span>
        )}
      </header>

      <TodoForm onCreate={handleCreate} />

      {error && (
        <div className="error" role="alert">
          <span>{error}</span>
          <button
            className="button small ghost"
            type="button"
            onClick={() => void load()}
          >
            Повторить
          </button>
        </div>
      )}

      {loading ? (
        <p className="empty">Загрузка…</p>
      ) : todos.length === 0 && !error ? (
        <p className="empty">Пока пусто — добавьте первую задачу</p>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
